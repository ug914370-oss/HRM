  // ============================================
// CRYPTOVAULT - COMPLETE JAVASCRIPT CODE
// ============================================

// STATE MANAGEMENT
const state = {
    isLoggedIn: false,
    userEmail: '',
    sendData: {
        address: '',
        amount: '',
        crypto: 'BTC'
    }
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
    checkLoginStatus();
}

// ============================================
// LOGIN FUNCTIONS
// ============================================

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');

    errorMsg.classList.remove('show');

    if (email === 'Jenniferlawrence1@hotmail.com' && password === 'JennLawrence224') {
        loginBtn.innerHTML = '<span class="loading"></span>';
        
        setTimeout(() => {
            state.isLoggedIn = true;
            state.userEmail = email;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            goToDashboard();
            loginBtn.innerHTML = '🔐 Sign In';
        }, 1000);
    } else {
        errorMsg.textContent = 'Invalid credentials. Please check your email and password.';
        errorMsg.classList.add('show');
        loginBtn.innerHTML = '🔐 Sign In';
    }
}

function handleLogout() {
    state.isLoggedIn = false;
    state.userEmail = '';
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMessage').classList.remove('show');
    
    showPage('loginPage');
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn && userEmail) {
        state.isLoggedIn = true;
        state.userEmail = userEmail;
        document.getElementById('userEmail').textContent = `Logged in as: ${userEmail}`;
        goToDashboard();
    }
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function goToDashboard() {
    document.getElementById('userEmail').textContent = `Logged in as: ${state.userEmail}`;
    showPage('dashboardPage');
}

function goToSend() {
    showPage('sendPage1');
}

function goToSendReview() {
    const address = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('sendAmount').value;
    const crypto = document.getElementById('cryptoType').value;

    if (!address || !amount) {
        alert('Please fill in all fields');
        return;
    }

    state.sendData = { address, amount, crypto };

    document.getElementById('reviewAddress').textContent = address.substring(0, 20) + '...';
    document.getElementById('reviewAmount').textContent = '$' + amount;
    document.getElementById('reviewCrypto').textContent = crypto;
    document.getElementById('reviewTotal').textContent = '$' + (parseFloat(amount) + 15.50).toFixed(2);

    showPage('sendPage2');
}

function goToSendConfirm() {
    const txId = 'TX' + Math.random().toString(36).substring(2, 15).toUpperCase();
    
    document.getElementById('txId').textContent = txId;
    document.getElementById('receiptAmount').textContent = '$' + state.sendData.amount;
    document.getElementById('receiptRecipient').textContent = state.sendData.address.substring(0, 20) + '...';

    showPage('sendPage3');
}

// ============================================
// INITIALIZE ON LOAD
// ============================================

window.addEventListener('DOMContentLoaded', init);

// ============================================
// END OF JAVASCRIPT
// ============================================
