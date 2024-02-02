import express from 'express';
import { query } from '../db.mjs';

const router = express.Router();

// POST endpoint to add a new food nutrient entry
router.post('/', async (req, res) => {
    try {
        const { 
            food_id,
            nutrient_id,
            unit,
            per_100_grams
        } = req.body;

        const checkSql = 'SELECT food_id, nutrient_id FROM food_nutrients WHERE food_id = ? AND nutrient_id = ?';
        const checkParams = [food_id, nutrient_id];
        const existingEntry = await query(checkSql, checkParams);

        if (existingEntry.length > 0) {
            console.log(`Entry already exists for ,${existingEntry[0].nutrient_id}`);
            res.status(200).json({
                message: `The nutrient_id:${existingEntry[0].nutrient_id} already exists forfood_id:${existingEntry[0].food_id}.`
            });
        } else {
            const insertSql = 'INSERT INTO food_nutrients (food_id, nutrient_id, unit, per_100_grams) VALUES (?, ?, ?, ?)';
            const insertParams = [food_id, nutrient_id, unit, per_100_grams];
            const insertResults = await query(insertSql, insertParams);
            console.log(`Entry does not exist, ID generated: ${ insertResults.insertId}`);
            res.status(200).json({ 
                message: 'food_nutrient added successfully', 
                food_nutrient: insertResults.insertId
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: `An error occured: ${error.message}` });
    }
});

// GET endpoint to retrieve all food nutrient entries
router.get('/', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM food_nutrients');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific food nutrient entry by ID
router.get('/:food_nutrient_id', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM food_nutrients WHERE food_nutrient_id = ?', [req.params.food_nutrient_id]);
        if (rows.length === 0) return res.status(404).send('Food Nutrient entry not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT endpoint to update a food nutrient entry
router.put('/:food_nutrient_id', async (req, res) => {
    try {
        const { food_id, nutrient_id, unit, per_100_grams } = req.body;
        const result = await query('UPDATE food_nutrients SET food_id = ?, nutrient_id = ?, unit = ?, per_100_grams = ? WHERE food_nutrient_id = ?', [food_id, nutrient_id, unit, per_100_grams, req.params.food_nutrient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food Nutrient entry not found.');
        res.send('Food Nutrient entry updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE endpoint to delete a food nutrient entry by ID
router.delete('/:food_nutrient_id', async (req, res) => {
    try {
        const result = await query('DELETE FROM food_nutrients WHERE food_nutrient_id = ?', [req.params.food_nutrient_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food Nutrient entry not found.');
        res.send('Food Nutrient entry deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
