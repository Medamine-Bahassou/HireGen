import React, { useState, useEffect } from 'react';
import MissionUpdateForm from './MissionUpdateForm';
import { FaTrash, FaEdit } from 'react-icons/fa';

const MissionHistory = () => {
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/GroqApiResponses/DeleteMission/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setMissions(missions.filter((mission) => mission.id !== id));
      console.log('Mission deleted successfully:', id);
    } catch (err) {
      setError('Échec de la suppression de la mission : ' + err.message);
      console.error('Error deleting mission:', err);
    }
  };

  const handleUpdate = (id) => {
    const missionToEdit = missions.find((mission) => mission.id === id);
    if (missionToEdit) {
      setCurrentMission(missionToEdit);
      setShowUpdateForm(true);
    }
  };

  const handleSaveUpdate = async (updatedMission) => {
    try {
      const response = await fetch(`/GroqApiResponses/${updatedMission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMission),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMissions(
        missions.map((mission) =>
          mission.id === updatedMission.id ? updatedMission : mission
        )
      );
      setShowUpdateForm(false);
      setCurrentMission(null);
      console.log('Mission updated successfully:', updatedMission);
    } catch (err) {
      setError('Échec de la mise à jour de la mission : ' + err.message);
      console.error('Error updating mission:', err);
    }
  };

  const handleCancelUpdate = () => {
    setShowUpdateForm(false);
    setCurrentMission(null);
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/GroqApiResponses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMissions(data);
      } catch (err) {
        setError('Échec du chargement de l\'historique des missions : ' + err.message);
        console.error('Error fetching mission history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  if (isLoading) {
    return <div>Chargement de l'historique des missions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="mission-history-container">
      <h2>Historique des Missions</h2>
      {missions.length === 0 ? (
        <p>Aucune mission trouvée dans l'historique.</p>
      ) : (
        <table className="mission-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Pays</th>
              <th>Ville</th>
              <th>Mode de Travail</th>
              <th>Durée</th>
              <th>Type de Contrat</th>
              <th>Taux Journalier</th>
              <th>Poste</th>
              <th>Expertises</th>
              <th>Horodatage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {missions.map((mission) => (
              <tr key={mission.id}>
                <td>{mission.id}</td>
                <td>{mission.title}</td>
                <td>{mission.country}</td>
                <td>{mission.city}</td>
                <td>{mission.workMode}</td>
                <td>{mission.duration} {mission.durationType}</td>
                <td>{mission.contractType}</td>
                <td>{mission.estimatedDailyRate}€</td>
                <td>{mission.position}</td>
                <td>{mission.requiredExpertises}</td>
                <td>{new Date(mission.timestamp).toLocaleString()}</td>
                <td>
                  <div className="action-buttons-cell">
                    <button className="delete-button" onClick={() => handleDelete(mission.id)}><FaTrash /></button>
                    <button onClick={() => handleUpdate(mission.id)}><FaEdit /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showUpdateForm && currentMission && (
        <MissionUpdateForm
          mission={currentMission}
          onSave={handleSaveUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
    </div>
  );
};

export default MissionHistory;
