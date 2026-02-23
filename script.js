document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navbar & Mobile Menu --- */
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks.querySelectorAll('a');

    // Sticky Nav on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-active');

        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');

        if (!isOpen) {
            // Opening: add reveal-items class with a tiny delay
            setTimeout(() => {
                navLinks.classList.add('reveal-items');
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            // Closing
            navLinks.classList.remove('reveal-items');
            document.body.style.overflow = 'auto';
        }
    });

    // Close Mobile Menu on Click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('mobile-active');
            document.body.style.overflow = 'auto';
        });
    });

    // Also close mobile menu when CTA is clicked
    const navCta = document.getElementById('nav-cta');
    if (navCta) {
        navCta.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* --- 2. Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 3. Hero Content Staggered Animation --- 
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const children = heroContent.children;
        Array.from(children).forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.15}s`;
        });

        // Trigger reveal for hero content explicitly if needed
        setTimeout(() => {
            heroContent.classList.add('active');
        }, 100);
    }

    /* --- 3. FAQ Accordion --- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* --- 4. Theme Toggle --- */
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* --- 5. Contact Form Simulation --- */
    const leadForm = document.getElementById('lead-form');
    const submitBtn = leadForm.querySelector('.submit-btn');
    const successMsg = document.getElementById('form-success');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Client-Side Validation is handled by HTML5 'required' attributes
        // Simulate network request
        submitBtn.classList.add('loading');

        setTimeout(() => {
            submitBtn.classList.remove('loading');

            // Hide all children of form EXCEPT the success message
            Array.from(leadForm.children).forEach(child => {
                if (child.id !== 'form-success') {
                    child.style.display = 'none';
                }
            });

            // Show Success Message
            successMsg.classList.remove('hidden');

        }, 1500); // Simulate 1.5s loading
    });

});
