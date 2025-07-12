require('dotenv').config();

const connectToMongo = require('./config/db');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');


connectToMongo();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

app.get('/', (req, res) => { res.send('API is running') });

app.listen(port, () => {
  console.log(`Stackit backend listening on port ${port}`);
});