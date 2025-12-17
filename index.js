// JS minimale: brochure placeholder + validazione leggera form + anno dinamico.
(function () {
    // =========================
    // EmailJS init (SDK caricato via CDN in index.html)
    // =========================
    const EMAILJS_PUBLIC_KEY = "R_kC4pUewQbreY62b";
    const EMAILJS_SERVICE_ID = "service_qt34cge";
    const EMAILJS_TEMPLATE_ID = "template_gkfklx2";

    function initEmailJS() {
        if (window.emailjs && typeof window.emailjs.init === 'function') {
            try { window.emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { /* no-op */ }
        }
    }
    // Prova inizializzazione immediata; se lo script non è ancora pronto, riprova al DOMContentLoaded
    initEmailJS();

    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    const brochureBtn = document.getElementById('btn-brochure');
    if (brochureBtn) {
        brochureBtn.addEventListener('click', () => {
            // Apri la brochure trifold in una nuova scheda; l'utente può stamparla/esportarla in PDF
            window.open('./brochure.html', '_blank', 'noopener');
        });
    }

    const form = document.getElementById('lead-form');
    const status = document.getElementById('form-status');

    function setStatus(msg, type) {
        if (!status) return;
        status.textContent = msg || "";
        status.style.color = type === "ok" ? "rgba(34,197,94,0.92)" : "rgba(255,255,255,0.72)";
    }

    function focusFirstInvalid(formEl) {
        const firstInvalid = formEl.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus({preventScroll: false});
        return firstInvalid;
    }

    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            setStatus("");

            // Validazione HTML5
            if (!form.checkValidity()) {
                setStatus("Controlla i campi obbligatori evidenziati.", "info");
                focusFirstInvalid(form);
                return;
            }

            // Raccogli dati dal form
            const data = Object.fromEntries(new FormData(form).entries());

            // Mappa parametri per EmailJS (adatta i nomi a quelli del tuo template, se diversi)
            const templateParams = {
                name: data.name || "",
                email: data.email || "",
                company: data.company || "",
                employees: data.employees || "",
                message: data.message || "",
                reply_to: data.email || "",
                subject: "Richiesta demo/pilota dal sito"
            };

            // Disabilita UI durante l'invio
            submitBtn && (submitBtn.disabled = true);
            submitBtn && submitBtn.classList.add('is-loading');
            setStatus("Invio in corso...", "info");

            // Assicurati che EmailJS sia inizializzato
            initEmailJS();

            if (!(window.emailjs && typeof window.emailjs.send === 'function')) {
                setStatus("Errore di configurazione invio. Riprova tra poco.");
                submitBtn && (submitBtn.disabled = false);
                submitBtn && submitBtn.classList.remove('is-loading');
                return;
            }

            try {
                await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                form.reset();
                setStatus("Richiesta inviata. Ti contatteremo a breve.", "ok");
            } catch (err) {
                console.error("EmailJS error:", err);
                setStatus("Si è verificato un errore durante l'invio. Riprova.");
            } finally {
                submitBtn && (submitBtn.disabled = false);
                submitBtn && submitBtn.classList.remove('is-loading');
            }
        });
    }

    // =========================
    // Modal Privacy (apertura da link "Privacy")
    // =========================
    const modal = document.getElementById('privacy-modal');
    const body = document.body;
    let lastFocus = null;

    function openPrivacyModal(triggerEl) {
        if (!modal) return;
        lastFocus = triggerEl || document.activeElement;
        modal.hidden = false;
        body.classList.add('modal-open');
        // Porta il focus sul titolo del modal per lettori di schermo
        const title = modal.querySelector('#privacy-title');
        if (title) title.setAttribute('tabindex', '-1');
        (title || modal).focus({preventScroll: true});
        // Avvia trap del focus
        document.addEventListener('keydown', onKeyDown);
        modal.addEventListener('keydown', trapFocus);
    }

    function closePrivacyModal() {
        if (!modal) return;
        modal.hidden = true;
        body.classList.remove('modal-open');
        document.removeEventListener('keydown', onKeyDown);
        modal.removeEventListener('keydown', trapFocus);
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus({preventScroll: true});
        }
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closePrivacyModal();
        }
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusable = modal.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.prototype.filter.call(focusable, el => el.offsetParent !== null);
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    if (modal) {
        // Apri da tutti i link che puntano a #privacy
        const privacyLinks = document.querySelectorAll('a[href="#privacy"]');
        privacyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openPrivacyModal(e.currentTarget);
            });
        });

        // Chiusura con overlay o bottone con data-close
        modal.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.hasAttribute('data-close')) {
                e.preventDefault();
                closePrivacyModal();
            }
        });
    }

    // =========================
    // Modal Terms (apertura da link "Terms")
    // =========================
    const termsModal = document.getElementById('terms-modal');
    let termsKeydownHandler = null;

    function openTermsModal(triggerEl) {
        if (!termsModal) return;
        lastFocus = triggerEl || document.activeElement;
        termsModal.hidden = false;
        body.classList.add('modal-open');
        const title = termsModal.querySelector('#terms-title');
        if (title) title.setAttribute('tabindex', '-1');
        (title || termsModal).focus({preventScroll: true});
        // Esc handler dedicato
        termsKeydownHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeTermsModal();
            }
        };
        document.addEventListener('keydown', termsKeydownHandler);
        termsModal.addEventListener('keydown', trapFocusTerms);
    }

    function closeTermsModal() {
        if (!termsModal) return;
        termsModal.hidden = true;
        body.classList.remove('modal-open');
        if (termsKeydownHandler) document.removeEventListener('keydown', termsKeydownHandler);
        termsModal.removeEventListener('keydown', trapFocusTerms);
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus({preventScroll: true});
        }
    }

    function trapFocusTerms(e) {
        if (e.key !== 'Tab') return;
        const focusable = termsModal.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.prototype.filter.call(focusable, el => el.offsetParent !== null);
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    if (termsModal) {
        const termsLinks = document.querySelectorAll('a[href="#terms"]');
        termsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openTermsModal(e.currentTarget);
            });
        });

        termsModal.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.hasAttribute('data-close')) {
                e.preventDefault();
                closeTermsModal();
            }
        });
    }

    // =========================
    // Menu mobile (hamburger)
    // =========================
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.getElementById('main-sections');
    function closeMenu() {
        if (!navToggle || !navLinks) return;
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
        // Aggiorna visibilità FAB quando il menu si chiude
        if (typeof updateFabVisibility === 'function') {
            updateFabVisibility();
        }
    }
    function openMenu() {
        if (!navToggle || !navLinks) return;
        navLinks.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');
        // Nascondi immediatamente il FAB quando il menu si apre
        const fabNow = document.querySelector('.fab.fab-call');
        if (fabNow) fabNow.classList.add('is-hidden');
    }
    function toggleMenu() {
        if (!navToggle || !navLinks) return;
        const isOpen = navLinks.classList.contains('is-open');
        if (isOpen) closeMenu(); else openMenu();
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', toggleMenu);
        // Chiudi su click di un link di sezione
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => closeMenu());
        });
        // Chiudi con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        // Chiudi se si ridimensiona oltre il breakpoint desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 820) closeMenu();
        });
    }

    // =========================
    // FAQ: accordion accessibile
    // =========================
    (function initFaqAccordion() {
        const container = document.querySelector('.accordion');
        if (!container) return;
        const buttons = container.querySelectorAll('.accordion__button');
        const panels = container.querySelectorAll('.accordion__panel');

        function closeAll(exceptId) {
            buttons.forEach(btn => {
                const controls = btn.getAttribute('aria-controls');
                if (controls !== exceptId) {
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
            panels.forEach(p => {
                if (p.id !== exceptId) p.hidden = true;
            });
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const panelId = btn.getAttribute('aria-controls');
                if (!panelId) return;
                const panel = document.getElementById(panelId);
                if (!panel) return;
                const isOpen = btn.getAttribute('aria-expanded') === 'true';
                if (isOpen) {
                    btn.setAttribute('aria-expanded', 'false');
                    panel.hidden = true;
                } else {
                    // One-open: chiudi gli altri
                    closeAll(panelId);
                    btn.setAttribute('aria-expanded', 'true');
                    panel.hidden = false;
                }
            });
        });
    })();

    // =========================
    // FAB “Prenota una call”: visibile solo quando l'hero NON è visibile (mobile)
    // =========================
    const fab = document.querySelector('.fab.fab-call');
    const hero = document.querySelector('.hero');

    function isMobileViewport() {
        return window.innerWidth < 820;
    }

    function isHeroInView() {
        if (!hero) return false;
        const rect = hero.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    }

    function setFabVisible(shouldShow) {
        if (!fab) return;
        if (shouldShow) fab.classList.remove('is-hidden');
        else fab.classList.add('is-hidden');
    }

    function computeBlocked() {
        return body.classList.contains('modal-open') || body.classList.contains('menu-open');
    }

    function updateFabVisibility(heroVisibleParam) {
        if (!fab) return;
        if (!isMobileViewport()) { setFabVisible(false); return; }
        const heroVisible = (typeof heroVisibleParam === 'boolean') ? heroVisibleParam : isHeroInView();
        const blocked = computeBlocked();
        setFabVisible(!heroVisible && !blocked);
    }

    // IntersectionObserver per rilevare visibilità della hero
    if ('IntersectionObserver' in window && hero && fab) {
        const io = new IntersectionObserver((entries) => {
            const entry = entries[0];
            const visible = !!(entry && (entry.isIntersecting || entry.intersectionRatio > 0));
            updateFabVisibility(visible);
        }, { root: null, threshold: [0, 0.1, 0.15] });
        io.observe(hero);
    }

    // Fallback + aggiornamenti su eventi comuni
    ['scroll', 'resize', 'orientationchange'].forEach(evt => {
        window.addEventListener(evt, () => updateFabVisibility());
    });

    // Aggiorna all'avvio
    updateFabVisibility();
})();
