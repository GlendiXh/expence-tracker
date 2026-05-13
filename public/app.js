const API = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');

if (token) showDashboard();

// TABS
function showTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

// REGISTER
async function register() {
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();

  if (data.error) {
    document.getElementById('register-error').textContent = data.error;
  } else {
    alert('Registered successfully! Please login.');
    showTab('login');
  }
}

// LOGIN
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.error) {
    document.getElementById('login-error').textContent = data.error;
  } else {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    token = data.token;
    username = data.username;
    showDashboard();
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  token = null;
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('dashboard-section').style.display = 'none';
}

// SHOW DASHBOARD
function showDashboard() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'block';
  document.getElementById('welcome-username').textContent = username;
  loadExpenses();
}

// LOAD EXPENSES
async function loadExpenses() {
  const res = await fetch(`${API}/expenses`, {
    headers: { authorization: token }
  });

  const data = await res.json();
  const list = document.getElementById('transactions');
  list.innerHTML = '';

  let totalIncome = 0;
  let totalExpenses = 0;

  data.forEach(exp => {
    if (exp.type === 'income') totalIncome += exp.amount;
    else totalExpenses += exp.amount;

    list.innerHTML += `
      <div class="transaction">
        <div class="transaction-info">
          <strong>${exp.title}</strong>
          <p>${exp.category} • ${exp.date}</p>
        </div>
        <div style="display:flex; align-items:center">
          <span class="transaction-amount ${exp.type}">
            ${exp.type === 'income' ? '+' : '-'}$${exp.amount}
          </span>
          <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
        </div>
      </div>
    `;
  });

  document.getElementById('total-income').textContent = `$${totalIncome}`;
  document.getElementById('total-expenses').textContent = `$${totalExpenses}`;
  document.getElementById('total-balance').textContent = `$${totalIncome - totalExpenses}`;
}

// ADD EXPENSE
async function addExpense() {
  const title = document.getElementById('title').value;
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!title || !amount || !date) {
    document.getElementById('expense-error').textContent = 'Please fill all fields';
    return;
  }

  const res = await fetch(`${API}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    },
    body: JSON.stringify({ title, amount, type, category, date })
  });

  const data = await res.json();

  if (data.error) {
    document.getElementById('expense-error').textContent = data.error;
  } else {
    document.getElementById('title').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
    loadExpenses();
  }
}

// DELETE EXPENSE
async function deleteExpense(id) {
  await fetch(`${API}/expenses/${id}`, {
    method: 'DELETE',
    headers: { authorization: token }
  });
  loadExpenses();
}