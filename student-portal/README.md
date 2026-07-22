# Student Login and Registration Portal

A complete, responsive student login and registration website built with HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript. Features include webcam integration, form validation, PDF generation, and session management without any backend.

## 📋 Features

### Login Page
- Modern, responsive full-screen design
- Email and password validation
- Show/hide password functionality
- Demo credentials for testing
- Session management using sessionStorage
- Protected route for registration page

### Registration Page
- **Student Photo Section**
  - Live webcam preview with start/stop controls
  - Photo capture from camera
  - Photo upload from device
  - Photo removal functionality
  - Automatic photo display in PDF

- **Personal Details**
  - Full name, email, mobile number
  - Date of birth with automatic age calculation
  - Gender and marital status selection
  - Address field

- **Academic Details**
  - College name, degree (dropdown)
  - Department, year of passing (dropdown)
  - Percentage/CGPA

- **Technical Skills**
  - Multiple skill selection with checkboxes
  - At least one skill required

- **Internship and Experience**
  - Experience level dropdown
  - Internship company, duration, and role

- **Project Details**
  - Project title, technologies used
  - Project description (textarea)

- **Additional Features**
  - Preview all details in modal
  - Submit registration with success modal
  - Download professional PDF with all details
  - Reset form with confirmation
  - Logout with session cleanup

## 📁 Project Structure

```
student-portal/
│
├── login.html              # Student login page
├── registration.html       # Student registration form
├── style.css               # Custom styling
├── login.js                # Login validation and session management
├── registration.js         # Registration logic, camera, PDF generation
└── README.md               # This file
```

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- For webcam testing: localhost or HTTPS connection

### Method 1: Using VS Code Live Server (Recommended)

1. **Install VS Code** if not already installed
   - Download from: https://code.visualstudio.com/

2. **Install Live Server Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install the extension by Ritwick Dey

3. **Open the Project**
   - Open VS Code
   - File → Open Folder
   - Select the `student-portal` folder

4. **Start Live Server**
   - Right-click on `login.html`
   - Select "Open with Live Server"
   - The browser will open automatically at `http://127.0.0.1:5500/login.html`

### Method 2: Using Python Simple HTTP Server

1. **Open Command Prompt/Terminal**
   - Navigate to the project directory:
   ```bash
   cd C:\Users\Admin\CascadeProjects\student-portal
   ```

2. **Start the Server**
   ```bash
   python -m http.server 8000
   ```

3. **Open in Browser**
   - Open your browser
   - Go to: `http://localhost:8000/login.html`

### Method 3: Direct File Opening (Limited Functionality)

1. Navigate to the project folder
2. Double-click `login.html`
3. **Note:** Webcam will NOT work with this method due to browser security restrictions

## 🧪 Testing Instructions

### Login Testing

1. **Open the Login Page**
   - Navigate to `http://localhost:8000/login.html` (or your Live Server URL)

2. **Test Invalid Login**
   - Enter any email/password
   - Click Login
   - Expected: Error modal "Invalid email or password"

3. **Test Validation**
   - Leave email empty → Error: "Please enter a valid email address"
   - Enter invalid email format → Error: "Please enter a valid email address"
   - Leave password empty → Error: "Password must be at least 6 characters"
   - Enter password < 6 characters → Error: "Password must be at least 6 characters"

4. **Test Successful Login**
   - Email: `student@gmail.com`
   - Password: `student123`
   - Click Login
   - Expected: Success modal "Login Successful!"
   - Click Continue → Redirects to registration page

5. **Test Show/Hide Password**
   - Click the eye icon or checkbox
   - Verify password visibility toggles

6. **Test Clear Button**
   - Fill in the form
   - Click Clear
   - Expected: All fields cleared

### Registration Page Testing

1. **Test Direct Access Protection**
   - Close browser
   - Open `registration.html` directly without logging in
   - Expected: Redirects to `login.html`

2. **Test Webcam Functionality**
   - Click "Start Camera"
   - Allow camera permission when prompted
   - Expected: Live video appears in Camera Preview box
   - Click "Capture Photo"
   - Expected: Photo appears in Student Photo box
   - Click "Stop Camera"
   - Expected: Video stops, placeholder appears

3. **Test Photo Upload**
   - Click "Upload Photo"
   - Select an image file
   - Expected: Image appears in Student Photo box
   - Upload a different image
   - Expected: Previous image replaced

4. **Test Photo Removal**
   - Click "Remove Photo"
   - Expected: Photo cleared, "No photo selected" message appears

5. **Test Form Validation**
   - Try to submit without filling fields
   - Expected: Error messages appear below each field
   - Full Name: Enter only numbers → Error
   - Email: Invalid format → Error
   - Mobile: Invalid format → Error
   - Date of Birth: Future date → Error
   - Gender: Not selected → Error
   - Skills: None selected → Error
   - Photo: Not uploaded → Error
   - Declaration: Not checked → Error

6. **Test Age Calculation**
   - Select a date of birth
   - Expected: Age automatically calculated and displayed

7. **Test Preview Details**
   - Fill all required fields
   - Upload or capture a photo
   - Click "Preview Details"
   - Expected: Modal shows all entered information including photo

8. **Test Submit Registration**
   - Fill all required fields
   - Upload or capture a photo
   - Check declaration checkbox
   - Click "Submit Registration"
   - Expected: Success modal "Registration Completed Successfully!"
   - Form should NOT be cleared

9. **Test PDF Download**
   - Fill all required fields
   - Upload or capture a photo
   - Click "Download PDF"
   - Expected: PDF downloads with filename `Student_Registration_FullName.pdf`
   - Open PDF and verify:
     - Student photo is included
     - All personal details are present
     - Academic details are present
     - Technical skills are listed
     - Project details are included
     - Registration date is shown

10. **Test Reset Form**
    - Fill the form with data
    - Click "Reset Form"
    - Expected: Confirmation modal appears
    - Click Reset
    - Expected: All fields cleared, photo removed, camera stopped

11. **Test Logout**
    - Click "Logout" (navbar or button)
    - Expected: Confirmation modal appears
    - Click Logout
    - Expected: Redirects to `login.html`
    - Try to access `registration.html` directly
    - Expected: Redirects to `login.html`

## 🔒 Security Notes

### Camera Access Requirements
The webcam feature requires a secure context:
- **Works on:** `localhost`, `127.0.0.1`, or HTTPS websites
- **Does NOT work on:** Direct file opening (`file://` protocol)

### Session Management
- Uses `sessionStorage` for login state
- Session is cleared when browser tab is closed
- No real passwords are stored (demo credentials only)

### Important Security Warnings
- This is a **frontend-only demo** with no backend
- Do NOT use for production without proper backend
- Demo credentials are hardcoded for testing only
- No real data persistence or security measures

## 📝 Demo Credentials

```
Email: student@gmail.com
Password: student123
```

## 🛠️ Technologies Used

- **HTML5** - Structure and markup
- **CSS3** - Styling and responsive design
- **Bootstrap 5.3.2** - UI framework and components
- **Bootstrap Icons 1.11.1** - Icon library
- **Vanilla JavaScript** - All functionality
- **jsPDF 2.5.1** - PDF generation

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920x1080 and above)
- Laptop (1366x768 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

### Responsive Features
- Camera and photo boxes: Side-by-side on desktop, stacked on mobile
- Navbar: Collapsible menu on mobile
- Form fields: Full width on mobile
- Buttons: Stacked on mobile, inline on desktop
- Skills grid: Adapts to screen size

## 🐛 Troubleshooting

### Camera Not Working
- **Issue:** Camera permission denied
  - **Solution:** Allow camera access in browser settings
- **Issue:** Camera not available
  - **Solution:** Ensure your device has a working camera
- **Issue:** "Camera access is only available on HTTPS or localhost"
  - **Solution:** Use Live Server or Python HTTP server (not direct file opening)

### PDF Not Downloading
- **Issue:** PDF generation fails
  - **Solution:** Ensure all required fields are filled
- **Issue:** Photo not appearing in PDF
  - **Solution:** Ensure photo is uploaded or captured before downloading

### Validation Errors
- **Issue:** Form won't submit
  - **Solution:** Check all required fields are filled correctly
- **Issue:** Error messages not clearing
  - **Solution:** Correct the field value, error should clear automatically

### Session Issues
- **Issue:** Redirected to login page immediately
  - **Solution:** Log in again with demo credentials
- **Issue:** Can access registration without login
  - **Solution:** Clear browser cache and try again

## 📄 License

This project is created for educational purposes. Feel free to use and modify as needed.

## 👤 Author

Created as a demonstration of frontend web development skills using HTML, CSS, Bootstrap, and JavaScript.

## 🙏 Acknowledgments

- Bootstrap for the excellent UI framework
- jsPDF for PDF generation library
- Bootstrap Icons for the icon set
