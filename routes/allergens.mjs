import express from 'express';
import { query } from '../db.mjs';

const router = express.Router();

// POST endpoint to add a new allergen
router.post('/', async (req, res) => {
    try {
        const { allergen_name } = req.body;
        const result = await query('INSERT INTO allergens (allergen_name) VALUES (?)', [allergen_name]);
        res.status(201).json({
            message: 'Allergen added successfully',
            allergen_id: result.insertId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve all allergens
router.get('/', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM allergens');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific allergen by ID
router.get('/:allergen_id', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM allergens WHERE allergen_id = ?', [req.params.allergen_id]);
        if (rows.length === 0) return res.status(404).send('Allergen not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT endpoint to update an allergen by ID
router.put('/:allergen_id', async (req, res) => {
    try {
        const { allergen_name } = req.body;
        const result = await query('UPDATE allergens SET allergen_name = ? WHERE allergen_id = ?', [allergen_name, req.params.allergen_id]);
        if (result.affectedRows === 0) return res.status(404).send('Allergen not found.');
        res.send('Allergen updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete an allergen by ID
router.delete('/:allergen_id', async (req, res) => {
    try {
        const result = await query('DELETE FROM allergens WHERE allergen_id = ?', [req.params.allergen_id]);
        if (result.affectedRows === 0) return res.status(404).send('Allergen not found.');
        res.send('Allergen deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
