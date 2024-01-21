import express from 'express';
import { query } from '../db.mjs';

const router = express.Router();

// POST endpoint to add a new nutrient
router.post('/', async (req, res) => {
    try {
        const {
            nutrient_name,
            parent_nutrient_id
        } = req.body;

        const value = req.body;
        const result = await query('INSERT INTO nutrients (nutrient_name, parent_nutrient_id) VALUES (?, ?)', [nutrient_name, parent_nutrient_id]);

        res.status(201).json({
            message: 'Nutrient added successfully',
            nutrient_id: result.insertId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve all nutrients
router.get('/', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM nutrients');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific nutrient by ID
router.get('/:nutrient_id', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM nutrients WHERE nutrient_id = ?', [req.params.nutrient_id]);
        if (rows.length === 0) return res.status(404).send('Nutrient not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT endpoint to update a nutrient
router.put('/:nutrient_id', async (req, res) => {
    try {
        const {
            nutrient_name,
            parent_nutrient_id
        } = req.body;
        const result = await query('UPDATE nutrients SET nutrient_name = ?, parent_nutrient_id = ? WHERE nutrient_id = ?', [nutrient_name, parent_nutrient_id, req.params.nutrient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Nutrient not found.');
        res.send('Nutrient updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete a nutrient
router.delete('/:nutrient_id', async (req, res) => {
    try {
        const result = await query('DELETE FROM nutrients WHERE nutrient_id = ?', [req.params.nutrient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Nutrient not found.');
        res.send('Nutrient deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;