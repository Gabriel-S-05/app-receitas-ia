import { Router } from 'express';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Buscar receitas por nome
router.get('/recipes/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Buscar detalhes de uma receita específica
router.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});


router.post('/ai/suggest', async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients are required' });
    }

    const ingredientsList = ingredients.join(', ');
    const prompt = `Você é um chef expert. O usuário tem esses ingredientes em casa: ${ingredientsList}. 
    Sugira 3 receitas que ele pode fazer com esses ingredientes. 
    Para cada receita, retorne no formato JSON assim:
    {
      "receitas": [
        {
          "nome": "Nome da receita",
          "ingredientes_usados": ["ing1", "ing2"],
          "tempo_preparo": "30 minutos",
          "dificuldade": "fácil",
          "descricao": "Breve descrição"
        }
      ]
    }`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      res.json(parsedResponse);
    } else {
      res.json({ receitas: [], text });
    }
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

export default router;
