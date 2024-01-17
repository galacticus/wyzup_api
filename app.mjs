import express from 'express';
import cors from 'cors';
import foodsRouter from './routes/foods.js';
import nutrientsRouter from './routes/nutrients.js';
import foodNutrientsRouter from './routes/food_nutrients.js';
import allergensRouter from './routes/allergens.js';
import foodAllergensRouter from './routes/food_allergens.js';
import ingredientsRouter from './routes/ingredients.js';
import foodIngredientsRouter from './routes/food_ingredients.js';

const app = express();
const port = 3000;

//this will need to be turned off later maybe?
app.use(cors());
app.use(express.json());
app.use('/foods', foodsRouter);
app.use('/nutrients', nutrientsRouter);
app.use('/food_nutrients', foodNutrientsRouter);
app.use('/allergens', allergensRouter);
app.use('/food_allergens', foodAllergensRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/food_ingredients', foodIngredientsRouter);

app.listen(port, () => {
    console.log(`API running on port ${port}.`);
});
