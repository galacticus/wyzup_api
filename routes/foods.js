import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Create a new food item
router.post('/', async (req, res) => {
    try {
        const {
            food_name,
            food_category,
            food_image
        } = req.body;

        const queryText = 'INSERT INTO foods (food_name, food_category, food_image) VALUES (?, ?, ?)';
        const queryParams = [food_name, food_category, food_image];
        const rows = await query(queryText, queryParams);
        
        res.status(201).json({ 
            message: 'Food added successfully', 
            food_id: rows.insertId 
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve all food items
router.get('/', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM foods');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve a specific food item
router.get('/:id', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM foods WHERE food_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send(`Food with id: ${req.params.id} not found.`);
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve the id for specific food item based on name
router.get('/:foodName/id', async (req, res) => {
    try {
        const foodName = req.params.foodName;
        const queryText = 'SELECT food_id FROM foods WHERE lower(foods.food_name) = lower(?)';
        const rows = await query(queryText, [foodName]);
        if (rows.length === 0) return res.status(404).send(`No food called ${foodName} seems to exist.`);
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve food nutrients
router.get('/:foodName/nutrients', async (req, res) => {
    try {
        const foodName = req.params.foodName;
        const queryText = `
            SELECT n.nutrient_name, fn.qty
            FROM foods f
            JOIN food_nutrients fn ON f.food_id = fn.food_id
            JOIN nutrients n ON fn.nutrient_id = n.nutrient_id
            WHERE f.food_name = ?
            `;
        
        const rows = await query(queryText, [foodName]);
        if (rows.length === 0) return res.status(404).send(`No nutritional information found for ${foodName}.`);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve food allergens
router.get('/:foodName/allergens', async (req, res) => {
    try {
        const foodName = req.params.foodName;
        const queryText = `
        SELECT a.allergen_name
        FROM foods f
        JOIN food_allergens fa ON f.food_id = fa.food_id
        JOIN allergens a ON fa.allergen_id = a.allergen_id
        WHERE f.food_name = ?
        `;

        const rows = await query(queryText, [foodName]);
        if (rows.length === 0) return res.status(404).send(`No allergens found for ${foodName}.`);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve food ingredients
router.get('/:foodName/ingredients')

// Update a food item
router.put('/:id', async (req, res) => {
    try {
        const result = await query('UPDATE foods SET food_name = ? WHERE food_id = ?', [value.food_name, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Food not found.');
        res.send('Food updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
  });
  
  // Delete a food item
  router.delete('/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM foods WHERE food_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send('Food not found.');
        res.send('Food deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
  });

  export default router;