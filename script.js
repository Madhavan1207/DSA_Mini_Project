// Load existing accounts or initialize
const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
const transactionStack = []; // Stack to track recent transactions

function saveAccounts() {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

function createAccount() {
  const name = document.getElementById('accountName').value.trim();
  if (!name) return alert('Enter account name');
  if (accounts[name]) return alert('Account already exists');

  accounts[name] = { balance: 0, transactions: [] };
  localStorage.setItem('currentUser', name);
  saveAccounts();
  alert(`Account "${name}" created`);
  updateDisplay(name);
}

function deposit() {
  const name = document.getElementById('accountName').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  if (!accounts[name]) return alert('Account not found');
  if (isNaN(amount) || amount <= 0) return alert('Enter valid amount');

  accounts[name].balance += amount;
  accounts[name].transactions.push({ type: 'Deposit', amount });
  transactionStack.push({ type: 'Deposit', name, amount }); // Push to stack
  localStorage.setItem('currentUser', name);
  saveAccounts();
  alert(`Deposited ₹${amount} to "${name}"`);
  updateDisplay(name);
}

function withdraw() {
  const name = document.getElementById('accountName').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  if (!accounts[name]) return alert('Account not found');
  if (isNaN(amount) || amount <= 0) return alert('Enter valid amount');
  if (accounts[name].balance < amount) return alert('Insufficient funds');

  accounts[name].balance -= amount;
  accounts[name].transactions.push({ type: 'Withdraw', amount });
  transactionStack.push({ type: 'Withdraw', name, amount }); // Push to stack
  localStorage.setItem('currentUser', name);
  saveAccounts();
  alert(`Withdrew ₹${amount} from "${name}"`);
  updateDisplay(name);
}

function checkBalance() {
  const name = document.getElementById('accountName').value.trim();
  if (!accounts[name]) return alert('Account not found');

  alert(`Balance for "${name}": ₹${accounts[name].balance.toFixed(2)}`);
}

function viewTransactions() {
  const name = document.getElementById('accountName').value.trim();
  const list = document.getElementById('transactionHistory');
  list.innerHTML = '';

  if (!accounts[name]) return alert('Account not found');

  accounts[name].transactions.forEach(tx => {
    const li = document.createElement('li');
    li.textContent = `${tx.type}: ₹${tx.amount}`;
    list.appendChild(li);
  });
}

function updateDisplay(name) {
  document.getElementById('balanceDisplay').textContent = `₹${accounts[name].balance.toFixed(2)}`;
  document.getElementById('taxDisplay').textContent = `₹${(accounts[name].balance * 0.12).toFixed(2)}`;
}

function undoLastTransaction() {
  const last = transactionStack.pop();
  if (!last) return alert('No transaction to undo');

  const { type, name, amount } = last;
  if (!accounts[name]) return alert('Account not found');

  if (type === 'Deposit') {
    if (accounts[name].balance < amount) return alert('Cannot undo deposit — insufficient funds');
    accounts[name].balance -= amount;
    accounts[name].transactions.push({ type: 'Undo Deposit', amount: -amount });
  } else if (type === 'Withdraw') {
    accounts[name].balance += amount;
    accounts[name].transactions.push({ type: 'Undo Withdraw', amount: -amount });
  }

  saveAccounts();
  updateDisplay(name);
  alert(`Undid last ${type} of ₹${amount} for "${name}"`);
}
