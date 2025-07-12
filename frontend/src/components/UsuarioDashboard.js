import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BikeList from './BikeList';

const UsuarioDashboard = ({ currentUser }) => {
    const [myRentals, setMyRentals] = useState([]);
    const [availableBikes, setAvailableBikes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const rentalsResponse = await axios.get(`/api/users/${currentUser.id}/rentals`);
            setMyRentals(rentalsResponse.data);
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

    const handleReturnBike = async (bikeId) => {
        try {
            await axios.post(`/api/bikes/${bikeId}/return`);
            alert('Tempo esgotado! Sua bike foi devolvida e está disponível novamente.');
            fetchData();
        } catch (error) {
            console.error("Erro ao devolver a bike:", error.response?.data);
        }
    };

    useEffect(() => {
        if (myRentals.length === 0) return;
        const rental = myRentals[0];
        const endTime = new Date(rental.data_inicio).getTime() + rental.duracao_segundos * 1000;
        const timer = setInterval(() => {
            const remaining = Math.max(0, Math.floor((endTime - new Date().getTime()) / 1000));
            setTimeLeft(remaining);
            if (remaining === 0) {
                clearInterval(timer);
                handleReturnBike(rental.bike_id);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [myRentals]);

    const handleRentBike = async (bikeId) => {
        try {
            const rentalData = { bike_id: bikeId, usuario_id: currentUser.id, funcionario_id: 1, duracao_segundos: 60 }; // 60 segundos para teste
            await axios.post('/api/rentals', rentalData);
            alert('Bike alugada com sucesso!');
            fetchData();
        } catch (error) {
            console.error("Erro ao alugar a bike:", error.response?.data);
            alert(`Ops, não foi possível alugar a bike: ${error.response?.data?.message || 'Erro desconhecido'}`);
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
                    <h3>Sua Bike no Rolê! 🚲</h3>
                    {myRentals.map((rental) => (
                        <div key={rental.bike_id}>
                            <p><strong>Bike:</strong> {rental.bike_tipo} (Nº {rental.bike_numero})</p>
                            <div className="timer">
                                Tempo restante: <strong>{formatTime(timeLeft)}</strong> ⏰
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <h3>Bikes Disponíveis pra Alugar</h3>
                    <BikeList bikes={availableBikes} userRole="USUARIO" onRentBike={handleRentBike} />
                </div>
            )}
        </div>
    );
};

export default UsuarioDashboard;