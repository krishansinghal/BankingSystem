// BankingSystem class to manage bank accounts
class BankingSystem {

  constructor(accNumber, ownerName, balance = 0) {
    this.accNumber = accNumber; // Account number
    this.ownerName = ownerName; // Account owner's name
    this.balance = balance; // Account balance
    this.transactionHistory = []; // Array to store transaction history
  }

  // Record a transaction with type, amount, date, balance, and account number
  recordTransaction(type, amount, accountNumber = this) {
    const transaction = {
      type, // Type of transaction (Deposit, Withdrawal, etc.)
      amount, // Amount involved in the transaction
      date: new Date().toISOString(),
      balance: this.balance,
      accountNumber: accountNumber.accNumber
    };
    this.transactionHistory.push(transaction);
  }

  // Deposit amount to account
  deposit(amount) {
    if (amount <= 0) {
      alert("Invalid Amount.");
      return;
    }
    this.balance += amount;
    this.recordTransaction("Deposit", amount);
    alert(`Deposited ${amount}. New balance: ${this.balance}`);
    updateAccountDetails(this);
    updateAllAccounts();
    clearActionFields();
  }

  // Withdraw amount from account
  withdraw(amount) {
    if (amount <= 0) {
      alert("Withdrawal amount must be positive.");
      return;
    }
    if (amount > this.balance) {
      alert("Insufficient balance.");
      return;
    }
    this.balance -= amount;
    this.recordTransaction("Withdrawal", amount);
    alert(`Withdrew ${amount}. New balance: ${this.balance}`);
    updateAccountDetails(this);
    updateAllAccounts();
    clearActionFields();
  }

  // Transfer amount to another account
  transfer(amount, recipientAccount) {
    if (amount <= 0) {
      alert("Invalid Amount.");
      return;
    }
    if (amount > this.balance) {
      alert("Insufficient balance.");
      return;
    }
    this.balance -= amount;
    recipientAccount.balance += amount;
    this.recordTransaction("Debit", amount, recipientAccount);
    recipientAccount.recordTransaction("Credit", amount, this);
    alert(`Credited ${amount} to ${recipientAccount.ownerName}. New balance: ${this.balance}`);
    updateAccountDetails(this);
    updateTransactionHistory(this);
    updateAllAccounts();
    clearActionFields();
  }

  // Calculate and add interest to the account balance
  accountInterest(rate) {
    if (rate <= 0) {
      alert("Interest rate must be positive.");
      return;
    }
    const interest = this.balance * (rate / 100);
    this.balance += interest;
    this.recordTransaction("Interest", interest);
    alert(`Interest calculated at ${rate}%. Interest amount: ${interest}. New balance: ${this.balance}`);
    updateAccountDetails(this);
    updateTransactionHistory(this);
    updateAllAccounts();
    clearActionFields();
  }

  // Retrieve account details
  getAccountDetails() {
    return {
      accNumber: this.accNumber,
      ownerName: this.ownerName,
      balance: this.balance,
      transactionHistory: this.transactionHistory
    };
  }
}

let accounts = [];

// Open a new account
function openAccount() {
  const ownerName = document.getElementById('ownerName').value;
  const initialBalance = parseFloat(document.getElementById('initialBalance').value);
  
  if (ownerName === '' || isNaN(initialBalance)) {
    alert('Please fill out all fields correctly.');
    return;
  }

  const accNumber = accounts.length + 1;
  const newAccount = new BankingSystem(accNumber, ownerName, initialBalance);
  accounts.push(newAccount);

  updateAccountDetails(newAccount);
  updateTransactionHistory(newAccount);
  updateAllAccounts();
  updateAccountSelectOptions();
  clearOpenAccountFields();
}

// Deposit function
function deposit() {
  const amount = parseFloat(document.getElementById('amount').value);
  const accNumber = parseInt(document.getElementById('accNumber').value);
  const account = accounts.find(acc => acc.accNumber === accNumber);
  if (account) {
    account.deposit(amount);
    updateTransactionHistory(account);
  } else {
    alert("Account not found.");
  }
  clearActionFields();
}

// Withdraw function
function withdraw() {
  const amount = parseFloat(document.getElementById('amount').value);
  const accNumber = parseInt(document.getElementById('accNumber').value);
  const account = accounts.find(acc => acc.accNumber === accNumber);
  if (account) {
    account.withdraw(amount);
    updateTransactionHistory(account);
  } else {
    alert("Account not found.");
  }
  clearActionFields();
}

// Transfer function
function transfer() {
  const amount = parseFloat(document.getElementById('amount').value);
  const sendTo = parseInt(document.getElementById('sendTo').value);
  const accNumber = parseInt(document.getElementById('accNumber').value);
  const senderAccount = accounts.find(acc => acc.accNumber === accNumber);
  const recipientAccount = accounts.find(acc => acc.accNumber === sendTo);
  if (senderAccount && recipientAccount) {
    senderAccount.transfer(amount, recipientAccount);
    updateTransactionHistory(senderAccount);
  } else {
    alert("Sender or recipient account not found.");
  }
  clearActionFields();
}

// Calculate interest
function accountInterest() {
  const interestRate = parseFloat(document.getElementById('interestRate').value);
  const accNumber = parseInt(document.getElementById('accNumber').value);
  const account = accounts.find(acc => acc.accNumber === accNumber);
  if (account) {
    account.accountInterest(interestRate);
    updateTransactionHistory(account);
  } else {
    alert("Account not found.");
  }
  clearActionFields();
}

// Update account details
function updateAccountDetails(account) {
  const details = account.getAccountDetails();
  document.getElementById('details').innerText = `Account Number: ${details.accNumber}\nAccount Owner: ${details.ownerName}\nBalance: ${details.balance}`;
}

// Update transaction history
function updateTransactionHistory(account) {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  account.transactionHistory.forEach(transaction => {
    const listItem = document.createElement('li');
    listItem.innerText = `${transaction.date}: ${transaction.type}  ${transaction.amount} Rupees. Balance: ${transaction.balance}. Account Number: ${transaction.accountNumber}`;
    historyList.appendChild(listItem);
  });
}

// Update account details and transaction history based on selected account
function updateAccountDetailsAndHistory() {
  const selectedaccNumber = document.getElementById('detailsAccountSelect').value;
  const account = accounts.find(acc => acc.accNumber == selectedaccNumber);

  if (account) {
    updateAccountDetails(account);
    updateTransactionHistory(account);
  }
}

// Populate account select options
function updateAccountSelectOptions() {
  const select = document.getElementById('detailsAccountSelect');
  select.innerHTML = '<option value="">Select Account</option>';
  accounts.forEach(account => {
    const option = document.createElement('option');
    option.value = account.accNumber;
    option.innerText = `Account ${account.accNumber}`;
    select.appendChild(option);
  });
}

// Update all accounts list
function updateAllAccounts() {
  const accountsList = document.getElementById('accountsList');
  accountsList.innerHTML = '';
  accounts.forEach(account => {
    const listItem = document.createElement('li');
    listItem.innerText = `Account Number: ${account.accNumber}, Account Owner: ${account.ownerName}, Balance: ${account.balance}`;
    accountsList.appendChild(listItem);
  });
}

// Clear input fields after opening an account
function clearOpenAccountFields() {
  document.getElementById('ownerName').value = '';
  document.getElementById('initialBalance').value = '';
}

// Clear action fields after performing an operation
function clearActionFields() {
  document.getElementById('amount').value = '';
  document.getElementById('accNumber').value = '';
  document.getElementById('sendTo').value = '';
  document.getElementById('interestRate').value = '';
}
