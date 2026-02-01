/**
 * FitTrack SPA Router - Ultra-fast navigation without page reloads
 * Optimized for mobile performance with instant section switching
 */

(function() {
    'use strict';

    // Cache DOM elements for performance
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link, [data-nav]');
    
    // Track current section
    let currentSection = 'home';

    /**
     * Navigate to a specific section instantly
     * @param {string} sectionId - The ID of the section to show
     */
    function navigateTo(sectionId) {
        // Prevent redundant navigation
        if (sectionId === currentSection) return;

        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;

            // Update active nav link
            updateActiveNavLink(sectionId);

            // Update URL hash without page jump
            history.pushState({ section: sectionId }, '', `#${sectionId}`);

            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Trigger section-specific initialization
            initializeSection(sectionId);
        }
    }

    /**
     * Update active class on navigation links
     * @param {string} sectionId - The active section ID
     */
    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-nav') || link.getAttribute('href').substring(1);
            if (linkSection === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Initialize section-specific functionality
     * @param {string} sectionId - The section being loaded
     */
    function initializeSection(sectionId) {
        switch(sectionId) {
            case 'steps':
                // Steps counter is always running, no need to reinitialize
                if (window.updateStepDisplay) {
                    window.updateStepDisplay();
                }
                break;
            case 'weekly':
                if (window.loadWeeklyData) {
                    window.loadWeeklyData();
                }
                break;
            case 'water':
                if (window.loadWaterData) {
                    window.loadWaterData();
                }
                break;
            case 'quotes':
                if (window.displayQuote) {
                    window.displayQuote();
                }
                break;
            case 'profile':
                if (window.loadUserProfile) {
                    window.loadUserProfile();
                }
                break;
            case 'progress':
                if (window.loadProgressData) {
                    window.loadProgressData();
                }
                break;
            case 'distance':
                if (window.loadDistanceData) {
                    window.loadDistanceData();
                }
                break;
            case 'home':
                if (window.updateDashboard) {
                    window.updateDashboard();
                }
                break;
        }
    }

    /**
     * Handle navigation click events
     */
    function handleNavClick(e) {
        const target = e.target.closest('[data-nav], .nav-link');
        if (!target) return;

        e.preventDefault();
        
        const sectionId = target.getAttribute('data-nav') || target.getAttribute('href').substring(1);
        navigateTo(sectionId);
    }

    /**
     * Handle browser back/forward buttons
     */
    function handlePopState(e) {
        const sectionId = e.state?.section || getHashSection() || 'home';
        navigateTo(sectionId);
    }

    /**
     * Get section from URL hash
     */
    function getHashSection() {
        const hash = window.location.hash.substring(1);
        return hash || 'home';
    }

    /**
     * Initialize router on page load
     */
    function initRouter() {
        // Add click listeners to all navigation elements
        document.addEventListener('click', handleNavClick);

        // Handle browser back/forward
        window.addEventListener('popstate', handlePopState);

        // Load initial section from URL hash
        const initialSection = getHashSection();
        navigateTo(initialSection);

        // Prevent hash jump on page load
        if (window.location.hash) {
            setTimeout(() => window.scrollTo(0, 0), 1);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRouter);
    } else {
        initRouter();
    }

    // Expose navigation function globally for programmatic navigation
    window.navigateTo = navigateTo;

})();
