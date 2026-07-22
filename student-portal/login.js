/**
 * Student Login Portal - JavaScript
 * Handles login validation, session management, and user authentication
 */

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const showPasswordCheckbox = document.getElementById('showPassword');
const eyeIcon = document.getElementById('eyeIcon');
const clearBtn = document.getElementById('clearBtn');
const continueBtn = document.getElementById('continueBtn');

// Modal Elements
const loginSuccessModal = new bootstrap.Modal(document.getElementById('loginSuccessModal'));
const loginErrorModal = new bootstrap.Modal(document.getElementById('loginErrorModal'));

// Demo Credentials
const DEMO_EMAIL = '';
const DEMO_PASSWORD = '';

/**
 * Initialize the login page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Add event listeners
    loginForm.addEventListener('submit', handleLogin);
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    showPasswordCheckbox.addEventListener('change', togglePasswordVisibility);
    clearBtn.addEventListener('click', clearForm);
    continueBtn.addEventListener('click', redirectToRegistration);
    
    // Add real-time validation
    emailInput.addEventListener('input', () => validateField(emailInput, validateEmail));
    passwordInput.addEventListener('input', () => validateField(passwordInput, validatePassword));
});

/**
 * Check if user is already logged in
 */
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('studentLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'registration.html';
    }
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    // Show errors if validation fails
    if (!isEmailValid) {
        showError(emailInput, 'Please enter a valid email address');
    }
    
    if (!isPasswordValid) {
        showError(passwordInput, 'Password must be at least 6 characters');
    }
    
    // If validation passes, allow login with any valid credentials
    if (isEmailValid && isPasswordValid) {
        // Login successful
        showLoginSuccess();
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    if (!email) {
        return false;
    }
    
    // Email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Validate password
 */
function validatePassword(password) {
    if (!password) {
        return false;
    }
    
    // Password must be at least 6 characters
    return password.length >= 6;
}

/**
 * Validate a single field
 */
function validateField(input, validationFn) {
    const value = input.value.trim();
    const isValid = validationFn(value);
    
    if (isValid) {
        clearError(input);
    }
    
    return isValid;
}

/**
 * Show error message for a field
 */
function showError(input, message) {
    input.classList.add('is-invalid');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

/**
 * Clear error message for a field
 */
function clearError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const isCheckboxChecked = showPasswordCheckbox.checked;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
        showPasswordCheckbox.checked = true;
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
        showPasswordCheckbox.checked = false;
    }
}

/**
 * Clear the login form
 */
function clearForm() {
    loginForm.reset();
    clearError(emailInput);
    clearError(passwordInput);
    passwordInput.type = 'password';
    eyeIcon.classList.remove('bi-eye-slash');
    eyeIcon.classList.add('bi-eye');
    showPasswordCheckbox.checked = false;
}

/**
 * Show login success modal
 */
function showLoginSuccess() {
    // Set session storage
    sessionStorage.setItem('studentLoggedIn', 'true');
    
    // Show success modal
    loginSuccessModal.show();
}

/**
 * Show login error modal
 */
function showLoginError() {
    loginErrorModal.show();
}

/**
 * Redirect to registration page
 */
function redirectToRegistration() {
    loginSuccessModal.hide();
    window.location.href = 'registration.html';
}
