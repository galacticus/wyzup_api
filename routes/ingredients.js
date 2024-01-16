import express from 'express';
import { query } from '../db.js'; // Import your database connection or ORM

const router = express.Router();

// POST endpoint to add a new ingredient
router.post('/', async (req, res) => {
    try {
        const { ingredient_name } = req.body;
        const result = await query('INSERT INTO Ingredients (ingredient_name) VALUES (?)', [ingredient_name]);
        res.status(201).json({
            message: 'Ingredient added successfully',
            ingredient_id: result.insertId
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve all ingredients
router.get('/', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM Ingredients');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific ingredient by ID
router.get('/:ingredient_id', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM Ingredients WHERE ingredient_id = ?', [req.params.ingredient_id]);
        if (rows.length === 0) return res.status(404).send('Ingredient not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT endpoint to update an ingredient by ID
router.put(':ingredient_id', async (req, res) => {
    try {
        const { ingredient_name } = req.body;
        const result = await query('UPDATE Ingredients SET ingredient_name = ? WHERE ingredient_id = ?', [ingredient_name, req.params.ingredient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Ingredient not found.');
        res.send('Ingredient updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete an ingredient by ID
router.delete(':ingredient_id', async (req, res) => {
    try {
        const result = await query('DELETE FROM Ingredients WHERE ingredient_id = ?', [req.params.ingredient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Ingredient not found.');
        res.send('Ingredient deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
