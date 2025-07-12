const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

require('dotenv').config();

const connectToMongo = require('./config/db');
connectToMongo();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});


app.get('/', (req, res) => { res.send('API is running') });

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Stackit backend listening on port ${port}`);
});