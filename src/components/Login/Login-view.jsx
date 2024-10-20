import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './Login.scss';

const MyLoginComponent = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleChange = (e) => {
    // Destructuracion del target
    const { name, value } = e.target;
    //spred operator
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar si el usuario y contraseña son correctos
    

    
      // Llamar a la función onLogin que se pasa desde App.js
      onLogin(formData);
      navigate('/users'); // Redirigir a la lista de usuarios
    
      // Manejar error de autenticación
      
    
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="user"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>
        <button type="submit" className="btn-submit">Login</button>
      </form>
    </div>
  );
};

export default MyLoginComponent;
