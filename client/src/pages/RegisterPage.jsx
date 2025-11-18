import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    Usertype: 'CLIENT', // Padrão
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Montar o objeto final como o Back-end espera (com adress aninhado)
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
      // Tenta pegar a mensagem de erro do Zod ou do servidor
      const msg = err.response?.data?.message || JSON.stringify(err.response?.data?.errors) || 'Erro ao cadastrar';
      setError(msg);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Criar Nova Conta</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3>Dados Pessoais</h3>
        <input name="name" placeholder="Nome" onChange={handleChange} required style={{padding: '8px'}} />
        <input name="phone" placeholder="Telefone (apenas números)" onChange={handleChange} required style={{padding: '8px'}} />
        <input type="password" name="password" placeholder="Senha (min 6 chars)" onChange={handleChange} required style={{padding: '8px'}} />
        
        <select name="Usertype" onChange={handleChange} value={formData.Usertype} style={{padding: '8px'}}>
          <option value="CLIENT">Cliente</option>
          <option value="ADMIN">Administrador (Teste)</option>
        </select>

        <h3>Endereço</h3>
        <input name="street" placeholder="Rua" onChange={handleChange} required style={{padding: '8px'}} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="number" placeholder="Número" onChange={handleChange} required style={{padding: '8px', flex: 1}} />
          <input name="zipCode" placeholder="CEP (8 dígitos)" onChange={handleChange} required style={{padding: '8px', flex: 1}} />
        </div>
        <input name="district" placeholder="Bairro" onChange={handleChange} required style={{padding: '8px'}} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="city" placeholder="Cidade" onChange={handleChange} required style={{padding: '8px', flex: 2}} />
          <input name="state" placeholder="UF (ex: MG)" maxLength="2" onChange={handleChange} required style={{padding: '8px', flex: 1}} />
        </div>

        <button type="submit" style={{ marginTop: '20px', padding: '10px', background: 'orange', border: 'none', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;