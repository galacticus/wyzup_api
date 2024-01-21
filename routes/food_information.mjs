import express from 'express';
import { query } from '../db.mjs'; // Import your database connection or ORM

const router = express.Router();

// GET endpoint to retrieve nutrient information for a specific piece of food
router.get('/food/:food_id', async (req, res) => {
    try {
        const { food_id } = req.params;

        // Fetch food details
        const [foodDetails] = await query('SELECT * FROM Foods WHERE food_id = ?', [food_id]);

        // Fetch ingredients and quantities for the food
        const [foodIngredients] = await query('SELECT Ingredients.ingredient_name, FoodIngredients.quantity FROM FoodIngredients JOIN Ingredients ON FoodIngredients.ingredient_id = Ingredients.ingredient_id WHERE FoodIngredients.food_id = ?', [food_id]);

        // Fetch allergens associated with the food
        const [foodAllergens] = await query('SELECT Allergens.allergen_name FROM FoodAllergens JOIN Allergens ON FoodAllergens.allergen_id = Allergens.allergen_id WHERE FoodAllergens.food_id = ?', [food_id]);

        // Fetch nutrient information for the food
        const [foodNutrients] = await query('SELECT Nutrients.nutrient_name, FoodNutrients.amount_per_gram FROM FoodNutrients JOIN Nutrients ON FoodNutrients.nutrient_id = Nutrients.nutrient_id WHERE FoodNutrients.food_id = ?', [food_id]);

        // Combine the fetched data into a response object
        const foodInfo = {
            foodDetails,
            ingredients: foodIngredients,
            allergens: foodAllergens,
            nutrients: foodNutrients
        };

        res.status(200).json(foodInfo);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
