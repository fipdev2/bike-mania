import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import FuncionarioDashboard from './components/FuncionarioDashboard';
import UsuarioDashboard from './components/UsuarioDashboard';
import Login from './components/Login';
import './App.css';

function App() {
  // Inicializamos o estado tentando pegar o usuário do localStorage primeiro
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Este efeito roda SÓ UMA VEZ quando o app abre.
  // Ele verifica se já tem um usuário salvo na "memória permanente" do navegador.
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (user) => {
    // Salva o usuário no localStorage pra "lembrar" dele depois do F5
    localStorage.setItem('currentUser', JSON.stringify(user));
    // E também atualiza o estado atual do app
    setCurrentUser(user);
  };

  const handleLogout = () => {
    // Limpa o usuário do localStorage ao sair
    localStorage.removeItem('currentUser');
    // E reseta o estado do app
    setCurrentUser(null);
  };

  const renderDashboard = () => {
    if (!currentUser) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentUser.role) {
      case 'ADMIN':
        return <AdminDashboard currentUser={currentUser} />;
      case 'FUNCIONARIO':
        return <FuncionarioDashboard currentUser={currentUser} />;
      case 'USUARIO':
        return <UsuarioDashboard currentUser={currentUser} />;
      default:
        // Se algo der errado, volta pra tela de login
        handleLogout();
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bike Mania {currentUser && <span className="role-tag">({currentUser.nome})</span>}</h1>
        {currentUser && <button className="logout-btn" onClick={handleLogout}>Sair</button>}
      </header>
      <main>
        {renderDashboard()}
      </main>
    </div>
  );
}

export default App;