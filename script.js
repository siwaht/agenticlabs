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
            setTimeout(() => {
                navLinks.classList.add('reveal-items');
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            navLinks.classList.remove('reveal-items');
            document.body.style.overflow = 'auto';
        }
    });

    // Close Mobile Menu on Click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('mobile-active');
            navLinks.classList.remove('reveal-items');
            document.body.style.overflow = 'auto';
        });
    });

    const navCta = document.getElementById('nav-cta');
    if (navCta) {
        navCta.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                navLinks.classList.remove('reveal-items');
                document.body.style.overflow = 'auto';
            });
        });
    }

    /* --- 2. Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealOnScroll.observe(el));

    /* --- 3. Hero Content Staggered Animation --- */
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        Array.from(heroContent.children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.15}s`;
        });
        setTimeout(() => heroContent.classList.add('active'), 100);
    }

    /* --- 4. Trust Bar Count-Up Animation --- */
    const trustValues = document.querySelectorAll('.trust-value');

    function animateValue(el, start, end, suffix, prefix, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(start + (end - start) * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const trustObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                trustValues.forEach(el => {
                    const text = el.textContent.trim();
                    if (text === '24/7') return; // skip non-numeric
                    if (text === '<2s') {
                        // Animate from <9s to <2s
                        let count = 9;
                        const interval = setInterval(() => {
                            count--;
                            el.textContent = '<' + count + 's';
                            if (count <= 2) clearInterval(interval);
                        }, 120);
                    } else if (text === '40%') {
                        animateValue(el, 0, 40, '%', '', 1200);
                    } else if (text === '1M+') {
                        animateValue(el, 0, 1, 'M+', '', 1000);
                    }
                });
                trustObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const trustBar = document.querySelector('.trust-bar');
    if (trustBar) trustObserver.observe(trustBar);

    /* --- 5. Stat Bar Width Animation on Scroll --- */
    const statBars = document.querySelectorAll('.stat-bar .fill');
    statBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { bar.style.width = targetWidth; }, 200);
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        barObserver.observe(bar);
    });

    /* --- 6. FAQ Accordion --- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* --- 7. Theme Toggle --- */
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

    /* --- 8. Contact Form Simulation --- */
    const leadForm = document.getElementById('lead-form');
    const submitBtn = leadForm.querySelector('.submit-btn');
    const successMsg = document.getElementById('form-success');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.classList.add('loading');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            Array.from(leadForm.children).forEach(child => {
                if (child.id !== 'form-success') child.style.display = 'none';
            });
            successMsg.classList.remove('hidden');
        }, 1500);
    });

    /* --- 9. Smooth Active Nav Highlight --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    const navHighlight = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" });

    sections.forEach(section => navHighlight.observe(section));

});
