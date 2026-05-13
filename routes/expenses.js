const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  db.all(
    'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

router.post('/', auth, (req, res) => {
  const { title, amount, type, category, date } = req.body;

  if (!title || !amount || !type || !category || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO expenses (user_id, title, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, title, amount, type, category, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Expense added successfully', id: this.lastID });
    }
  );
});

router.delete('/:id', auth, (req, res) => {
  db.run(
    'DELETE FROM expenses WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Expense deleted successfully' });
    }
  );
});

module.exports = router;