// AWS Partner Live London 2025 - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLightbox();
    initSearch();
    initNavigation();
    initSmoothScrolling();
});

// Lightbox functionality
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    // Use event delegation to handle dynamically added images
    document.addEventListener('click', function(e) {
        const galleryItem = e.target.closest('.gallery-item');
        if (galleryItem) {
            e.preventDefault();
            const img = galleryItem.querySelector('img');
            const caption = galleryItem.querySelector('.caption');
            
            if (img && lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                
                // Update caption if exists
                const lightboxCaption = document.getElementById('lightbox-caption');
                if (lightboxCaption && caption) {
                    lightboxCaption.textContent = caption.textContent;
                }
                
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Search functionality
function initSearch() {
    const searchBox = document.getElementById('search-box');
    if (!searchBox) return;

    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const sessions = document.querySelectorAll('.session');
        
        sessions.forEach(session => {
            const sessionText = session.textContent.toLowerCase();
            const sessionTitle = session.querySelector('h2');
            
            if (searchTerm === '' || sessionText.includes(searchTerm)) {
                session.style.display = 'block';
                if (sessionTitle && searchTerm !== '') {
                    highlightText(sessionTitle, searchTerm);
                }
            } else {
                session.style.display = 'none';
            }
        });
        
        // Show/hide "no results" message
        const visibleSessions = Array.from(sessions).filter(s => s.style.display !== 'none');
        showNoResultsMessage(visibleSessions.length === 0 && searchTerm !== '');
    });
}

function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedText = text.replace(regex, '<mark>$1</mark>');
    element.innerHTML = highlightedText;
}

function showNoResultsMessage(show) {
    let noResults = document.getElementById('no-results');
    
    if (show && !noResults) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'no-results';
        noResults.innerHTML = '<p>No se encontraron resultados para tu búsqueda.</p>';
        noResults.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: #666;
            font-style: italic;
            background: #f9f9f9;
            border-radius: 8px;
            margin: 2rem 0;
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(noResults);
        }
    } else if (!show && noResults) {
        noResults.remove();
    }
}

// Navigation functionality
function initNavigation() {
    // Set active navigation based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Day navigation
    const dayNavLinks = document.querySelectorAll('.day-nav a');
    dayNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getImageTimestamp(filename) {
    // Extract timestamp from filename like IMG20251007091031.jpg
    const match = filename.match(/IMG(\d{8})(\d{6})/);
    if (match) {
        const dateStr = match[1]; // 20251007
        const timeStr = match[2]; // 091031
        
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = timeStr.substring(0, 2);
        const minute = timeStr.substring(2, 4);
        const second = timeStr.substring(4, 6);
        
        return new Date(year, month - 1, day, hour, minute, second);
    }
    return null;
}

// Image correlation helper
function correlateImagesWithSessions() {
    const sessions = document.querySelectorAll('.session');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    sessions.forEach(session => {
        const sessionTime = session.dataset.startTime;
        if (!sessionTime) return;
        
        const sessionStart = new Date(sessionTime);
        const sessionEnd = new Date(sessionStart.getTime() + 60 * 60 * 1000); // Assume 1 hour sessions
        
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;
            
            const filename = img.src.split('/').pop();
            const imgTime = getImageTimestamp(filename);
            
            if (imgTime && imgTime >= sessionStart && imgTime <= sessionEnd) {
                // This image belongs to this session
                const gallery = session.querySelector('.image-gallery .gallery-grid');
                if (gallery) {
                    gallery.appendChild(item.cloneNode(true));
                }
            }
        });
    });
}

// Initialize image correlation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all images are loaded
    setTimeout(correlateImagesWithSessions, 1000);
});

// Export functions for potential external use
window.AWSLondonDocs = {
    closeLightbox,
    formatTime,
    getImageTimestamp,
    correlateImagesWithSessions
};
