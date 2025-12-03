import react from 'react';
import './receitaCard.css';

interface Receita{
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
}

interface ReceitaCardInfo {
    receita: Receita;
    onClick: (id: string) => void;
}

const ReceitaCard: React.FC<ReceitaCardInfo> = ({ receita, onClick }) => {
    return (
        <div className="receita-card" onClick={() => onClick(receita.idMeal)}>
            <img 
                src={receita.strMealThumb}
                alt={receita.strMeal}
                className="receita-card-img"
            />
            <div className="receita-card-content">
                <h3 className="receita-card-title">
                    {receita.strMeal}    
                </h3>    
                <div className='receita-card-info'>
                    <span className="receita-card-area">
                       📍 {receita.strArea}
                    </span>
                    <span className='receita-card-category'>
                          🍽️ {receita.strCategory}
                    </span>
                </div>
            </div>
        </div>
        
    );
};

export default ReceitaCard;