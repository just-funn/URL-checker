// Simple client-side auth helpers (DEMO ONLY).
// This uses localStorage to keep a minimal session. Replace with a real backend/auth provider in production.

const AUTH_KEY = 'url_checker_user';

/**
 * Simulated login — DEMO only.
 * Accepts demo@user.com / demo123 as valid credentials.
 * Returns a Promise that resolves with a user object { email }.
 */
function loginUser(email, password) {
    return new Promise((resolve, reject) => {
        // simulate network latency
        setTimeout(() => {
            // Demo credential check
            if (email === 'demo@user.com' && password === 'demo123') {
                resolve({ email: email });
            } else {
                // For safety, reject other credentials in demo mode
                reject('Invalid email or password. Use demo@user.com / demo123');
            }
        }, 600);
    });
}

function setCurrentUser(user) {
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } catch (e) {
        console.warn('Could not persist user session', e);
    }
}

function getCurrentUser() {
    try {
        const v = localStorage.getItem(AUTH_KEY);
        if (!v) return null;
        return JSON.parse(v);
    } catch (e) {
        return null;
    }
}

function clearCurrentUser() {
    try {
        localStorage.removeItem(AUTH_KEY);
    } catch (e) {
        // ignore
    }
}