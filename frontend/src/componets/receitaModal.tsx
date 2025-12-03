import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ReceitaDetalhes {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string; 
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ color: 'white', fontSize: '24px' }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (!receita) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ✕
        </button>

        
        <img
          src={receita.strMealThumb}
          alt={receita.strMeal}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '15px 15px 0 0'
          }}
        />

        
        <div style={{ padding: '30px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
            {receita.strMeal}
          </h2>
          
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            📍 {receita.strArea} | 🍽️ {receita.strCategory}
          </p>

          
          <h3 style={{ fontSize: '22px', marginTop: '20px' }}>
            📝 Ingredientes:
          </h3>
          <ul style={{ lineHeight: '1.8', fontSize: '16px' }}>
            {getIngredientes().map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          
          <h3 style={{ fontSize: '22px', marginTop: '30px' }}>
            👨‍🍳 Modo de Preparo:
          </h3>
          <p style={{ 
            lineHeight: '1.8', 
            fontSize: '16px',
            whiteSpace: 'pre-line',
            textAlign: 'justify'
          }}>
            {receita.strInstructions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceitaModal;