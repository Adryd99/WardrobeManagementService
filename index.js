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
})();
