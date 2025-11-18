import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', Usertype: 'CLIENT',
    street: '', number: '', district: '', city: '', state: '', zipCode: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      Usertype: formData.Usertype,
      adress: {
        street: formData.street,
        number: formData.number,
        district: formData.district,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      }
    };

    try {
      await api.post('/users', payload);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao cadastrar';
      setError(msg);
    }
  };

  return (
    <div className="auth-container" style={{maxWidth: '600px'}}>
      <h2 className="auth-title">Criar Nova Conta</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <h4 style={{marginBottom: '10px', color: '#666'}}>Dados Pessoais</h4>
        <div className="form-group">
          <input name="name" className="form-control" placeholder="Nome Completo" onChange={handleChange} required />
        </div>
        <div className="form-row">
            <div className="form-group" style={{flex: 1}}>
                <input name="phone" className="form-control" placeholder="Telefone" onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
                <select name="Usertype" className="form-control" onChange={handleChange} value={formData.Usertype}>
                    <option value="CLIENT">Cliente</option>
                    <option value="ADMIN">Administrador</option>
                </select>
            </div>
        </div>
        <div className="form-group">
             <input type="password" name="password" className="form-control" placeholder="Senha (min 6 caracteres)" onChange={handleChange} required />
        </div>

        <h4 style={{marginBottom: '10px', marginTop: '20px', color: '#666'}}>Endereço</h4>
        <div className="form-row">
            <div className="form-group" style={{flex: 2}}>
                <input name="street" className="form-control" placeholder="Rua" onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
                <input name="number" className="form-control" placeholder="Nº" onChange={handleChange} required />
            </div>
        </div>
        <div className="form-row">
             <div className="form-group" style={{flex: 1}}>
                <input name="district" className="form-control" placeholder="Bairro" onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
                <input name="zipCode" className="form-control" placeholder="CEP (8 dígitos)" onChange={handleChange} required />
            </div>
        </div>
        <div className="form-row">
            <div className="form-group" style={{flex: 2}}>
                <input name="city" className="form-control" placeholder="Cidade" onChange={handleChange} required />
            </div>
            <div className="form-group" style={{flex: 1}}>
                <input name="state" className="form-control" placeholder="UF" maxLength="2" onChange={handleChange} required />
            </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" style={{marginTop: '20px'}}>Cadastrar</button>
      </form>
      <p style={{marginTop: '15px', textAlign: 'center'}}>
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;