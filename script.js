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
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('mobile-active');
        document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : 'auto';
    });

    // Close Mobile Menu on Click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('mobile-active');
            document.body.style.overflow = 'auto';
        });
    });

    /* --- 2. Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
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

    /* --- 4. Contact Form Simulation --- */
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
                if(child.id !== 'form-success') {
                    child.style.display = 'none';
                }
            });
            
            // Show Success Message
            successMsg.classList.remove('hidden');
            
        }, 1500); // Simulate 1.5s loading
    });

});
