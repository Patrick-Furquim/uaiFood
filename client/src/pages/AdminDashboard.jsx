import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]); // Lista de produtos
  
  const [catDescription, setCatDescription] = useState('');
  
  // Estado do formulário de produto
  const [itemData, setItemData] = useState({
    description: '',
    unitPrice: '',
    categoryId: ''
  });

  // Estado para controlar se estamos editando (guarda o ID do item)
  const [editingItemId, setEditingItemId] = useState(null);

  // --- BUSCAR DADOS INICIAIS ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Busca categorias e itens em paralelo
      const [catResponse, itemResponse] = await Promise.all([
        api.get('/categories'),
        api.get('/items')
      ]);
      setCategories(catResponse.data);
      setItems(itemResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  // --- AÇÕES DE CATEGORIA ---
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { description: catDescription });
      alert('Categoria criada!');
      setCatDescription(''); 
      fetchData(); 
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteCategory = async (id) => {
    if(!confirm('Tem certeza? Isso pode falhar se houver produtos nesta categoria.')) return;
    try {
      await api.delete(`/categories/${id}`);
      alert('Categoria removida!');
      fetchData();
    } catch (error) {
      alert('Erro: ' + (error.response?.data?.message || error.message));
    }
  }

  // --- AÇÕES DE PRODUTO (CRIAR / EDITAR / DELETAR) ---

  // 1. Enviar Formulário (Cria ou Atualiza dependendo do modo)
  const handleSubmitItem = async (e) => {
    e.preventDefault();
    
    const payload = {
      description: itemData.description,
      unitPrice: parseFloat(itemData.unitPrice),
      categoryId: parseInt(itemData.categoryId)
    };

    try {
      if (editingItemId) {
        // MODO EDIÇÃO: PUT
        await api.put(`/items/${editingItemId}`, payload);
        alert('Produto atualizado com sucesso!');
      } else {
        // MODO CRIAÇÃO: POST
        await api.post('/items', payload);
        alert('Produto criado com sucesso!');
      }

      // Limpar tudo e recarregar
      setItemData({ description: '', unitPrice: '', categoryId: '' });
      setEditingItemId(null); // Sai do modo edição
      fetchData();

    } catch (error) {
      alert('Erro: ' + (error.response?.data?.message || error.message));
    }
  };

  // 2. Prepara para Editar (Preenche o formulário)
  const handleEditItem = (item) => {
    setItemData({
      description: item.description,
      unitPrice: item.unitPrice,
      categoryId: item.categoryId
    });
    setEditingItemId(item.id); // Ativa modo edição
    
    // Rola a página para o topo (para ver o formulário)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Cancelar Edição
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setItemData({ description: '', unitPrice: '', categoryId: '' });
  };

  // 4. Deletar Item
  const handleDeleteItem = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await api.delete(`/items/${id}`);
      alert('Produto excluído!');
      fetchData();
    } catch (error) {
      alert('Erro ao excluir: ' + (error.response?.data?.message || error.message));
    }
  };

  // Helper para pegar nome da categoria pelo ID
  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.description : 'N/A';
  };

  return (
    <div>
      {/* Navbar Admin */}
      <header className="navbar" style={{background: '#333', color: '#fff'}}>
        <div className="navbar-brand" style={{color: '#fff'}}>⚙️ Painel <span>Admin</span></div>
        <button onClick={() => navigate('/')} className="btn btn-outline" style={{color: '#fff', borderColor: '#fff'}}>
          Voltar para Loja
        </button>
      </header>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* === FORMULÁRIO DE PRODUTO (CRIAR / EDITAR) === */}
          <div className="card" style={{border: editingItemId ? '2px solid orange' : 'none'}}>
            <h3 style={{ color: editingItemId ? 'orange' : '#4caf50', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              {editingItemId ? '✏️ Editando Produto' : '2. Novo Produto'}
            </h3>
            
            <form onSubmit={handleSubmitItem}>
              <div className="form-group">
                <label>Descrição</label>
                <input 
                  className="form-control"
                  value={itemData.description}
                  onChange={(e) => setItemData({...itemData, description: e.target.value})}
                  placeholder="Ex: X-Salada"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Preço (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={itemData.unitPrice}
                    onChange={(e) => setItemData({...itemData, unitPrice: e.target.value})}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Categoria</label>
                  <select 
                    className="form-control"
                    value={itemData.categoryId}
                    onChange={(e) => setItemData({...itemData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Selecione...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.description}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" className={`btn btn-block ${editingItemId ? 'btn-primary' : 'btn-success'}`}>
                    {editingItemId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
                
                {editingItemId && (
                  <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* === FORMULÁRIO DE CATEGORIA === */}
          <div className="card">
            <h3 style={{ color: '#ff9800', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              1. Nova Categoria
            </h3>
            
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>Nome</label>
                <input 
                  className="form-control"
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Ex: Promoções"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Salvar Categoria</button>
            </form>

            {/* Lista rápida de categorias */}
            <div style={{marginTop: '20px', maxHeight: '200px', overflowY: 'auto'}}>
                <h4 style={{fontSize: '0.9rem', color: '#666'}}>Categorias Existentes:</h4>
                <ul style={{paddingLeft: '20px', marginTop: '5px'}}>
                    {categories.map(cat => (
                        <li key={cat.id} style={{marginBottom: '5px', display: 'flex', justifyContent: 'space-between'}}>
                            {cat.description}
                            <button onClick={() => handleDeleteCategory(cat.id)} style={{border:'none', background:'none', color:'red', cursor:'pointer', fontSize:'0.8rem'}}>Excluir</button>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

        </div>

        {/* === LISTAGEM DE PRODUTOS (PARA GERENCIAR) === */}
        <div style={{marginTop: '50px'}}>
            <h2 style={{borderLeft: '5px solid #333', paddingLeft: '15px', marginBottom: '20px'}}>Gerenciar Cardápio</h2>
            
            <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
                    <thead style={{background: '#f4f4f4'}}>
                        <tr>
                            <th style={{padding: '12px', textAlign: 'left'}}>ID</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Descrição</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Preço</th>
                            <th style={{padding: '12px', textAlign: 'left'}}>Categoria</th>
                            <th style={{padding: '12px', textAlign: 'center'}}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                                <td style={{padding: '12px'}}>#{item.id}</td>
                                <td style={{padding: '12px', fontWeight: 'bold'}}>{item.description}</td>
                                <td style={{padding: '12px', color: 'green'}}>R$ {Number(item.unitPrice).toFixed(2)}</td>
                                <td style={{padding: '12px'}}>{getCategoryName(item.categoryId)}</td>
                                <td style={{padding: '12px', textAlign: 'center'}}>
                                    <button 
                                        onClick={() => handleEditItem(item)}
                                        className="btn btn-sm btn-primary" 
                                        style={{marginRight: '5px'}}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{padding: '20px', textAlign: 'center', color: '#888'}}>Nenhum produto cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;