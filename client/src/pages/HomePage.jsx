import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, logout } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catResponse, itemResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/items')
        ]);
        setCategories(catResponse.data);
        setItems(itemResponse.data);
        setError(null);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
        setError("Não foi possível carregar o cardápio. Verifique o servidor.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="container" style={{textAlign: 'center'}}><h2>⏳ Carregando delícias...</h2></div>;
  if (error) return <div className="container" style={{textAlign: 'center', color: 'red'}}><h2>⚠️ {error}</h2></div>;

  return (
    <div>
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">🥡 uai<span>Food</span></div>
        
        <div className="navbar-actions">
            <button 
              onClick={() => navigate('/checkout')} 
              className="btn btn-primary"
            >
              🛒 Carrinho ({cartItems.length})
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Olá, <strong>{user.name}</strong></span>
                
                {/* --- BOTÃO EXCLUSIVO DO ADMIN --- */}
                {user.Usertype === 'ADMIN' && (
                  <button 
                    onClick={() => navigate('/admin')} 
                    className="btn btn-secondary btn-sm"
                    title="Acessar Painel Administrativo"
                  >
                    ⚙️ Painel
                  </button>
                )}
                
                <button onClick={logout} className="btn btn-outline btn-sm">Sair</button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-secondary">Entrar</button>
            )}
        </div>
      </header>

      <div className="container">
        {/* Estado Vazio */}
        {categories.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            <h3>O cardápio está vazio. 😔</h3>
            {user?.Usertype === 'ADMIN' && (
                <p>Vá ao <strong style={{cursor: 'pointer', color: 'orange'}} onClick={() => navigate('/admin')}>Painel</strong> para cadastrar itens.</p>
            )}
          </div>
        )}

        {/* Listagem */}
        {categories.map(category => {
          const categoryItems = items.filter(item => item.categoryId === category.id);
          
          // Opcional: Não mostrar categorias vazias
          if (categoryItems.length === 0) return null;

          return (
            <div key={category.id} className="category-section">
              <h2 className="category-title">{category.description}</h2>
              
              <div className="products-grid">
                {categoryItems.map(item => (
                    <div key={item.id} className="product-card">
                      <div className="product-info">
                        <h3>{item.description}</h3>
                      </div>
                      <div>
                        <div className="product-price">
                          R$ {Number(item.unitPrice).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => addToCart(item)}
                          className="btn btn-success btn-block btn-sm"
                        >
                          + Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default HomePage;