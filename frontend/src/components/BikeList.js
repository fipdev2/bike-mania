// src/components/BikeList.js

import React from 'react';

const BikeList = ({ bikes, userRole, onRentBike, onDeleteBike }) => {
  return (
    <table className="bike-table">
      <thead>
        <tr>
          <th>Número</th>
          <th>Tipo</th>
          <th>Status</th>
          {/* Mostra a coluna de ações só se for relevante */}
          {(userRole === 'USUARIO' || userRole === 'ADMIN') && <th>Ação</th>}
        </tr>
      </thead>
      <tbody>
        {bikes.map(bike => (
          <tr key={bike.id}>
            <td>{bike.numero}</td>
            <td>{bike.tipo}</td>
            <td>
              <span className={`status status-${bike.status.toLowerCase()}`}>
                {bike.status}
              </span>
            </td>
            {(userRole === 'USUARIO' || userRole === 'ADMIN') && (
              <td>
                {userRole === 'USUARIO' && bike.status === 'Disponivel' && (
                  <button onClick={() => onRentBike(bike.id)}>Alugar</button>
                )}
                {userRole === 'ADMIN' && (
                  <button className="btn-delete" onClick={() => onDeleteBike(bike.id)}>Deletar</button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BikeList;