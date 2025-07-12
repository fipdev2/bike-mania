import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Usando nosso modal caseiro
import BikeList from './BikeList'; // Reutilizando nossa lista de bikes

const AdminDashboard = ({ currentUser }) => {
    // Listas de dados
    const [users, setUsers] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [bikes, setBikes] = useState([]);

    // Estados para controlar os modais
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isFuncModalOpen, setIsFuncModalOpen] = useState(false);
    const [isBikeModalOpen, setIsBikeModalOpen] = useState(false); // <-- Novo estado para o modal de bike

    // Estados para os formulários de novos itens
    const [newUserData, setNewUserData] = useState({ nome: '', username: '', password: '', telefone: '' });
    const [newFuncData, setNewFuncData] = useState({ nome: '', username: '', password: '' });
    const [newBikeData, setNewBikeData] = useState({ cor: '', tipo: '', numero: '' }); // <-- Novo estado para o form de bike

    // Função para buscar todos os dados necessários para o painel
    const fetchData = async () => {
        try {
            const [usersRes, funcsRes, bikesRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/funcionarios'),
                axios.get('/api/bikes') // <-- Busca as bikes também
            ]);
            setUsers(usersRes.data);
            setFuncionarios(funcsRes.data);
            setBikes(bikesRes.data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFormChange = (e, setData) => {
        setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
    };

    // --- Lógica de Criação ---
    const handleCreateUser = async (e) => { e.preventDefault(); try { await axios.post('/api/users', newUserData); alert('Usuário criado!'); setIsUserModalOpen(false); setNewUserData({ nome: '', username: '', password: '', telefone: '' }); fetchData(); } catch (error) { alert('Erro ao criar usuário.'); }};
    const handleCreateFuncionario = async (e) => { e.preventDefault(); try { await axios.post('/api/funcionarios', newFuncData); alert('Funcionário criado!'); setIsFuncModalOpen(false); setNewFuncData({ nome: '', username: '', password: '' }); fetchData(); } catch (error) { alert('Erro ao criar funcionário.'); }};
    
    // <-- Nova função para criar bikes -->
    const handleCreateBike = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/bikes', newBikeData);
            alert('Bike criada com sucesso!');
            setIsBikeModalOpen(false); // Fecha o modal
            setNewBikeData({ cor: '', tipo: '', numero: '' }); // Limpa o formulário
            fetchData(); // Atualiza a lista de bikes
        } catch (error) {
            alert(`Erro ao criar bike: ${error.response?.data?.error || 'Erro desconhecido'}`);
            console.error(error);
        }
    };

    return (
        <div className="dashboard">
            <h2>Painel do Administrador: {currentUser.nome}</h2>

            <div className="card-container" style={{ justifyContent: 'flex-start', marginBottom: '20px', gap: '10px' }}>
                <button onClick={() => setIsUserModalOpen(true)}>+ Criar Usuário</button>
                <button onClick={() => setIsFuncModalOpen(true)}>+ Criar Funcionário</button>
                <button onClick={() => setIsBikeModalOpen(true)}>+ Criar Bike</button> {/* <-- Novo Botão --> */}
            </div>

            <div className="card">
                <h3><span role="img" aria-label="bike">🚲</span> Status de Todas as Bikes</h3>
                <BikeList bikes={bikes} userRole="ADMIN" />
            </div>

            <div className="card-container">
                <div className="card">
                    <h4><span role="img" aria-label="user">👤</span> Usuários Existentes</h4>
                    <ul>{users.map(u => <li key={u.id}>{u.nome} ({u.username})</li>)}</ul>
                </div>
                <div className="card">
                    <h4><span role="img" aria-label="employee">👷</span> Funcionários Existentes</h4>
                    <ul>{funcionarios.map(f => <li key={f.id}>{f.nome} ({f.username})</li>)}</ul>
                </div>
            </div>

            {/* --- Modais --- */}
            <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)}>
                <h3>Criar Novo Usuário</h3>
                <form onSubmit={handleCreateUser} className="form-inline" style={{ flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="nome" value={newUserData.nome} onChange={(e) => handleFormChange(e, setNewUserData)} placeholder="Nome completo" required />
                    <input type="text" name="username" value={newUserData.username} onChange={(e) => handleFormChange(e, setNewUserData)} placeholder="Username (login)" required />
                    <input type="password" name="password" value={newUserData.password} onChange={(e) => handleFormChange(e, setNewUserData)} placeholder="Senha" required />
                    <input type="text" name="telefone" value={newUserData.telefone} onChange={(e) => handleFormChange(e, setNewUserData)} placeholder="Telefone" required />
                    <div style={{ marginTop: '15px' }}><button type="submit">Criar</button><button type="button" onClick={() => setIsUserModalOpen(false)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancelar</button></div>
                </form>
            </Modal>

            <Modal isOpen={isFuncModalOpen} onClose={() => setIsFuncModalOpen(false)}>
                <h3>Criar Novo Funcionário</h3>
                <form onSubmit={handleCreateFuncionario} className="form-inline" style={{ flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="nome" value={newFuncData.nome} onChange={(e) => handleFormChange(e, setNewFuncData)} placeholder="Nome completo" required />
                    <input type="text" name="username" value={newFuncData.username} onChange={(e) => handleFormChange(e, setNewFuncData)} placeholder="Username (login)" required />
                    <input type="password" name="password" value={newFuncData.password} onChange={(e) => handleFormChange(e, setNewFuncData)} placeholder="Senha" required />
                    <div style={{ marginTop: '15px' }}><button type="submit">Criar</button><button type="button" onClick={() => setIsFuncModalOpen(false)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancelar</button></div>
                </form>
            </Modal>
            
            {/* <-- Novo Modal para Bikes --> */}
            <Modal isOpen={isBikeModalOpen} onClose={() => setIsBikeModalOpen(false)}>
                <h3>Criar Nova Bike</h3>
                <form onSubmit={handleCreateBike} className="form-inline" style={{ flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="numero" value={newBikeData.numero} onChange={(e) => handleFormChange(e, setNewBikeData)} placeholder="Número da Bike (ex: 004)" required />
                    <input type="text" name="tipo" value={newBikeData.tipo} onChange={(e) => handleFormChange(e, setNewBikeData)} placeholder="Tipo (ex: Urbana)" required />
                    <input type="text" name="cor" value={newBikeData.cor} onChange={(e) => handleFormChange(e, setNewBikeData)} placeholder="Cor (ex: Verde)" required />
                    <div style={{ marginTop: '15px' }}><button type="submit">Criar</button><button type="button" onClick={() => setIsBikeModalOpen(false)} style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancelar</button></div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;