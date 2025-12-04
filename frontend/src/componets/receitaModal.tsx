import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './receitaModal.css';

interface ReceitaDetalhes {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

interface ReceitaModalProps {
  receitaId: string;
  onClose: () => void;
}

const ReceitaModal: React.FC<ReceitaModalProps> = ({ receitaId, onClose }) => {
  const [receita, setReceita] = useState<ReceitaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceitaDetalhes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/recipes/${receitaId}`
        );
        setReceita(response.data.meals[0]);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceitaDetalhes();
  }, [receitaId]);

  const getIngredientes = () => {
    if (!receita) return [];
    
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = receita[`strIngredient${i}`];
      const measure = receita[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredientes.push(`${measure} ${ingredient}`);
      }
    }
    return ingredientes;
  };

  if (loading) {
    return (
      <div className="modal-loading">
        <div className="modal-loading-spinner"></div>
        <div className="modal-loading-text">Carregando receita...</div>
      </div>
    );
  }

  if (!receita) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <img
          src={receita.strMealThumb}
          alt={receita.strMeal}
          className="modal-image"
        />

        <div className="modal-content">
          <h2 className="modal-title">{receita.strMeal}</h2>
          
          <div className="modal-meta">
            <span className="modal-badge area">
              📍 {receita.strArea}
            </span>
            <span className="modal-badge category">
              🍽️ {receita.strCategory}
            </span>
          </div>

          {/* Botão YouTube (só aparece se tiver vídeo) */}
          {receita.strYoutube && (
            <a
              href={receita.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-btn"
            >
              🎥 Assistir no YouTube
            </a>
          )}

          <div className="modal-section">
            <h3 className="modal-section-title">
              📝 Ingredientes
            </h3>
            <ul className="modal-ingredients-list">
              {getIngredientes().map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">
              👨‍🍳 Modo de Preparo
            </h3>
            <p className="modal-instructions">
              {receita.strInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceitaModal;
