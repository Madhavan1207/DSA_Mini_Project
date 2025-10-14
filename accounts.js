// Load all accounts and current user from localStorage
const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
const currentUser = localStorage.getItem('currentUser');

document.addEventListener('DOMContentLoaded', () => {
  if (!currentUser || !accounts[currentUser]) {
    showNoAccountMessage();
    return;
  }

  renderAccountDetails();
  renderTransactionChart();
});

function showNoAccountMessage() {
  document.body.innerHTML = `
    <div style="padding:20px;font-family:Segoe UI;">
      <h2>No account selected</h2>
      <p>Please go back and select or create an account.</p>
      <a href="index.html" style="color:#0078D4;font-weight:bold;">← Back to Banking</a>
    </div>
  `;
}

function renderAccountDetails() {
  const list = document.getElementById('accountList');
  list.innerHTML = '';

  const account = accounts[currentUser];
  const li = document.createElement('li');
  li.textContent = `${currentUser}: ₹${account.balance.toFixed(2)}`;
  list.appendChild(li);
}

function renderTransactionChart() {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  const account = accounts[currentUser];

  let totalDeposit = 0;
  let totalWithdraw = 0;

  account.transactions.forEach(tx => {
    if (tx.type === 'Deposit') totalDeposit += tx.amount;
    if (tx.type === 'Withdraw') totalWithdraw += tx.amount;
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Deposit', 'Withdraw'],
      datasets: [{
        label: 'Transaction Summary',
        data: [totalDeposit, totalWithdraw],
        backgroundColor: ['#4caf50', '#f44336'],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => `₹${context.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => `₹${value}`
          }
        }
      }
    }
  });
}