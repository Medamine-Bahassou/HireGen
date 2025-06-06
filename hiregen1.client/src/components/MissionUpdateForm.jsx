import React, { useState, useEffect } from 'react';

const MissionUpdateForm = ({ mission, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: mission.id,
    title: mission.title || '',
    description: mission.description || '',
    country: mission.country || '',
    city: mission.city || '',
    workMode: mission.workMode || '',
    duration: mission.duration || 0,
    durationType: mission.durationType || '',
    startImmediately: mission.startImmediately || false,
    startDate: mission.startDate ? new Date(mission.startDate).toISOString().split('T')[0] : '',
    experienceYear: mission.experienceYear || '',
    contractType: mission.contractType || '',
    estimatedDailyRate: mission.estimatedDailyRate || 0,
    domain: mission.domain || '',
    position: mission.position || '',
    requiredExpertises: mission.requiredExpertises || '',
  });

  useEffect(() => {
    setFormData({
      id: mission.id,
      title: mission.title || '',
      description: mission.description || '',
      country: mission.country || '',
      city: mission.city || '',
      workMode: mission.workMode || '',
      duration: mission.duration || 0,
      durationType: mission.durationType || '',
      startImmediately: mission.startImmediately || false,
      startDate: mission.startDate ? new Date(mission.startDate).toISOString().split('T')[0] : '',
      experienceYear: mission.experienceYear || '',
      contractType: mission.contractType || '',
      estimatedDailyRate: mission.estimatedDailyRate || 0,
      domain: mission.domain || '',
      position: mission.position || '',
      requiredExpertises: mission.requiredExpertises || '',
    });
  }, [mission]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure numeric values are parsed correctly
    const dataToSave = {
      ...formData,
      duration: parseInt(formData.duration, 10),
      estimatedDailyRate: parseFloat(formData.estimatedDailyRate),
      // Handle StartDate based on StartImmediately
      startDate: formData.startImmediately ? null : formData.startDate,
    };
    onSave(dataToSave);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Modifier la Mission</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Titre:
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Description:
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
          </label>
          <label>
            Pays:
            <input type="text" name="country" value={formData.country} onChange={handleChange} />
          </label>
          <label>
            Ville:
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </label>
          <label>
            Mode de Travail:
            <input type="text" name="workMode" value={formData.workMode} onChange={handleChange} />
          </label>
          <label>
            Durée:
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
          </label>
          <label>
            Type de Durée:
            <input type="text" name="durationType" value={formData.durationType} onChange={handleChange} />
          </label>
          <label>
            Démarrer Immédiatement:
            <input type="checkbox" name="startImmediately" checked={formData.startImmediately} onChange={handleChange} />
          </label>
          {!formData.startImmediately && (
            <label>
              Date de Début:
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </label>
          )}
          <label>
            Années d'Expérience:
            <input type="text" name="experienceYear" value={formData.experienceYear} onChange={handleChange} />
          </label>
          <label>
            Type de Contrat:
            <input type="text" name="contractType" value={formData.contractType} onChange={handleChange} />
          </label>
          <label>
            Taux Journalier Estimé:
            <input type="number" name="estimatedDailyRate" value={formData.estimatedDailyRate} onChange={handleChange} step="0.01" />
          </label>
          <label>
            Domaine:
            <input type="text" name="domain" value={formData.domain} onChange={handleChange} />
          </label>
          <label>
            Poste:
            <input type="text" name="position" value={formData.position} onChange={handleChange} />
          </label>
          <label>
            Expertises Requises (séparées par des virgules):
            <input type="text" name="requiredExpertises" value={formData.requiredExpertises} onChange={handleChange} />
          </label>
          <div className="form-actions">
            <button type="submit">Sauvegarder</button>
            <button type="button" onClick={onCancel}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissionUpdateForm;
