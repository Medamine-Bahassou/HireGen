import React, { useState } from 'react';
import Groq from 'groq-sdk';

const GroqChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [parsedResponse, setParsedResponse] = useState(null); // New state for parsed JSON
  const [editableMissionData, setEditableMissionData] = useState(null); // State for editable data
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for saving status
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [error, setError] = useState(null);

  const translationMap = {
    title: 'Titre',
    description: 'Description',
    country: 'Pays',
    city: 'Ville',
    workMode: 'Mode de Travail',
    duration: 'Durée',
    durationType: 'Type de Durée',
    startImmediately: 'Démarrer Immédiatement',
    startDate: 'Date de Début',
    experienceYear: 'Années d\'Expérience',
    contractType: 'Type de Contrat',
    estimatedDailyRate: 'Taux Journalier Estimé',
    domain: 'Domaine',
    position: 'Poste',
    requiredExpertises: 'Expertises Requises',
    timestamp: 'Horodatage',
    id: 'ID',
  };

  const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY, // Use Vite's way to access environment variables
    dangerouslyAllowBrowser: true, // Required for client-side usage
  });

  const systemPrompt = `Tu es un assistant spécialisé dans la création de fiches de mission.
À partir d'une brève description, tu dois générer une fiche de mission complète.
Réponds UNIQUEMENT au format JSON suivant (sans commentaires ni texte additionnel) :
{
"title": "Titre concis et accrocheur de la mission",
"description": "Description détaillée incluant contexte et objectifs",
"country": "Nom du pays en anglais",
"city": "Nom de la ville en anglais",
"workMode": "Un parmi: REMOTE, ONSITE, HYBRID",
"duration": "Durée (nombre)",
"durationType": "Unité de durée (MONTH, YEAR)",
"startImmediately": true/false,
"startDate": "Date de début au format yyyy-MM-dd (si startImmediately est false)",
"experienceYear": "Un parmi: 0-3, 3-7, 7-12, 12+",
"contractType": "Un parmi: FORFAIT, REGIE",
"estimatedDailyRate": "Taux journalier moyen en euros (nombre)",
"domain": "Domaine d'activité principal",
"position": "Intitulé du poste/fonction",
"requiredExpertises": ["expertise1", "expertise2", ...]
}`;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile', // Changed to llama-3.1 as per common practice for latest models
      });

      const rawResponse = completion.choices[0]?.message?.content || '';
      setResponse(rawResponse); // Keep raw response for debugging if needed

      try {
        const jsonResponse = JSON.parse(rawResponse);
        setParsedResponse(jsonResponse); // Set parsed JSON
        setError(null); // Clear any previous errors

        // Automatically save the generated data to the backend
        const missionDataToSend = {
          id: 0, // Always 0 for a new generation, backend will assign ID
          title: jsonResponse.title,
          description: jsonResponse.description,
          country: jsonResponse.country,
          city: jsonResponse.city,
          workMode: jsonResponse.workMode,
          duration: jsonResponse.duration,
          durationType: jsonResponse.durationType,
          startImmediately: jsonResponse.startImmediately,
          startDate: jsonResponse.startDate || null, // Send null if not provided
          experienceYear: jsonResponse.experienceYear,
          contractType: jsonResponse.contractType,
          estimatedDailyRate: jsonResponse.estimatedDailyRate,
          domain: jsonResponse.domain,
          position: jsonResponse.position,
          requiredExpertises: Array.isArray(jsonResponse.requiredExpertises) ? jsonResponse.requiredExpertises.join(', ') : jsonResponse.requiredExpertises, // Convert array to comma-separated string
          timestamp: new Date().toISOString(), // Current timestamp
        };

        const saveResponse = await fetch('/GroqApiResponses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(missionDataToSend),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.Message || 'Failed to save mission details automatically.');
        }

        const saveResult = await saveResponse.json();
        console.log('Mission data saved successfully automatically:', saveResult);
        // Update parsedResponse and editableMissionData with the ID from the backend
        setParsedResponse(prev => ({ ...prev, id: saveResult.id })); // Assuming backend returns 'id' camelCase
        setEditableMissionData({ ...jsonResponse, id: saveResult.id }); // Initialize editable data with ID from backend

      } catch (jsonError) {
        console.error('Failed to parse JSON response or save:', jsonError);
      setError('Échec de l\'analyse de la réponse de l\'IA en JSON ou de la sauvegarde. Veuillez réessayer.');
        setParsedResponse(null); // Clear parsed response on error
        setEditableMissionData(null);
      }

    } catch (err) {
      console.error('Error calling Groq API:', err);
      setError(`Error: ${err.message}`);
      setParsedResponse(null); // Clear parsed response on error
      setEditableMissionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (key, value) => {
    const commonProps = {
      id: key,
      name: key,
      className: 'mission-detail-input',
      value: editableMissionData?.[key] ?? '',
      readOnly: !isEditing, // Make fields editable when in edit mode
      disabled: isLoading || isSaving,
      onChange: handleInputChange, // Add a generic change handler
    };

    // Specific handling for checkbox and textarea for requiredExpertises
    if (key === 'startImmediately') {
      return (
        <input
          type="checkbox"
          {...commonProps}
          checked={editableMissionData?.[key] ?? false}
          onChange={(e) => handleInputChange(e, key, 'checkbox')}
        />
      );
    } else if (key === 'requiredExpertises') {
      return (
        <textarea
          {...commonProps}
          rows="3"
          value={Array.isArray(editableMissionData?.[key]) ? editableMissionData[key].join(', ') : (editableMissionData?.[key] ?? '')}
          onChange={(e) => handleInputChange(e, key, 'array-text')}
        ></textarea>
      );
    } else if (key === 'description') {
      return (
        <textarea
          {...commonProps}
          rows="5"
          value={editableMissionData?.[key] ?? ''}
        ></textarea>
      );
    } else if (key === 'duration' || key === 'estimatedDailyRate') {
      return <input type="number" {...commonProps} />;
    } else if (key === 'startDate') {
      return <input type="date" {...commonProps} />;
    } else if (key === 'workMode') {
      return (
        <select {...commonProps}>
          <option value="REMOTE">REMOTE</option>
          <option value="ONSITE">ONSITE</option>
          <option value="HYBRID">HYBRID</option>
        </select>
      );
    } else if (key === 'durationType') {
      return (
        <select {...commonProps}>
          <option value="MONTH">MONTH</option>
          <option value="YEAR">YEAR</option>
        </select>
      );
    } else if (key === 'experienceYear') {
      return (
        <select {...commonProps}>
          <option value="0-3">0-3</option>
          <option value="3-7">3-7</option>
          <option value="7-12">7-12</option>
          <option value="12+">12+</option>
        </select>
      );
    } else if (key === 'contractType') {
      return (
        <select {...commonProps}>
          <option value="FORFAIT">FORFAIT</option>
          <option value="REGIE">REGIE</option>
        </select>
      );
    } else {
      return <input type="text" {...commonProps} />;
    }
  };

  const handleInputChange = (e, key, type) => {
    let value = e.target.value;
    if (type === 'checkbox') {
      value = e.target.checked;
    } else if (type === 'array-text') {
      value = value.split(',').map(item => item.trim());
    }
    setEditableMissionData(prevData => ({
      ...prevData,
      [key || e.target.name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Ensure requiredExpertises is a comma-separated string before sending
      const missionDataToSave = {
        ...editableMissionData,
        requiredExpertises: Array.isArray(editableMissionData.requiredExpertises) 
          ? editableMissionData.requiredExpertises.join(', ') 
          : editableMissionData.requiredExpertises
      };

      const saveResponse = await fetch(`/GroqApiResponses/${missionDataToSave.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionDataToSave),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.Message || 'Failed to save updated mission details.');
      }

      console.log('Mission data updated successfully:', editableMissionData);
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error('Error saving mission data:', err);
      setError(`Erreur lors de la sauvegarde : ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="chat-title">Générateur de Fiche Mission</h2>
      <div className="input-section">
        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Décrivez la mission ici..."
          rows="10"
          disabled={isLoading || isSaving}
        ></textarea>
        <button className="generate-button" onClick={handleSubmit} disabled={isLoading || isSaving}>
          {isLoading ? 'Génération en cours...' : 'Générer la Fiche Mission'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {parsedResponse && (
        <div className="response-section">
          <h3 className="response-title">Fiche Mission Générée :</h3>
          <div className="mission-details-grid">
            {Object.entries(parsedResponse).map(([key, value]) => (
              <div className="mission-detail-item" key={key}>
                <label htmlFor={key}>{translationMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                {renderInputField(key, value)}
              </div>
            ))}
          </div>
          <div className="action-buttons">
            {!isEditing ? (
              <button onClick={handleEdit} disabled={isLoading || isSaving}>Modifier</button>
            ) : (
              <button onClick={handleSave} disabled={isLoading || isSaving}>
                {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroqChat;
