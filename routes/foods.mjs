import express from 'express';
import { query } from '../db.mjs';

const router = express.Router();

// Create a new food item
router.post('/', async (req, res) => {
    try {
        const {
            food_name,
            food_category,
            food_image
        } = req.body;

        const checkSql = 'SELECT food_id FROM foods WHERE food_name = ? ';
        const checkParams = [food_name];
        const existingEntry = await query(checkSql, checkParams);

        if (existingEntry.length > 0) {
            // Entry exists, return the existing ID
            console.log(`Entry exists, return the existing ID: ${existingEntry[0].food_id}`)
            res.status(200).json({
                message: 'Food already exists', 
                food_id: existingEntry[0].food_id
            });
        } else {
            const insertSql = 'INSERT INTO foods (food_name, food_category, food_image) VALUES (?, ?, ?)';
            const insertParams = [food_name, food_category, food_image];
            const insertResults = await query(queryText, queryParams);
            console.log(`Entry does not exist, ID generated: ${ insertResults.insertId}`);
            res.status(200).json({ 
                message: 'Food added successfully', 
                food_id: insertResults.insertId 
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({"message": `An error occured: ${error.message}`});
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
router.get('/:food_id', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM foods WHERE food_id = ?', [req.params.food_id]);
        if (rows.length === 0) return res.status(404).send(`Food with id: ${req.params.food_id} not found.`);
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve the id for specific food item based on name
router.get('/:food_name/food_id', async (req, res) => {
    try {
        const food_name = req.params.food_name;
        const queryText = 'SELECT food_id FROM foods WHERE lower(foods.food_name) = lower(?)';
        const rows = await query(queryText, [food_name]);
        if (rows.length === 0) return res.status(404).send(`No food called ${food_name} seems to exist.`);
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve the specific food item based on name search
router.get('/search/:food_name', async (req, res) => {
    try {
        const food_name = req.params.food_name;
        const queryText = 'SELECT * FROM foods WHERE lower(foods.food_name) = lower(?)';
        const rows = await query(queryText, [food_name]);
        if (rows.length === 0) return res.status(404).send(`No food called ${food_name} seems to exist.`);
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve food nutrients
router.get('/:food_id/nutrients', async(req, res) => {
    try {
        const food_id = req.params.food_id;
        const queryText = `
        SELECT n.nutrient_name, fn.per_100_grams, fn.unit, n.nutrient_category
        FROM foods f
        JOIN food_nutrients fn ON f.food_id = fn.food_id
        JOIN nutrients n ON fn.nutrient_id = n.nutrient_id
        WHERE f.food_id = ?
        `;
        const rows = await query(queryText, [food_id]);
        if (rows.length === 0) return res.status(404).send(`No food id ${food_id} or nutrient data does not exist.`)
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Retrieve food allergens
router.get('/:food_id/allergens', async(req, res) => {
    try {
        const food_id = req.params.food_id;
        const queryText = `
        SELECT a.allergen_name
        FROM foods f
        JOIN food_allergens fa ON f.food_id = fa.food_id
        JOIN allergens a ON fa.allergen_id = a.allergen_id
        WHERE f.food_id = ?
        `;
        const rows = await query(queryText, [food_id]);
        if (rows.length === 0) return res.status(404).send(`No food id ${food_id} or allergen data does not exist.`);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a food item
router.put('/:food_id', async (req, res) => {
    try {
        const result = await query('UPDATE foods SET food_name = ? WHERE food_id = ?', [value.food_name, req.params.food_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food not found.');
        res.send('Food updated successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
  });
  
// Delete a food item
router.delete('/:food_id', async (req, res) => {
    try {
        const result = await query('DELETE FROM foods WHERE food_id = ?', [req.params.food_id]);
        if (result.affectedRows === 0) return res.status(404).send('Food not found.');
        res.send('Food deleted successfully.');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;