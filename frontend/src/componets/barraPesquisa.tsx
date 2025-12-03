import React, { useState } from 'react';
import axios from 'axios';

interface BarraPesquisa {
    onSearch: (results: any) => void;
}

const Barra: React.FC<BarraPesquisa> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const  identificPesquisa = async () => {
        if (!query.trim()) return;
        
        setLoading(true);
        try{
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
    <div style ={{ margin: '20px', textAlign: 'center' }}>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && identificPesquisa()}
            placeholder="Pesquisar receitas... (Ex: Frango, macarrão)"
            style={{
                padding: '10px',
                width: '300px',
                fontSize: '16px',
                borderRadius: '5px',
                border: '2px solid #ddd',
            }}
        />
        <button
            onClick={identificPesquisa}
            disabled={loading}
            style={{
                padding: '10px 20px',
                marginLeft: '10px',
                fontSize: '16px',
                borderRadius: '5px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
            }}
        >
            {loading ? 'Pesquisando...' : 'Pesquisar'}
        </button>
    </div>
   );
};   

export default Barra;