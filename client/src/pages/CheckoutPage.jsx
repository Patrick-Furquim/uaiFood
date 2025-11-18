import React, { useContext, useState } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, total, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('Pix');

  const handleFinishOrder = async () => {
    if (!user) {
      alert('Faça login para finalizar!');
      return navigate('/login');
    }

    if (cartItems.length === 0) return alert('Carrinho vazio!');

    // Montar o payload exatamente como o back-end espera
    // OrderController.js -> createOrder
    const orderData = {
      paymentMethod: paymentMethod,
      status: "PENDING",
      clienteId: user.id,
      createdById: user.id, // Cliente criando o próprio pedido
      items: cartItems.map(item => ({
        listId: item.id,      // O ID do Item
        quantity: item.quantity // A quantidade selecionada
      }))
    };

    try {
      await api.post('/orders', orderData);
      alert('Pedido realizado com sucesso! 🚀');
      clearCart();
      navigate('/'); // Volta pra home
    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar pedido. Veja o console.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Finalizar Pedido</h1>
      
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <div>
                  <strong>{item.quantity}x</strong> {item.description}
                </div>
                <div>
                  R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>X</button>
                </div>
              </li>
            ))}
          </ul>
          
          <div style={{ marginTop: '20px', fontSize: '1.2em', textAlign: 'right' }}>
            Total: <strong>R$ {total.toFixed(2)}</strong>
          </div>

          <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px' }}>
            <h3>Forma de Pagamento</h3>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ padding: '8px', width: '100%' }}>
              <option value="Pix">Pix</option>
              <option value="CASH">Dinheiro</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
            </select>
          </div>

          <button 
            onClick={handleFinishOrder}
            style={{ width: '100%', marginTop: '20px', padding: '15px', background: 'green', color: 'white', border: 'none', fontSize: '1.1em', cursor: 'pointer' }}
          >
            Finalizar Pedido
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;