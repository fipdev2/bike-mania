// frontend/src/components/FuncionarioDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BikeList from './BikeList';

const FuncionarioDashboard = ({ currentUser }) => {
    const [bikes, setBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

    const fetchBikes = async () => {
        try {
            const response = await axios.get('/api/bikes');
            setBikes(response.data);
        } catch (error) {
            console.error("Erro ao buscar bikes:", error);
        } finally {
            setIsLoading(false); // Termina o carregamento, mesmo se der erro
        }
    };

    useEffect(() => {
        fetchBikes();
    }, []); // O array vazio garante que isso rode só uma vez

    // Lógica para adicionar uma nova bike (pode ser expandida)
    const handleAddBike = async (newBikeData) => {
        // Exemplo: await axios.post('/api/bikes', newBikeData);
        fetchBikes(); // Re-busca as bikes para atualizar a lista
    };

    if (isLoading) {
        return <div className="dashboard"><p>Carregando bikes...</p></div>;
    }

    return (
        <div className="dashboard">
            <h2>Painel do Funcionário: {currentUser.nome}</h2>
            
            {/* Aqui entraria um formulário para o funcionário cadastrar novas bikes */}
            {/* <AddBikeForm onAddBike={handleAddBike} /> */}
            
            <div className="card">
                <h3>Status de Todas as Bikes</h3>
                <BikeList bikes={bikes} userRole="FUNCIONARIO" />
            </div>
        </div>
    );
};

export default FuncionarioDashboard;