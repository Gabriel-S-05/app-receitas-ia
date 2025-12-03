import React, { useState } from 'react';
import './App.css';
import Barra from './componets/barraPesquisa';
import ReceitaCard from './componets/receitaCard';
import ReceitaModal from './componets/receitaModal';



interface Receita {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
}

function App() {
  const [receita, setReceita] = useState<Receita[]>([]);
  const [pesquisa, setPesquisa] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState<string | null>(null);
  

  const identificPesquisa = (results: Receita[]) => {
    setReceita(results);
    setPesquisa(true);
  };

  const identificPesquisaClick = (id: string) => {
    setReceitaSelecionada(id);
  };

  const fecharModal = () => {
    setReceitaSelecionada(null);
  };

  return (
    <div className="App">
      <h1>🍳 App de Receitas</h1>
      
      <Barra onSearch={identificPesquisa} />

      {pesquisa && receita.length === 0 && (
        <p>Nenhuma receita encontrada. Tente outro termo!</p>
      )}

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {receita.map((receita) => (
          <ReceitaCard
            key={receita.idMeal}
            receita={receita}
            onClick={identificPesquisaClick}
          />
        ))}
      </div>

      {receitaSelecionada && (
        <ReceitaModal
          receitaId={receitaSelecionada}
          onClose={fecharModal}
        />
      )}

      
    </div>
  );
}

export default App;
