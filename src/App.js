import React, { useState } from 'react';
import MyLoginComponent from './components/Login/Login-view'; // Tu componente de login
import MyUserList from './components/users/User-list'; // Tu componente de lista de usuarios

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (formData) => {
    if (formData.userName && formData.password) {
      setIsAuthenticated(true);
    } else {
      alert("Por favor, ingresa credenciales válidas.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);  // Volver a mostrar el login
  };

  return (
    <div>
      {!isAuthenticated ? (
        // Si no está autenticado, muestra el componente de login
        <MyLoginComponent onLogin={handleLogin} />
      ) : (
        // Si está autenticado, muestra la lista de usuarios con la opción de logout
        <MyUserList onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;