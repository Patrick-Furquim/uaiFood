import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api'; // Nosso axios configurado
import AuthContext from '../context/AuthContext';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    // Busca dados da API ao carregar a página
    async function fetchData() {
      try {
        const catResponse = await api.get('/categories');
        setCategories(catResponse.data);

        const itemResponse = await api.get('/items');
        setItems(itemResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    }
    fetchData();
  }, []);

 return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🥡 Cardápio uaiFood</h1>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* Link para o Carrinho */}
            <button onClick={() => navigate('/checkout')} style={{background: 'orange', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>
              🛒 Carrinho ({cartItems.length})
            </button>

            {user ? (
              <div>
                <span>Olá, {user.name}! </span>
                <button onClick={logout} style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}>Sair</button>
              </div>
            ) : (
              <a href="/login">Login</a>
            )}
        </div>
      </header>

      {categories.map(category => (
        <div key={category.id} style={{ marginBottom: '30px' }}>
          <h2 style={{ borderBottom: '2px solid orange', display: 'inline-block' }}>{category.description}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '10px' }}>
            {items.filter(item => item.categoryId === category.id).map(item => (
                <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                  <h3>{item.description}</h3>
                  <p style={{ color: 'green', fontWeight: 'bold' }}>R$ {Number(item.unitPrice).toFixed(2)}</p>
                  
                  {/* Botão de Comprar */}
                  <button 
                    onClick={() => addToCart(item)}
                    style={{ width: '100%', marginTop: '10px', padding: '8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + Adicionar
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;