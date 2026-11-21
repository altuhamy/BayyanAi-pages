(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- Mobile menu ---------------- */
    var mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    var navLinks = document.querySelector('.nav-links');

    function setMenu(open) {
        if (!mobileMenuBtn || !navLinks) return;
        navLinks.classList.toggle('active', open);
        mobileMenuBtn.classList.toggle('active', open);
        mobileMenuBtn.setAttribute('aria-expanded', String(open));
        mobileMenuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            setMenu(!navLinks.classList.contains('active'));
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMenu(false);
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenu(false);
                mobileMenuBtn.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!navLinks.classList.contains('active')) return;
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                setMenu(false);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                setMenu(false);
            }
        });
    }

    /* ---------------- Smooth scroll for in-page anchors ---------------- */
    var navbar = document.querySelector('.navbar');

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            var offset = navbar ? navbar.offsetHeight : 0;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;
            window.scrollTo({
                top: top,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });

            if (history.replaceState) {
                history.replaceState(null, '', href);
            }
        });
    });

    /* ---------------- Navbar background on scroll ---------------- */
    if (navbar) {
        var ticking = false;
        function updateNavbar() {
            navbar.style.background = window.scrollY > 50
                ? 'rgba(15, 23, 42, 0.95)'
                : 'rgba(15, 23, 42, 0.85)';
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateNavbar);
            }
        }, { passive: true });
    }

    /* ---------------- Contact form ---------------- */
    var form = document.getElementById('contactForm');
    var statusEl = document.getElementById('formStatus');

    function fieldError(field, message) {
        clearFieldError(field);
        field.setAttribute('aria-invalid', 'true');
        var err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = message;
        field.parentNode.appendChild(err);
    }

    function clearFieldError(field) {
        field.removeAttribute('aria-invalid');
        var next = field.parentNode.querySelector('.field-error');
        if (next) next.remove();
    }

    function validate(form) {
        var invalid = [];
        form.querySelectorAll('[required]').forEach(function (field) {
            clearFieldError(field);
            if (!field.value.trim()) {
                fieldError(field, 'This field is required.');
                invalid.push(field);
                return;
            }
            if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) {
                fieldError(field, 'Please enter a valid email address.');
                invalid.push(field);
            }
        });
        return invalid;
    }

    if (form) {
        form.querySelectorAll('[required]').forEach(function (field) {
            field.addEventListener('input', function () {
                if (field.getAttribute('aria-invalid') === 'true') clearFieldError(field);
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (statusEl) {
                statusEl.textContent = '';
                statusEl.className = 'form-status';
            }

            var invalid = validate(form);
            if (invalid.length) {
                invalid[0].focus();
                if (statusEl) {
                    statusEl.textContent = 'Please fix the highlighted fields.';
                    statusEl.className = 'form-status error';
                }
                return;
            }

            var honeypot = form.querySelector('[name="website"]');
            if (honeypot && honeypot.value) return;

            var endpoint = form.getAttribute('action');
            var accessKey = form.querySelector('[name="access_key"]');
            if (!endpoint || endpoint === '#' ||
                !accessKey || accessKey.value.indexOf('REPLACE-WITH') !== -1) {
                // Zero-dependency fallback: prefill the visitor's mail client so
                // the form still works before Web3Forms is configured.
                function val(n) {
                    var el = form.querySelector('[name="' + n + '"]');
                    return el ? el.value.trim() : '';
                }
                var subject = 'Website enquiry' + (val('service') ? ' - ' + val('service') : '');
                var body = [
                    'Name: ' + val('name'),
                    'Email: ' + val('email'),
                    'Company: ' + val('company'),
                    'Service: ' + val('service'),
                    '',
                    val('message')
                ].join('\n');
                window.location.href = 'mailto:info@bayyanai.com?subject=' +
                    encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
                if (statusEl) {
                    statusEl.textContent = 'Your email app is opening with the message prefilled. If it does not open, email info@bayyanai.com directly.';
                    statusEl.className = 'form-status success';
                }
                return;
            }

            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            fetch(endpoint, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('Request failed: ' + res.status);
                    return res.json().catch(function () { return {}; });
                })
                .then(function () {
                    form.reset();
                    if (statusEl) {
                        statusEl.textContent = 'Thank you. Your message has been sent and we will reply within 24 hours.';
                        statusEl.className = 'form-status success';
                    }
                })
                .catch(function () {
                    if (statusEl) {
                        statusEl.innerHTML = 'Sorry, something went wrong. Please email us at ' +
                            '<a href="mailto:info@bayyanai.com">info@bayyanai.com</a>.';
                        statusEl.className = 'form-status error';
                    }
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                    }
                });
        });
    }

    /* ---------------- Reveal on scroll ---------------- */
    var revealSelector = '.service-card, .pricing-card, .testimonial-card, .process-step, .faq-item';

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll(revealSelector).forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    /* ---------------- Counter animation for stats ---------------- */
    function animateCounter(element, target, suffix) {
        var current = 0;
        var increment = target / 50;
        var timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    var heroStats = document.querySelector('.hero-stats');
    if (heroStats && !prefersReducedMotion && 'IntersectionObserver' in window) {
        var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number').forEach(function (stat) {
                        var text = stat.textContent;
                        if (text.indexOf('%') !== -1) {
                            animateCounter(stat, 40, '%');
                        } else if (text.indexOf('+') !== -1) {
                            animateCounter(stat, 50, '+');
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }
})();
