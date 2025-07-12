import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/login', { username, password });
            onLoginSuccess(response.data.user);
        } catch (err) {
            setError('Usuário ou senha inválidos. Tenta de novo!');
        }
    };

    return (
        <div className="login-container">
            <h2>Login no Bike Mania</h2>
            <form onSubmit={handleSubmit} className="form-inline" style={{ flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Usuário (admin, carlos, ou joao)" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Senha (senha123)" 
                    required 
                />
                <button type="submit">Entrar</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;