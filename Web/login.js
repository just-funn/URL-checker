// Handles the login page submit and uses auth.js helpers

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const msg = document.getElementById('msg');
    const submitBtn = document.getElementById('submitBtn');

    // If already logged in, redirect to main page
    const existing = getCurrentUser();
    if (existing && existing.email) {
        window.location.href = 'index.html';
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        msg.textContent = '';
        msg.className = 'msg';

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            msg.textContent = 'Please enter both email and password';
            msg.classList.add('error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        // Use demo loginUser which simulates authentication
        loginUser(email, password)
            .then(user => {
                setCurrentUser(user);
                msg.textContent = 'Signed in successfully — redirecting...';
                msg.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            })
            .catch(err => {
                msg.textContent = err || 'Invalid credentials';
                msg.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            });
    });
});
