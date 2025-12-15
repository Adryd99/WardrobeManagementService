// JS minimale: brochure placeholder + validazione leggera form + anno dinamico.
(function () {
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    const brochureBtn = document.getElementById('btn-brochure');
    if (brochureBtn) {
        brochureBtn.addEventListener('click', () => {
            // Placeholder: sostituisci con un link reale a PDF.
            const blob = new Blob(
                [
                    "Corporate Wardrobe Care — Brochure (placeholder)\n\n" +
                    "Sostituisci questo file con un PDF reale o collega un asset.\n" +
                    "Sezioni suggerite:\n" +
                    "- Panoramica programma\n- Come funziona\n- Modello economico\n- Requisiti operativi\n- FAQ\n"
                ],
                {type: "text/plain;charset=utf-8"}
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Corporate-Wardrobe-Care-brochure-placeholder.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
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
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            setStatus("");

            // Validazione HTML5
            if (!form.checkValidity()) {
                setStatus("Controlla i campi obbligatori evidenziati.", "info");
                focusFirstInvalid(form);
                return;
            }

            // Simulazione invio: integra qui un endpoint (es. /api/lead) quando disponibile.
            const data = Object.fromEntries(new FormData(form).entries());

            // Esempio: log per sviluppo
            console.log("Lead submission (placeholder):", data);

            form.reset();
            setStatus("Richiesta inviata. Ti contatteremo a breve.", "ok");
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
})();
