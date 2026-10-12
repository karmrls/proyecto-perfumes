/* =========================================================
   L´Aura — Interacciones de la landing
   ========================================================= */
(() => {
    'use strict';

    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    /* =========================================
       1. TEXTO DIVIDIDO (letras y palabras)
    ========================================= */
    // Título principal letra por letra (el texto completo queda para lectores de pantalla)
    document.querySelectorAll('[data-split]').forEach((el) => {
        const text = el.textContent.trim();
        el.textContent = '';

        const label = document.createElement('span');
        label.className = 'sr-only';
        label.textContent = text;
        el.appendChild(label);

        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = char === ' ' ? ' ' : char;
            span.style.setProperty('--i', i);
            el.appendChild(span);
        });
    });

    // Títulos de sección palabra por palabra (respeta etiquetas como <em>)
    document.querySelectorAll('[data-split-words]').forEach((el) => {
        let index = 0;

        const wrapWord = (content) => {
            const word = document.createElement('span');
            const inner = document.createElement('span');
            word.className = 'word';
            inner.className = 'word-inner';
            inner.style.setProperty('--i', index++);
            inner.appendChild(content);
            word.appendChild(inner);
            return word;
        };

        [...el.childNodes].forEach((node) => {
            const fragment = document.createDocumentFragment();

            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent.split(/(\s+)/).forEach((part) => {
                    if (!part) return;
                    fragment.appendChild(/^\s+$/.test(part)
                        ? document.createTextNode(' ')
                        : wrapWord(document.createTextNode(part)));
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.textContent.trim().split(/\s+/).forEach((part, i) => {
                    if (i > 0) fragment.appendChild(document.createTextNode(' '));
                    const clone = node.cloneNode(false);
                    clone.textContent = part;
                    fragment.appendChild(wrapWord(clone));
                });
            }

            el.replaceChild(fragment, node);
        });
    });

    /* =========================================
       2. ANIMACIONES DE ENTRADA (SCROLL)
    ========================================= */
    const revealTargets = document.querySelectorAll('.reveal, [data-split], [data-split-words]');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));

    /* =========================================
       3. SECCIÓN ACTIVA: COLOR DE FONDO + NAVEGACIÓN
    ========================================= */
    const sections = document.querySelectorAll('section[data-aura]');
    const sectionLinks = document.querySelectorAll('.nav-link, .dot');
    let currentAura = root.dataset.aura;
    let hoverAura = null;

    // El aura de una familia (hover) tiene prioridad sobre la de la sección
    const applyAura = () => {
        root.dataset.aura = hoverAura || currentAura;
    };

    const setActiveSection = (section) => {
        currentAura = section.dataset.aura;
        applyAura();

        sectionLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${section.id}`;
            link.classList.toggle('is-active', isActive);
            if (isActive) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    };

    // Una franja en el centro de la pantalla decide qué sección está activa
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(entry.target);
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));

    // Familias olfativas: cada una tiñe el fondo al pasar el cursor
    document.querySelectorAll('[data-family]').forEach((family) => {
        family.addEventListener('mouseenter', () => {
            hoverAura = family.dataset.family;
            applyAura();
        });
        family.addEventListener('mouseleave', () => {
            hoverAura = null;
            applyAura();
        });
    });

    /* =========================================
       4. MENÚ MÓVIL
    ========================================= */
    const toggle = document.querySelector('.nav-toggle');
    const toggleLabel = toggle.querySelector('.sr-only');

    const setMenu = (open) => {
        root.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggleLabel.textContent = open ? 'Cerrar menú' : 'Abrir menú';
    };
    const closeMenu = () => setMenu(false);

    toggle.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
        if (e.matches) closeMenu();
    });

    /* =========================================
       5. SCROLL PROPIO (desplazamiento suave con inercia)
    ========================================= */
    const maxScroll = () => root.scrollHeight - window.innerHeight;

    const smoothScroll = (() => {
        // Sin animación si el usuario prefiere menos movimiento
        if (reduceMotion) {
            return { to: (y) => window.scrollTo(0, clamp(y, 0, maxScroll())) };
        }

        const EASE = 0.09; // Más bajo = más suave y lento
        let current = window.scrollY;
        let target = current;
        let frame = null;

        const tick = () => {
            current += (target - current) * EASE;
            if (Math.abs(target - current) < 0.5) current = target;
            window.scrollTo(0, current);
            frame = current === target ? null : requestAnimationFrame(tick);
        };

        const to = (y) => {
            if (!frame) current = window.scrollY;
            target = clamp(y, 0, maxScroll());
            if (!frame) frame = requestAnimationFrame(tick);
        };

        const stop = () => {
            if (!frame) return;
            cancelAnimationFrame(frame);
            frame = null;
            current = target = window.scrollY;
        };

        // Rueda del mouse / trackpad
        window.addEventListener('wheel', (e) => {
            if (e.ctrlKey || root.classList.contains('menu-open')) return; // zoom o menú abierto
            if (e.target.closest('textarea')) return; // el textarea conserva su propio scroll
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // gestos horizontales

            e.preventDefault();
            const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? window.innerHeight : 1;
            to((frame ? target : window.scrollY) + e.deltaY * unit);
        }, { passive: false });

        // Teclado, barra de scroll o touch: el navegador toma el control
        window.addEventListener('scroll', () => {
            if (!frame) current = target = window.scrollY;
        }, { passive: true });
        ['keydown', 'pointerdown', 'touchstart'].forEach((type) => {
            window.addEventListener(type, stop, { passive: true });
        });
        window.addEventListener('resize', () => {
            target = clamp(target, 0, maxScroll());
        });

        return { to };
    })();

    // Enlaces internos (#seccion) usan el scroll propio
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');

            // Enlaces pendientes de configurar (ej. "Cómo llegar" y redes sociales)
            if (hash === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(hash);
            if (!target) return;

            e.preventDefault();
            closeMenu();
            smoothScroll.to(target.getBoundingClientRect().top + window.scrollY);

            // Accesibilidad: mover el foco a la sección destino
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            history.replaceState(null, '', hash);
        });
    });

    /* =========================================
       6. PROGRESO, NAVBAR COMPACTA Y PARALLAX DEL HERO
    ========================================= */
    const header = document.querySelector('.site-header');
    const progressBar = document.querySelector('.scroll-progress span');
    const hero = document.querySelector('.hero');
    let ticking = false;

    const updateOnScroll = () => {
        const y = window.scrollY;
        const max = maxScroll();

        progressBar.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
        header.classList.toggle('is-scrolled', y > 40);
        if (!reduceMotion) hero.style.setProperty('--p', clamp(y / window.innerHeight, 0, 1).toFixed(3));

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateOnScroll);
    }, { passive: true });
    window.addEventListener('resize', updateOnScroll);
    updateOnScroll();

    /* =========================================
       7. MICROINTERACCIONES CON EL CURSOR
    ========================================= */
    if (finePointer && !reduceMotion) {
        // Halo de luz que sigue al cursor
        const aura = document.querySelector('.cursor-aura');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let auraX = mouseX;
        let auraY = mouseY;
        let auraFrame = null;

        const followCursor = () => {
            auraX += (mouseX - auraX) * 0.12;
            auraY += (mouseY - auraY) * 0.12;
            aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;

            const moving = Math.abs(mouseX - auraX) + Math.abs(mouseY - auraY) > 0.5;
            auraFrame = moving ? requestAnimationFrame(followCursor) : null;
        };

        window.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            mouseX = e.clientX;
            mouseY = e.clientY;
            aura.classList.add('is-active');
            if (!auraFrame) auraFrame = requestAnimationFrame(followCursor);
        }, { passive: true });

        root.addEventListener('mouseleave', () => aura.classList.remove('is-active'));

        // El halo crece sobre elementos interactivos
        document.addEventListener('pointerover', (e) => {
            aura.classList.toggle('is-hovering', Boolean(e.target.closest('a, button, .family, .branch')));
        });

        // Parallax del título y la botella según la posición del mouse
        hero.addEventListener('pointermove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            hero.style.setProperty('--mx', x.toFixed(3));
            hero.style.setProperty('--my', y.toFixed(3));
        });
        hero.addEventListener('pointerleave', () => {
            hero.style.setProperty('--mx', 0);
            hero.style.setProperty('--my', 0);
        });

        // Brillo de las sucursales que sigue al cursor
        document.querySelectorAll('.branch').forEach((branch) => {
            branch.addEventListener('pointermove', (e) => {
                const rect = branch.getBoundingClientRect();
                branch.style.setProperty('--x', `${e.clientX - rect.left}px`);
                branch.style.setProperty('--y', `${e.clientY - rect.top}px`);
            });
        });
    }

    /* =========================================
       8. FORMULARIO DE CONTACTO
    ========================================= */
    const form = document.querySelector('.contact-form');
    const formStatus = form.querySelector('.form-status');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let firstInvalid = null;
        form.querySelectorAll('input, textarea').forEach((field) => {
            const valid = field.value.trim() !== '' && field.checkValidity();
            field.closest('.field').classList.toggle('is-invalid', !valid);
            if (!valid && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) {
            formStatus.textContent = 'Por favor completa todos los campos con un correo válido.';
            firstInvalid.focus();
            return;
        }

        // TODO: conectar con un servicio de envío (backend propio, Formspree, EmailJS, etc.)
        const name = form.elements.nombre.value.trim();
        formStatus.textContent = `Gracias, ${name}. El envío de mensajes estará disponible muy pronto.`;
    });

    form.addEventListener('input', (e) => {
        const field = e.target.closest('.field');
        if (field && e.target.checkValidity()) field.classList.remove('is-invalid');
    });

    /* =========================================
       9. AÑO DEL FOOTER
    ========================================= */
    const year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
})();
