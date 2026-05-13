const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// Routes (we'll add these soon)
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});