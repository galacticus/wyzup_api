import express from 'express';
import { query } from '../db.mjs';

const router = express.Router();

// POST endpoint to add a new nutrient
router.post('/', async (req, res) => {
    try {
        const {
            nutrient_name,
            nutrient_category
        } = req.body;
        
        const checkSql = 'SELECT nutrient_id FROM nutrients WHERE nutrient_name = ?';
        const checkParams = [nutrient_name];
        const existingEntry = await query(checkSql, checkParams);

        if (existingEntry.length > 0) {
            // Entry exists, return the existing ID
            console.log(`Entry exists, return the existing ID: ${existingEntry[0].nutrient_id}`)
            res.status(200).json({ 
                message: 'Nutrient already exists', 
                nutrient_id: existingEntry[0].nutrient_id 
            });
        } else {
            // Entry does not exist, inset a new one
            const insertSql = 'INSERT INTO nutrients (nutrient_name, nutrient_category) VALUES (?, ?)';
            const insertParams = [nutrient_name, nutrient_category];
            const insertResults = await query(insertSql, insertParams);
            console.log(`Entry does not exist, ID generated: ${ insertResults.insertId}`);
            res.status(200).json({
                message: 'Nutrient added successfully',
                nutrient_id: insertResults.insertId 
            });
        }
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({"message": `An error occured: ${error.message}`});
    }
});

// GET endpoint to retrieve all nutrients
router.get('/', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM nutrients');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET endpoint to retrieve a specific nutrient by ID
router.get('/:nutrient_id', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM nutrients WHERE nutrient_id = ?', [req.params.nutrient_id]);
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
            nutrient_category
        } = req.body;
        const result = await query('UPDATE nutrients SET nutrient_name = ?, nutrient_category = ? WHERE nutrient_id = ?', [nutrient_name, nutrient_category, req.params.nutrient_id]);
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