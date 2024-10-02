import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyLoginComponent from './components/Login/Login-view'; // Tu componente de login
import MyUserList from './components/users/User-list'; // Tu componente de lista de usuarios
import UserDetail from './components/Details/UserDetails'; // Tu componente de detalles de usuario

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Ruta para el login */}
          <Route 
            path="/" 
            element={!isAuthenticated ? <MyLoginComponent onLogin={handleLogin} /> : <MyUserList onLogout={handleLogout} />} 
          />
          
          {/* Ruta para la lista de usuarios */}
          <Route 
            path="/users" 
            element={isAuthenticated ? <MyUserList onLogout={handleLogout} /> : <MyLoginComponent onLogin={handleLogin} />} 
          />
          
          {/* Ruta para los detalles de usuario */}
          <Route 
            path="/users/:id" 
            element={isAuthenticated ? <UserDetail /> : <MyLoginComponent onLogin={handleLogin} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
