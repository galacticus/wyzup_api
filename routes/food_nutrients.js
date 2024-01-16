import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// POST endpoint to add a new food nutrient entry
router.post('/', async (req, res) => {
    try {
        const { food_id, nutrient_id, unit, amount_per_gram } = req.body;
        const result = await query('INSERT INTO food_nutrient (food_id, nutrient_id, unit, amount_per_gram) VALUES (?, ?, ?, ?)', [food_id, nutrient_id, unit, amount_per_gram]);
        res.status(201).json({
            message: 'Food Nutrient entry added successfully',
            food_nutrient_id: result.insertId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve all food nutrient entries
router.get('/', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM food_nutrient');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific food nutrient entry by ID
router.get('/:food_nutrient_id', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM food_nutrient WHERE food_nutrient_id = ?', [req.params.food_nutrient_id]);
        if (rows.length === 0) return res.status(404).send('Food Nutrient entry not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT endpoint to update a food nutrient entry
router.put('/:food_nutrient_id', async (req, res) => {
    try {
        const { food_id, nutrient_id, unit, amount_per_gram } = req.body;
        const result = await query('UPDATE food_nutrient SET food_id = ?, nutrient_id = ?, unit = ?, amount_per_gram = ? WHERE food_nutrient_id = ?', [food_id, nutrient_id, unit, amount_per_gram, req.params.food_nutrient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food Nutrient entry not found.');
        res.send('Food Nutrient entry updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete a food nutrient entry by ID
router.delete('/:food_nutrient_id', async (req, res) => {
    try {
        const result = await query('DELETE FROM food_nutrient WHERE food_nutrient_id = ?', [req.params.food_nutrient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food Nutrient entry not found.');
        res.send('Food Nutrient entry deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
