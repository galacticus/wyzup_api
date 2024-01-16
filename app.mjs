import express from 'express';
import cors from 'cors';
import foodsRouter from './routes/foods.js';

const app = express();
const port = 3000;

//this will need to be turned off later maybe?
app.use(cors());

app.use(express.json());
app.use('/foods', foodsRouter);

app.listen(port, () => {
    console.log(`API running on port ${port}.`);
});
