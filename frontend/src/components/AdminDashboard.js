import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BikeList from './BikeList'; // Reutilizando o componente

const AdminDashboard = ({ currentUser }) => {
    const [bikes, setBikes] = useState([]);
    
    // Função para buscar as bikes da API
    const fetchBikes = async () => {
        const response = await axios.get('/api/bikes');
        setBikes(response.data);
    };

    // O useEffect vai rodar uma vez quando o componente montar
    useEffect(() => {
        fetchBikes();
    }, []);

    const handleAddBike = async (newBikeData) => {
        await axios.post('/api/bikes', newBikeData);
        fetchBikes(); // Re-busca as bikes para atualizar a lista
    };

    const handleDeleteBike = async (bikeId) => {
        await axios.delete(`/api/bikes/${bikeId}`);
        fetchBikes(); // Re-busca as bikes
    };
    
    // ... (Lógica para gerenciar usuários e funcionários também viria aqui)

    return (
        <div className="dashboard">
            <h2>Painel do Administrador</h2>
            {/* Formulário para adicionar bikes (pode ser um componente separado) */}
            <div className="card">
              <h3>Cadastrar Nova Bike</h3>
              {/* Simplificando o form aqui, mas a lógica está em handleAddBike */}
            </div>
            
            <div className="card">
                <h3>Todas as Bikes</h3>
                <BikeList bikes={bikes} userRole="ADMIN" onDeleteBike={handleDeleteBike} />
            </div>
        </div>
    );
};

export default AdminDashboard;