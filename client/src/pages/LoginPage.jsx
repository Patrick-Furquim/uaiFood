import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const sucesso = await login(phone, password);
    if (sucesso) navigate('/');
    else setError('Telefone ou senha incorretos!');
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Acessar Conta</h2>
      
      {error && <div className="alert" style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Telefone</label>
          <input
            className="form-control"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Ex: 34999998888"
          />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">Entrar</button>
      </form>

      <p style={{marginTop: '20px', textAlign: 'center'}}>
        Não tem conta? <Link to="/register">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default LoginPage;