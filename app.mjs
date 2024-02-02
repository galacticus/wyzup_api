import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import foodsRouter from './routes/foods.mjs';
import nutrientsRouter from './routes/nutrients.mjs';
import foodNutrientsRouter from './routes/food_nutrients.mjs';
import allergensRouter from './routes/allergens.mjs';
import foodAllergensRouter from './routes/food_allergens.mjs';
import ingredientsRouter from './routes/ingredients.mjs';
import foodIngredientsRouter from './routes/food_ingredients.mjs';
import uploadRouter from './routes/upload.mjs';

const app = express();
const port = 3000;
const corsOptions = {
    origin: '*'
}
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors(corsOptions));
app.use(express.json());
app.use('/foods', foodsRouter);
app.use('/nutrients', nutrientsRouter);
app.use('/food_nutrients', foodNutrientsRouter);
app.use('/allergens', allergensRouter);
app.use('/food_allergens', foodAllergensRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/food_ingredients', foodIngredientsRouter);
app.use('/upload', uploadRouter);
app.use(express.static(join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Wyzup API running on port ${port}.`);
});
