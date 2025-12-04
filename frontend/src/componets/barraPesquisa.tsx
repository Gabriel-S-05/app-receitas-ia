import React, { useState } from 'react';
import axios from 'axios';
import './barraPesquisa.css';

interface BarraPesquisa {
  onSearch: (results: any) => void;
}

const Barra: React.FC<BarraPesquisa> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const identificPesquisa = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/recipes/search?query=${query}`
      );
      onSearch(response.data.meals || []);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      onSearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && identificPesquisa()}
            placeholder="Pesquisar receitas... (Ex: chicken, pasta)"
            className="search-input"
          />
        </div>
        <button
          onClick={identificPesquisa}
          disabled={loading}
          className="search-btn"
        >
          {loading ? (
            <>
              <div className="search-spinner"></div>
              Pesquisando...
            </>
          ) : (
            'Pesquisar'
          )}
        </button>
      </div>
    </div>
  );
};

export default Barra;
