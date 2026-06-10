# Corporate Wardrobe Care — Landing Page

Questa è la landing page ufficiale di **Corporate Wardrobe Care**, un servizio di benefit aziendale dedicato alla gestione ricorrente del guardaroba per dipendenti con dress code formale o semi-formale.

Il progetto include il sito web principale, un form di contatto integrato e una brochure digitale stampabile.

## 🚀 Funzionalità

- **Landing Page Professionale**: Design pulito, moderno e responsive, ottimizzato per conversioni B2B.
- **Lead Generation**: Form di contatto integrato con **EmailJS** per l'invio diretto delle richieste demo senza necessità di un backend dedicato.
- **Brochure Trifold**: Una pagina dedicata (`brochure.html`) progettata per essere stampata o esportata in PDF come brochure pieghevole a tre ante.
- **Componenti Accessibili**:
    - Menu mobile (hamburger) con gestione del focus.
    - Accordion FAQ accessibile.
    - Modal per Privacy Policy e Termini d'uso con trap del focus per la navigazione da tastiera.
- **Floating Action Button (FAB)**: Pulsante dinamico su mobile per facilitare la prenotazione di call.

## 🛠️ Tecnologie Utilizzate

- **HTML5**: Struttura semantica e accessibile.
- **CSS3**: Layout custom (Flexbox e Grid), variabili CSS per una facile manutenzione.
- **JavaScript (Vanilla)**: Logica di interazione minima e leggera (senza framework pesanti).
- **EmailJS SDK**: Integrazione per l'invio di email lato client.

## 📂 Struttura del Progetto

- `index.html`: Pagina principale del servizio.
- `index.js`: Logica client-side (form, modal, FAQ, FAB).
- `brochure.html`: Layout della brochure stampabile.
- `style/`:
    - `css.css`: Stili principali del sito.
    - `trifold.css`: Stili specifici per la brochure a tre ante.
- `img/`: Risorse grafiche e logo.

## ⚙️ Configurazione EmailJS

Per attivare il form di contatto, sono necessarie le chiavi di EmailJS presenti in `index.js`:

```javascript
const EMAILJS_PUBLIC_KEY = "";
const EMAILJS_SERVICE_ID = "";
const EMAILJS_TEMPLATE_ID = "";
```

Assicurati che il template su EmailJS corrisponda ai campi del form (`name`, `email`, `company`, `employees`, `message`).

## 📦 Installazione e Uso

Il progetto è statico e può essere servito da qualsiasi web server o piattaforma di hosting statico (GitHub Pages, Vercel, Netlify).

1. Clona la repository.
2. Apri `index.html` nel browser per visualizzare il sito.
3. Per la brochure, clicca sul pulsante "Scarica la brochure" o apri direttamente `brochure.html`.

---
© 2025 Corporate Wardrobe Care. Tutti i diritti riservati.
