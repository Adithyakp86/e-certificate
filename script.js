// DOM Elements
const templateUpload = document.getElementById('templateUpload');
const certificateCanvas = document.getElementById('certificateCanvas');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const ctx = certificateCanvas.getContext('2d');
const themeButton = document.getElementById('themeButton');

// Store the base template image
let baseImage = null;

// Theme Management
let currentTheme = 'light';
const themes = ['light', 'dark', 'gradient'];

// Event Listeners
templateUpload.addEventListener('change', handleTemplateUpload);
themeButton.addEventListener('click', toggleTheme);

// Handle Template Upload
function handleTemplateUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Check if it's an SVG file
    if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
        handleSVGUpload(file);
    } else {
        handleRasterUpload(file);
    }
}

// Handle SVG Upload
function handleSVGUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // For SVG, we'll convert it to a data URL that can be drawn on canvas
        const svgDataUrl = e.target.result;
        
        // Create image from SVG data
        const img = new Image();
        img.onload = function() {
            // Store the base image
            baseImage = img;
            
            // Set canvas dimensions to match image
            certificateCanvas.width = img.width;
            certificateCanvas.height = img.height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            
            // Show canvas and hide placeholder
            certificateCanvas.style.display = 'block';
            previewPlaceholder.style.display = 'none';
            
            // Save template data to localStorage
            saveTemplateData(svgDataUrl, img.width, img.height);
        };
        img.src = svgDataUrl;
    };
    reader.readAsDataURL(file);
}

// Handle Raster Image Upload (PNG, JPG)
function handleRasterUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Store the base image
            baseImage = img;
            
            // Set canvas dimensions to match image
            certificateCanvas.width = img.width;
            certificateCanvas.height = img.height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            
            // Show canvas and hide placeholder
            certificateCanvas.style.display = 'block';
            previewPlaceholder.style.display = 'none';
            
            // Save template data to localStorage
            saveTemplateData(e.target.result, img.width, img.height);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Save template data to localStorage
function saveTemplateData(dataUrl, width, height) {
    try {
        const templateData = {
            dataUrl: dataUrl,
            width: width,
            height: height,
            timestamp: Date.now()
        };
        localStorage.setItem('certificateTemplate', JSON.stringify(templateData));
        console.log('Template saved successfully');
    } catch (e) {
        console.error('Failed to save template:', e);
        alert('Unable to save template. The file might be too large.');
    }
}

// Toggle Theme
function toggleTheme() {
    // Get current theme index
    const currentIndex = themes.indexOf(currentTheme);
    
    // Calculate next theme index
    const nextIndex = (currentIndex + 1) % themes.length;
    
    // Set new theme
    currentTheme = themes[nextIndex];
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update button icon
    const icon = themeButton.querySelector('i');
    if (currentTheme === 'light') {
        icon.className = 'fas fa-moon';
    } else if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-star';
    }
    
    // Add animation effect
    themeButton.style.transform = 'rotate(30deg)';
    setTimeout(() => {
        themeButton.style.transform = 'rotate(0deg)';
    }, 300);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Add animation to hero section
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
});