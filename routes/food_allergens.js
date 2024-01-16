import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// POST endpoint to add a new food allergen entry
router.post('/', async (req, res) => {
    try {
        const { food_id, allergen_id } = req.body;
        const result = await query('INSERT INTO food_allergens (food_id, allergen_id) VALUES (?, ?)', [food_id, allergen_id]);
        res.status(201).json({
            message: 'Food Allergen entry added successfully',
            food_id,
            allergen_id
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve all food allergen entries
router.get('/', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM food_allergens');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific food allergen entry by food_id and allergen_id
router.get('/:food_id/:allergen_id', async (req, res) => {
    try {
        const { food_id, allergen_id } = req.params;
        const [rows] = await query('SELECT * FROM food_allergens WHERE food_id = ? AND allergen_id = ?', [food_id, allergen_id]);
        if (rows.length === 0) return res.status(404).send('Food Allergen entry not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete a food allergen entry by food_id and allergen_id
router.delete('/:food_id/:allergen_id', async (req, res) => {
    try {
        const { food_id, allergen_id } = req.params;
        const result = await query('DELETE FROM food_allergens WHERE food_id = ? AND allergen_id = ?', [food_id, allergen_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food Allergen entry not found.');
        res.send('Food Allergen entry deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
