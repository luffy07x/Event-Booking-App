const accountsContainer = document.getElementById('accounts');
const createForm = document.getElementById('create-form');
const refreshBtn = document.getElementById('refresh');
const createError = document.getElementById('create-error');

async function loadAccounts() {
  accountsContainer.innerHTML = '<div class="muted">Loading...</div>';
  try {
    const res = await fetch('/api/accounts');
    if (!res.ok) throw new Error('Failed to load accounts');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Unexpected response');
    renderAccounts(data);
  } catch (err) {
    accountsContainer.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function renderAccounts(list) {
  if (list.length === 0) {
    accountsContainer.innerHTML = '<div class="muted">No accounts yet. Create one above.</div>';
    return;
  }
  accountsContainer.innerHTML = '';
  for (const acc of list) {
    const row = document.createElement('div');
    row.className = 'account';

    const title = document.createElement('div');
    title.innerHTML = `<h3>${escapeHtml(acc.name)}</h3><div class="muted">ID: ${escapeHtml(acc.id)}</div>`;

    const balance = document.createElement('div');
    balance.className = 'balance';
    balance.textContent = `$ ${Number(acc.balance).toFixed(2)}`;

    const deposit = document.createElement('div');
    deposit.className = 'actions';
    deposit.innerHTML = `
      <input type="number" step="0.01" min="0" placeholder="Amount">
      <button>Deposit</button>
    `;
    const depInput = deposit.querySelector('input');
    const depBtn = deposit.querySelector('button');
    depBtn.addEventListener('click', async () => {
      const amount = Number(depInput.value);
      if (!amount || amount <= 0) return;
      await postForm(`/api/accounts/${acc.id}/deposit`, { amount });
      await loadAccounts();
    });

    const withdraw = document.createElement('div');
    withdraw.className = 'actions';
    withdraw.innerHTML = `
      <input type="number" step="0.01" min="0" placeholder="Amount">
      <button>Withdraw</button>
    `;
    const wInput = withdraw.querySelector('input');
    const wBtn = withdraw.querySelector('button');
    wBtn.addEventListener('click', async () => {
      const amount = Number(wInput.value);
      if (!amount || amount <= 0) return;
      const res = await postForm(`/api/accounts/${acc.id}/withdraw`, { amount });
      if (!res.ok) {
        const msg = await safeError(res);
        alert(msg || 'Withdraw failed');
      }
      await loadAccounts();
    });

    row.appendChild(title);
    row.appendChild(balance);
    row.appendChild(deposit);
    row.appendChild(withdraw);
    accountsContainer.appendChild(row);
  }
}

createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  createError.textContent = '';
  const formData = new FormData(createForm);
  const name = formData.get('name');
  const initialBalance = formData.get('initialBalance') || '0';
  const res = await postForm('/api/accounts', { name, initialBalance });
  if (!res.ok) {
    const msg = await safeError(res);
    createError.textContent = msg || 'Create failed';
    return;
  }
  createForm.reset();
  await loadAccounts();
});

refreshBtn.addEventListener('click', loadAccounts);

function postForm(url, data) {
  const body = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => body.append(k, v));
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
}

async function safeError(res) {
  try {
    const txt = await res.text();
    const maybe = JSON.parse(txt);
    return maybe && maybe.error ? maybe.error : txt;
  } catch (_) {
    return 'Error';
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// initial load
loadAccounts();