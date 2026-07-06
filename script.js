document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Sticky Navbar & Mobile Menu --- */
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navItems = navLinks.querySelectorAll('a');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    mobileBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-active');

        mobileBtn.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', !isOpen);
        navLinks.classList.toggle('mobile-active');

        if (!isOpen) {
            setTimeout(() => navLinks.classList.add('reveal-items'), 10);
            document.body.style.overflow = 'hidden';
        } else {
            navLinks.classList.remove('reveal-items');
            document.body.style.overflow = '';
        }
    });

    function closeMobileMenu() {
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('mobile-active', 'reveal-items');
        document.body.style.overflow = '';
    }

    navItems.forEach(item => item.addEventListener('click', closeMobileMenu));

    const navCta = document.getElementById('nav-cta');
    if (navCta) {
        navCta.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* Smooth scroll with offset for fixed navbar */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- 2. Scroll Reveal Animations --- */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
            const eased = 1 - Math.pow(1 - progress, 3);
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
                    if (text === '24/7') return;
                    if (text === '<2s') {
                        // Animate from 9 down to 2
                        let count = 9;
                        el.textContent = '<' + count + 's';
                        const interval = setInterval(() => {
                            count--;
                            if (count >= 2) {
                                el.textContent = '<' + count + 's';
                            }
                            if (count <= 2) clearInterval(interval);
                        }, 150);
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
    document.querySelectorAll('.stat-bar .fill').forEach(bar => {
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
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                question.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
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

    /* --- 8. Contact Form --- */
    const leadForm = document.getElementById('lead-form');
    const submitBtn = leadForm.querySelector('.submit-btn');
    const successMsg = document.getElementById('form-success');

    // Real-time validation
    const inputs = leadForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--accent-warm)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate required fields
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = 'var(--accent-warm)';
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Shake animation for invalid form
            leadForm.style.animation = 'none';
            leadForm.offsetHeight; // Trigger reflow
            leadForm.style.animation = 'shake 0.5s ease';
            return;
        }
        
        submitBtn.classList.add('loading');

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            companyName: document.getElementById('companyName').value,
            service: Array.from(document.querySelectorAll('input[name="service"]:checked')).map(cb => cb.value),
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value
        };

        fetch('https://hook.eu2.make.com/abf445xi1yny8139v7kmrv9vslqe7vli', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(() => {
            submitBtn.classList.remove('loading');
            Array.from(leadForm.children).forEach(child => {
                if (child.id !== 'form-success') child.style.display = 'none';
            });
            successMsg.classList.remove('hidden');
            // Announce success to screen readers
            successMsg.setAttribute('role', 'alert');
        })
        .catch(() => {
            submitBtn.classList.remove('loading');
            alert('Something went wrong. Please try again.');
        });
    });

    // Add shake animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    /* --- 9. Active Nav Highlight --- */
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    const navHighlight = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAll.forEach(link => {
                    link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => navHighlight.observe(section));

    /* --- 10. Neural Network Canvas Animation --- */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const connectionDistance = 120;
        let animId;

        function resizeCanvas() {
            const parent = canvas.parentElement;
            width = parent.clientWidth;
            height = parent.clientHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1.5;
                this.baseAlpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                const dx = this.x - width / 2;
                const dy = this.y - height / 2;
                const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                const maxRadius = (width / 2) - this.radius;

                if (distFromCenter > maxRadius) {
                    this.vx -= dx * 0.0015;
                    this.vy -= dy * 0.0015;
                }

                if (Math.random() < 0.01) {
                    this.vx += (Math.random() - 0.5) * 0.5;
                    this.vy += (Math.random() - 0.5) * 0.5;
                }

                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 2) {
                    this.vx = (this.vx / speed) * 2;
                    this.vy = (this.vy / speed) * 2;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(14, 165, 165, ${this.baseAlpha})`;
                ctx.fill();
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(14, 165, 165, 0.8)';
            }
        }

        function initParticles() {
            particles = [];
            const numParticles = window.innerWidth < 768 ? 35 : 70;
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            ctx.shadowBlur = 0;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - (distance / connectionDistance)) * 0.4;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(14, 165, 165, ${opacity})`;
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            animId = requestAnimationFrame(animateCanvas);
        }

        // Pause canvas when not visible for performance
        const canvasObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animId) animateCanvas();
                } else {
                    if (animId) { cancelAnimationFrame(animId); animId = null; }
                }
            });
        }, { threshold: 0 });

        setTimeout(() => {
            resizeCanvas();
            initParticles();
            canvasObserver.observe(canvas);
        }, 100);
    }

    /* --- 12. Subtle Parallax on Scroll --- */
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = document.querySelector('.hero').offsetHeight;
                    if (scrolled < heroHeight) {
                        const parallax = scrolled * 0.15;
                        heroVisual.style.transform = `translateY(${parallax}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* --- 11. Legal Modals --- */
    const closeBtns = document.querySelectorAll('.close-modal');

    document.querySelectorAll('.legal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById(`modal-${link.getAttribute('data-modal')}`);
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                modal.querySelector('.close-modal').focus();
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            });
            // Also close mobile menu
            if (navLinks.classList.contains('mobile-active')) {
                closeMobileMenu();
            }
        }
    });

});
