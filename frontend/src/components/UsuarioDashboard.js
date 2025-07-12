// frontend/src/components/UsuarioDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BikeList from './BikeList';

const UsuarioDashboard = ({ currentUser }) => {
    const [myRentals, setMyRentals] = useState([]);
    const [availableBikes, setAvailableBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Busca os aluguéis do usuário
            const rentalsResponse = await axios.get(`/api/users/${currentUser.id}/rentals`);
            setMyRentals(rentalsResponse.data);

            // Busca todas as bikes e filtra as disponíveis
            const bikesResponse = await axios.get('/api/bikes');
            setAvailableBikes(bikesResponse.data.filter(b => b.status === 'Disponivel'));

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentUser.id]);

    // A FUNÇÃO QUE FALTAVA!
    const handleRentBike = async (bikeId) => {
        try {
            // O funcionário 'carlos' tem id 1 no nosso seed, mas como o usuário que aluga é o João,
            // vamos assumir que o funcionário Carlos (id 1) fez o registro.
            // No mundo real, o funcionário logado seria pego de algum lugar.
            const rentalData = {
                bike_id: bikeId,
                usuario_id: currentUser.id,
                funcionario_id: 1 // ID do 'carlos' do nosso seed
            };
            await axios.post('/api/rentals', rentalData);
            alert('Bike alugada com sucesso!');
            // Depois de alugar, busca os dados de novo pra atualizar a tela
            fetchData();
        } catch (error) {
            console.error("Erro ao alugar a bike:", error);
            alert('Ops, não foi possível alugar a bike.');
        }
    };
    
    if (isLoading) {
        return <div className="dashboard"><p>Carregando...</p></div>;
    }

    return (
        <div className="dashboard">
            <h2>Sua Área, {currentUser.nome}!</h2>

            {myRentals.length > 0 ? (
                <div className="card rented-info">
                    <h3>Sua Bike no Rolê!</h3>
                    {myRentals.map((rental, index) => (
                        <div key={index}>
                            <p><strong>Bike:</strong> {rental.bike_tipo} (Nº {rental.bike_numero})</p>
                            <p><strong>Alugada por:</strong> {rental.funcionario_nome}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <h3>Bikes Disponíveis pra Alugar</h3>
                    <p>Escolha sua próxima aventura!</p>
                    {/* Agora a gente passa a função handleRentBike para o componente */}
                    <BikeList 
                        bikes={availableBikes} 
                        userRole="USUARIO" 
                        onRentBike={handleRentBike} 
                    />
                </div>
            )}
        </div>
    );
};

export default UsuarioDashboard;