import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Create new energy level per gram for particular food
router.post('/', async(req,res) => {
    try{
        const value = 
    } catch (err) {
        res.status(500).send(err.message);
    }
});