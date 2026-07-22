/**
 * Student Registration Portal - JavaScript
 * Handles camera functionality, form validation, PDF generation, and session management
 */

// ============================================
// Global Variables
// ============================================

let cameraStream = null;
let capturedPhotoData = null;

// ============================================
// DOM Elements
// ============================================

// Camera Elements
const cameraVideo = document.getElementById('cameraVideo');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const startCameraBtn = document.getElementById('startCameraBtn');
const capturePhotoBtn = document.getElementById('capturePhotoBtn');
const stopCameraBtn = document.getElementById('stopCameraBtn');
const cameraError = document.getElementById('cameraError');

// Photo Elements
const studentPhoto = document.getElementById('studentPhoto');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const removePhotoBtn = document.getElementById('removePhotoBtn');
const photoInput = document.getElementById('photoInput');
const photoError = document.getElementById('photoError');
const captureCanvas = document.getElementById('captureCanvas');

// Form Elements
const registrationForm = document.getElementById('registrationForm');
const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const mobileNumber = document.getElementById('mobileNumber');
const dateOfBirth = document.getElementById('dateOfBirth');
const age = document.getElementById('age');
const address = document.getElementById('address');
const collegeName = document.getElementById('collegeName');
const degree = document.getElementById('degree');
const department = document.getElementById('department');
const yearOfPassing = document.getElementById('yearOfPassing');
const percentage = document.getElementById('percentage');
const experienceLevel = document.getElementById('experienceLevel');
const internshipCompany = document.getElementById('internshipCompany');
const internshipDuration = document.getElementById('internshipDuration');
const internshipRole = document.getElementById('internshipRole');
const projectTitle = document.getElementById('projectTitle');
const technologiesUsed = document.getElementById('technologiesUsed');
const projectDescription = document.getElementById('projectDescription');
const declaration = document.getElementById('declaration');

// Button Elements
const previewBtn = document.getElementById('previewBtn');
const submitBtn = document.getElementById('submitBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const resetBtn = document.getElementById('resetBtn');
const logoutBtn = document.getElementById('logoutBtn');
const logoutBtn2 = document.getElementById('logoutBtn2');

// Modal Elements
const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));
const successModal = new bootstrap.Modal(document.getElementById('successModal'));
const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
const resetModal = new bootstrap.Modal(document.getElementById('resetModal'));
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');

// ============================================
// Initialize the Registration Page
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Camera event listeners
    startCameraBtn.addEventListener('click', startCamera);
    capturePhotoBtn.addEventListener('click', capturePhoto);
    stopCameraBtn.addEventListener('click', stopCamera);
    
    // Photo upload event listeners
    uploadPhotoBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);
    removePhotoBtn.addEventListener('click', removePhoto);
    
    // Form validation event listeners
    fullName.addEventListener('input', () => validateField(fullName, validateFullName));
    email.addEventListener('input', () => validateField(email, validateEmail));
    mobileNumber.addEventListener('input', () => validateField(mobileNumber, validateMobileNumber));
    dateOfBirth.addEventListener('change', calculateAge);
    address.addEventListener('input', () => validateField(address, validateAddress));
    collegeName.addEventListener('input', () => validateField(collegeName, validateCollegeName));
    degree.addEventListener('change', () => validateField(degree, validateDegree));
    department.addEventListener('input', () => validateField(department, validateDepartment));
    yearOfPassing.addEventListener('change', () => validateField(yearOfPassing, validateYearOfPassing));
    percentage.addEventListener('input', () => validateField(percentage, validatePercentage));
    experienceLevel.addEventListener('change', () => validateField(experienceLevel, validateExperienceLevel));
    projectTitle.addEventListener('input', () => validateField(projectTitle, validateProjectTitle));
    projectDescription.addEventListener('input', () => validateField(projectDescription, validateProjectDescription));
    
    // Gender and marital status validation
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', () => validateGender());
    });
    
    document.querySelectorAll('input[name="maritalStatus"]').forEach(radio => {
        radio.addEventListener('change', () => validateMaritalStatus());
    });
    
    // Skills validation
    document.querySelectorAll('.skills-grid input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', validateSkills);
    });
    
    // Declaration validation
    declaration.addEventListener('change', validateDeclaration);
    
    // Button event listeners
    previewBtn.addEventListener('click', showPreview);
    submitBtn.addEventListener('click', submitRegistration);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    resetBtn.addEventListener('click', () => resetModal.show());
    logoutBtn.addEventListener('click', () => logoutModal.show());
    logoutBtn2.addEventListener('click', () => logoutModal.show());
    
    confirmLogoutBtn.addEventListener('click', handleLogout);
    confirmResetBtn.addEventListener('click', handleReset);
});

// ============================================
// Session Management
// ============================================

/**
 * Check if user is logged in
 */
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('studentLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    // Stop camera if running
    stopCamera();
    
    // Clear session
    sessionStorage.removeItem('studentLoggedIn');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// ============================================
// Camera Functionality
// ============================================

/**
 * Start the camera
 */
async function startCamera() {
    try {
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            } 
        });
        
        // Show video stream
        cameraVideo.srcObject = cameraStream;
        cameraVideo.style.display = 'block';
        cameraPlaceholder.style.display = 'none';
        
        // Enable/disable buttons
        startCameraBtn.disabled = true;
        capturePhotoBtn.disabled = false;
        stopCameraBtn.disabled = false;
        
        // Clear any previous errors
        cameraError.textContent = '';
        
    } catch (error) {
        // Handle camera errors
        let errorMessage = '';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage = 'No camera found on your device.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage = 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError' || error.name == 'ConstraintNotSatisfiedError') {
            errorMessage = 'Camera does not support the requested constraints.';
        } else if (error.name === 'SecurityError') {
            errorMessage = 'Camera access is only available on HTTPS or localhost. Please use a secure connection.';
        } else {
            errorMessage = 'Unable to access camera: ' + error.message;
        }
        
        cameraError.textContent = errorMessage;
        console.error('Camera error:', error);
    }
}

/**
 * Capture photo from camera
 */
function capturePhoto() {
    if (!cameraStream) {
        cameraError.textContent = 'Camera is not running. Please start the camera first.';
        return;
    }
    
    try {
        // Set canvas dimensions to match video
        captureCanvas.width = cameraVideo.videoWidth;
        captureCanvas.height = cameraVideo.videoHeight;
        
        // Draw video frame to canvas
        const ctx = captureCanvas.getContext('2d');
        ctx.drawImage(cameraVideo, 0, 0, captureCanvas.width, captureCanvas.height);
        
        // Convert to base64
        capturedPhotoData = captureCanvas.toDataURL('image/jpeg', 0.9);
        
        // Display captured photo
        displayPhoto(capturedPhotoData);
        
        // Clear any photo errors
        photoError.textContent = '';
        
    } catch (error) {
        photoError.textContent = 'Failed to capture photo: ' + error.message;
        console.error('Capture error:', error);
    }
}

/**
 * Stop the camera
 */
function stopCamera() {
    if (cameraStream) {
        // Stop all video tracks
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        
        // Hide video, show placeholder
        cameraVideo.style.display = 'none';
        cameraPlaceholder.style.display = 'flex';
        
        // Enable/disable buttons
        startCameraBtn.disabled = false;
        capturePhotoBtn.disabled = true;
        stopCameraBtn.disabled = true;
    }
}

// ============================================
// Photo Upload Functionality
// ============================================

/**
 * Handle photo upload
 */
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        photoError.textContent = 'Please select an image file.';
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        photoError.textContent = 'Image size must be less than 5MB.';
        return;
    }
    
    // Read and display the image
    const reader = new FileReader();
    reader.onload = function(e) {
        capturedPhotoData = e.target.result;
        displayPhoto(capturedPhotoData);
        photoError.textContent = '';
    };
    reader.readAsDataURL(file);
}

/**
 * Display the photo in the student photo box
 */
function displayPhoto(photoData) {
    studentPhoto.src = photoData;
    studentPhoto.style.display = 'block';
    photoPlaceholder.style.display = 'none';
    removePhotoBtn.disabled = false;
}

/**
 * Remove the photo
 */
function removePhoto() {
    capturedPhotoData = null;
    studentPhoto.src = '';
    studentPhoto.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
    removePhotoBtn.disabled = true;
    photoInput.value = '';
    photoError.textContent = '';
}

// ============================================
// Form Validation Functions
// ============================================

/**
 * Validate full name (cannot be only numbers)
 */
function validateFullName(name) {
    if (!name || name.trim() === '') {
        return false;
    }
    
    // Check if name contains only numbers
    if (/^\d+$/.test(name.trim())) {
        return false;
    }
    
    return name.trim().length >= 2;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return false;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
}

/**
 * Validate mobile number (exactly 10 digits)
 */
function validateMobileNumber(mobile) {
    if (!mobile || mobile.trim() === '') {
        return false;
    }
    
    const mobilePattern = /^\d{10}$/;
    return mobilePattern.test(mobile.trim());
}

/**
 * Validate date of birth (not a future date)
 */
function validateDateOfBirth(dob) {
    if (!dob) {
        return false;
    }
    
    const selectedDate = new Date(dob);
    const today = new Date();
    
    return selectedDate <= today;
}

/**
 * Calculate age from date of birth
 */
function calculateAge() {
    const dobValue = dateOfBirth.value;
    
    if (!dobValue) {
        age.value = '';
        return;
    }
    
    if (!validateDateOfBirth(dobValue)) {
        showError(dateOfBirth, 'Date of birth cannot be a future date');
        age.value = '';
        return;
    }
    
    clearError(dateOfBirth);
    
    const dob = new Date(dobValue);
    const today = new Date();
    
    let ageValue = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        ageValue--;
    }
    
    age.value = ageValue;
}

/**
 * Validate address
 */
function validateAddress(addr) {
    return addr && addr.trim().length >= 10;
}

/**
 * Validate college name
 */
function validateCollegeName(college) {
    return college && college.trim().length >= 2;
}

/**
 * Validate degree
 */
function validateDegree(deg) {
    return deg && deg !== '';
}

/**
 * Validate department
 */
function validateDepartment(dept) {
    return dept && dept.trim().length >= 2;
}

/**
 * Validate year of passing
 */
function validateYearOfPassing(year) {
    return year && year !== '';
}

/**
 * Validate percentage/CGPA
 */
function validatePercentage(perc) {
    return perc && perc.trim().length >= 1;
}

/**
 * Validate experience level
 */
function validateExperienceLevel(exp) {
    return exp && exp !== '';
}

/**
 * Validate project title
 */
function validateProjectTitle(title) {
    return title && title.trim().length >= 3;
}

/**
 * Validate project description
 */
function validateProjectDescription(desc) {
    return desc && desc.trim().length >= 10;
}

/**
 * Validate gender selection
 */
function validateGender() {
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    const genderError = document.getElementById('genderError');
    
    if (!genderSelected) {
        genderError.style.display = 'block';
        genderError.textContent = 'Please select a gender';
        return false;
    }
    
    genderError.style.display = 'none';
    return true;
}

/**
 * Validate marital status selection
 */
function validateMaritalStatus() {
    const maritalSelected = document.querySelector('input[name="maritalStatus"]:checked');
    const maritalError = document.getElementById('maritalStatusError');
    
    if (!maritalSelected) {
        maritalError.style.display = 'block';
        maritalError.textContent = 'Please select marital status';
        return false;
    }
    
    maritalError.style.display = 'none';
    return true;
}

/**
 * Validate technical skills (at least one must be selected)
 */
function validateSkills() {
    const skillsSelected = document.querySelectorAll('.skills-grid input[type="checkbox"]:checked');
    const skillsError = document.getElementById('skillsError');
    
    if (skillsSelected.length === 0) {
        skillsError.style.display = 'block';
        skillsError.textContent = 'Please select at least one technical skill';
        return false;
    }
    
    skillsError.style.display = 'none';
    return true;
}

/**
 * Validate declaration checkbox
 */
function validateDeclaration() {
    const declarationError = document.getElementById('declarationError');
    
    if (!declaration.checked) {
        declarationError.style.display = 'block';
        declarationError.textContent = 'Please confirm the declaration';
        return false;
    }
    
    declarationError.style.display = 'none';
    return true;
}

/**
 * Validate a single field
 */
function validateField(input, validationFn) {
    const value = input.value;
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
    const errorDiv = input.parentElement.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

/**
 * Clear error message for a field
 */
function clearError(input) {
    input.classList.remove('is-invalid');
    const errorDiv = input.parentElement.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

/**
 * Validate all form fields
 */
function validateAllFields() {
    let isValid = true;
    
    // Personal Details
    if (!validateField(fullName, validateFullName)) {
        showError(fullName, 'Full name must be at least 2 characters and cannot be only numbers');
        isValid = false;
    }
    
    if (!validateField(email, validateEmail)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!validateField(mobileNumber, validateMobileNumber)) {
        showError(mobileNumber, 'Mobile number must be exactly 10 digits');
        isValid = false;
    }
    
    if (!validateDateOfBirth(dateOfBirth.value)) {
        showError(dateOfBirth, 'Please select a valid date of birth (not a future date)');
        isValid = false;
    }
    
    if (!validateGender()) {
        isValid = false;
    }
    
    if (!validateMaritalStatus()) {
        isValid = false;
    }
    
    if (!validateField(address, validateAddress)) {
        showError(address, 'Address must be at least 10 characters');
        isValid = false;
    }
    
    // Academic Details
    if (!validateField(collegeName, validateCollegeName)) {
        showError(collegeName, 'College name must be at least 2 characters');
        isValid = false;
    }
    
    if (!validateField(degree, validateDegree)) {
        showError(degree, 'Please select a degree');
        isValid = false;
    }
    
    if (!validateField(department, validateDepartment)) {
        showError(department, 'Department must be at least 2 characters');
        isValid = false;
    }
    
    if (!validateField(yearOfPassing, validateYearOfPassing)) {
        showError(yearOfPassing, 'Please select year of passing');
        isValid = false;
    }
    
    if (!validateField(percentage, validatePercentage)) {
        showError(percentage, 'Please enter percentage or CGPA');
        isValid = false;
    }
    
    // Technical Skills
    if (!validateSkills()) {
        isValid = false;
    }
    
    // Experience
    if (!validateField(experienceLevel, validateExperienceLevel)) {
        showError(experienceLevel, 'Please select experience level');
        isValid = false;
    }
    
    // Project Details
    if (!validateField(projectTitle, validateProjectTitle)) {
        showError(projectTitle, 'Project title must be at least 3 characters');
        isValid = false;
    }
    
    if (!validateField(projectDescription, validateProjectDescription)) {
        showError(projectDescription, 'Project description must be at least 10 characters');
        isValid = false;
    }
    
    // Student Photo
    if (!capturedPhotoData) {
        photoError.textContent = 'Please upload or capture a student photo';
        isValid = false;
    }
    
    // Declaration
    if (!validateDeclaration()) {
        isValid = false;
    }
    
    return isValid;
}

// ============================================
// Preview Functionality
// ============================================

/**
 * Show preview of all entered details
 */
function showPreview() {
    if (!validateAllFields()) {
        return;
    }
    
    // Get all form values
    const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
    const maritalStatus = document.querySelector('input[name="maritalStatus"]:checked')?.value || '';
    const selectedSkills = Array.from(document.querySelectorAll('.skills-grid input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Build preview HTML
    let previewHTML = '';
    
    // Student Photo
    previewHTML += `
        <div class="text-center mb-4">
            <img src="${capturedPhotoData}" class="preview-photo" alt="Student Photo">
        </div>
    `;
    
    // Personal Details
    previewHTML += `
        <div class="preview-section">
            <h6><i class="bi bi-person-badge"></i> Personal Details</h6>
            <p><strong>Full Name:</strong> ${fullName.value}</p>
            <p><strong>Email:</strong> ${email.value}</p>
            <p><strong>Mobile Number:</strong> ${mobileNumber.value}</p>
            <p><strong>Date of Birth:</strong> ${dateOfBirth.value}</p>
            <p><strong>Age:</strong> ${age.value}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Marital Status:</strong> ${maritalStatus}</p>
            <p><strong>Address:</strong> ${address.value}</p>
        </div>
    `;
    
    // Academic Details
    previewHTML += `
        <div class="preview-section">
            <h6><i class="bi bi-mortarboard"></i> Academic Details</h6>
            <p><strong>College Name:</strong> ${collegeName.value}</p>
            <p><strong>Degree:</strong> ${degree.value}</p>
            <p><strong>Department:</strong> ${department.value}</p>
            <p><strong>Year of Passing:</strong> ${yearOfPassing.value}</p>
            <p><strong>Percentage/CGPA:</strong> ${percentage.value}</p>
        </div>
    `;
    
    // Technical Skills
    previewHTML += `
        <div class="preview-section">
            <h6><i class="bi bi-tools"></i> Technical Skills</h6>
            <div class="preview-skills">
                ${selectedSkills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Experience
    previewHTML += `
        <div class="preview-section">
            <h6><i class="bi bi-briefcase"></i> Internship and Experience</h6>
            <p><strong>Experience Level:</strong> ${experienceLevel.value}</p>
            <p><strong>Internship Company:</strong> ${internshipCompany.value || 'N/A'}</p>
            <p><strong>Internship Duration:</strong> ${internshipDuration.value || 'N/A'}</p>
            <p><strong>Internship Role:</strong> ${internshipRole.value || 'N/A'}</p>
        </div>
    `;
    
    // Project Details
    previewHTML += `
        <div class="preview-section">
            <h6><i class="bi bi-code-slash"></i> Project Details</h6>
            <p><strong>Project Title:</strong> ${projectTitle.value}</p>
            <p><strong>Technologies Used:</strong> ${technologiesUsed.value || 'N/A'}</p>
            <p><strong>Project Description:</strong> ${projectDescription.value}</p>
        </div>
    `;
    
    // Insert preview content
    document.getElementById('previewContent').innerHTML = previewHTML;
    
    // Show preview modal
    previewModal.show();
}

// ============================================
// Submit Registration
// ============================================

/**
 * Submit the registration form
 */
function submitRegistration() {
    if (!validateAllFields()) {
        return;
    }
    
    // Show success modal
    successModal.show();
}

// ============================================
// PDF Generation
// ============================================

/**
 * Download registration details as PDF
 */
async function downloadPDF() {
    // Validate important fields
    if (!validateAllFields()) {
        return;
    }
    
    // Disable button and show loading state
    downloadPdfBtn.disabled = true;
    downloadPdfBtn.innerHTML = '<i class="bi bi-spinner spinner-border"></i> Generating PDF...';
    
    try {
        // Get jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get form values
        const gender = document.querySelector('input[name="gender"]:checked')?.value || '';
        const maritalStatus = document.querySelector('input[name="maritalStatus"]:checked')?.value || '';
        const selectedSkills = Array.from(document.querySelectorAll('.skills-grid input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        // PDF Settings
        const margin = 20;
        const lineHeight = 8;
        let yPosition = margin;
        
        // Helper function to check page break
        function checkPageBreak(requiredSpace = 20) {
            if (yPosition + requiredSpace > 280) {
                doc.addPage();
                yPosition = margin;
            }
        }
        
        // Helper function to add text
        function addText(label, value, isBold = false) {
            checkPageBreak();
            if (isBold) {
                doc.setFont('helvetica', 'bold');
            } else {
                doc.setFont('helvetica', 'normal');
            }
            doc.text(`${label}: ${value}`, margin, yPosition);
            yPosition += lineHeight;
        }
        
        // Title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Student Registration Details', margin, yPosition);
        yPosition += 15;
        
        // Registration Date
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Registration Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
        yPosition += 15;
        
        // Add student photo if available
        if (capturedPhotoData) {
            checkPageBreak(100);
            try {
                doc.addImage(capturedPhotoData, 'JPEG', margin, yPosition, 50, 60);
                yPosition += 70;
            } catch (error) {
                console.error('Error adding image to PDF:', error);
                yPosition += 10;
            }
        }
        
        // Section: Personal Details
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Personal Details', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        addText('Full Name', fullName.value);
        addText('Email', email.value);
        addText('Mobile Number', mobileNumber.value);
        addText('Date of Birth', dateOfBirth.value);
        addText('Age', age.value);
        addText('Gender', gender);
        addText('Marital Status', maritalStatus);
        
        // Address (may need multiple lines)
        checkPageBreak(20);
        const addressLines = doc.splitTextToSize(`Address: ${address.value}`, 170);
        doc.text(addressLines, margin, yPosition);
        yPosition += (addressLines.length * lineHeight) + 5;
        
        // Section: Academic Details
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Academic Details', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        addText('College Name', collegeName.value);
        addText('Degree', degree.value);
        addText('Department', department.value);
        addText('Year of Passing', yearOfPassing.value);
        addText('Percentage / CGPA', percentage.value);
        
        // Section: Technical Skills
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Technical Skills', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const skillsText = selectedSkills.join(', ');
        const skillsLines = doc.splitTextToSize(`Skills: ${skillsText}`, 170);
        doc.text(skillsLines, margin, yPosition);
        yPosition += (skillsLines.length * lineHeight) + 5;
        
        // Section: Internship and Experience
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Internship and Experience', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        addText('Experience Level', experienceLevel.value);
        addText('Internship Company', internshipCompany.value || 'N/A');
        addText('Internship Duration', internshipDuration.value || 'N/A');
        addText('Internship Role', internshipRole.value || 'N/A');
        
        // Section: Project Details
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Project Details', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        addText('Project Title', projectTitle.value);
        addText('Technologies Used', technologiesUsed.value || 'N/A');
        
        // Project Description (may need multiple lines)
        checkPageBreak(30);
        const descLines = doc.splitTextToSize(`Project Description: ${projectDescription.value}`, 170);
        doc.text(descLines, margin, yPosition);
        
        // Generate filename
        const sanitizedName = fullName.value.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Student_Registration_${sanitizedName}.pdf`;
        
        // Save PDF
        doc.save(filename);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    } finally {
        // Re-enable button
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Download PDF';
    }
}

// ============================================
// Reset Form
// ============================================

/**
 * Handle form reset
 */
function handleReset() {
    // Stop camera if running
    stopCamera();
    
    // Reset form
    registrationForm.reset();
    
    // Clear photo
    removePhoto();
    
    // Clear all error messages
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    // Close modal
    resetModal.hide();
}
