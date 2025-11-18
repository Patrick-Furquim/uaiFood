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

    const orderData = {
      paymentMethod: paymentMethod,
      status: "PENDING",
      clienteId: user.id,
      createdById: user.id,
      items: cartItems.map(item => ({
        listId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      await api.post('/orders', orderData);
      alert('Pedido realizado com sucesso! 🚀');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Erro ao finalizar pedido.');
    }
  };

  return (
    <div className="checkout-container container" style={{marginTop: '40px'}}>
      <h1 style={{marginBottom: '20px', textAlign: 'center'}}>Finalizar Pedido</h1>
      
      {cartItems.length === 0 ? (
        <div className="card" style={{textAlign: 'center'}}>
            <p>Seu carrinho está vazio.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{marginTop: '10px'}}>Voltar ao Menu</button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div>
                  <strong>{item.quantity}x</strong> {item.description}
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: '15px'}}>R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="btn btn-outline btn-sm" style={{color: 'red', borderColor: 'red'}}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-total">
            Total: R$ {total.toFixed(2)}
          </div>

          <div className="payment-section">
            <h3 style={{marginBottom: '10px'}}>Forma de Pagamento</h3>
            <select 
                className="form-control"
                value={paymentMethod} 
                onChange={e => setPaymentMethod(e.target.value)}
            >
              <option value="Pix">Pix</option>
              <option value="CASH">Dinheiro</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
            </select>
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{flex: 1}}>Continuar Comprando</button>
            <button onClick={handleFinishOrder} className="btn btn-success" style={{flex: 1}}>Confirmar Pedido</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;