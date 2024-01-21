import express from 'express';
import { query } from '../db.mjs'; // Import your database connection or ORM

const router = express.Router();

// POST endpoint to add a new food ingredient entry
router.post('/', async (req, res) => {
    try {
        const { food_id, ingredient_id, quantity } = req.body;
        const result = await query('INSERT INTO FoodIngredients (food_id, ingredient_id, quantity) VALUES (?, ?, ?)', [food_id, ingredient_id, quantity]);
        res.status(201).json({
            message: 'Food Ingredient entry added successfully',
            food_id,
            ingredient_id,
            quantity
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve all food ingredient entries
router.get('/', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM FoodIngredients');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve food ingredient entries for a specific food by food_id
router.get('/:food_id', async (req, res) => {
    try {
        const [rows] = await query('SELECT Ingredients.ingredient_name, FoodIngredients.quantity FROM FoodIngredients JOIN Ingredients ON FoodIngredients.ingredient_id = Ingredients.ingredient_id WHERE FoodIngredients.food_id = ?', [req.params.food_id]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete a food ingredient entry by food_id and ingredient_id
router.delete('/:food_id/:ingredient_id', async (req, res) => {
    try {
        const { food_id, ingredient_id } = req.params;
        const result = await query('DELETE FROM FoodIngredients WHERE food_id = ? AND ingredient_id = ?', [food_id, ingredient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food Ingredient entry not found.');
        res.send('Food Ingredient entry deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
