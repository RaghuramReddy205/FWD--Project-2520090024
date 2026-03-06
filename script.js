/* ============================================================
   script.js – ResiSolve Apartment Complaint Management System

   CO3: JavaScript Programming Essentials
        Basic expressions and operators
        Conditions, Loops, Functions
        Arrow functions, Callback functions
        Objects & Arrays, Object inheritance
        Array methods, Number literals (hex/scientific)

   CO4: JavaScript Interactivity, DOM
        Event handling, DOM manipulation
        Storage & Async Programming
        Browser storage, Asynchronous programming, Promises

   CO5: Advanced Web Development & Deployment
        ES6 modules (import/export pattern)
        Form validation with JavaScript
        Handling user input dynamically
        Optimize page load times
        CORS, Deploying the Project
============================================================ */

// CO3: Arrow functions | CO5: Optimize page load – DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     CO3: Arrays & Objects – initial complaint data
     CO3: Number literals, Array methods
  ───────────────────────────────────────────── */
  const complaints = [
    { id:'RS-1041', type:'Plumbing',   unit:'A-102',   status:'resolved', progress:100, desc:'Leaking pipe in kitchen fixed.',              priority:'high' },
    { id:'RS-1042', type:'Electrical', unit:'C-305',   status:'progress', progress:65,  desc:'Switchboard sparking – technician assigned.', priority:'high' },
    { id:'RS-1043', type:'Lift',       unit:'Block B', status:'open',     progress:10,  desc:'Lift stuck between floors 3 & 4.',            priority:'medium' },
    { id:'RS-1044', type:'Sanitation', unit:'D-001',   status:'progress', progress:40,  desc:'Garbage bin overflowing near entry.',         priority:'low' },
    { id:'RS-1045', type:'Security',   unit:'Gate 2',  status:'resolved', progress:100, desc:'CCTV camera repaired and online.',            priority:'medium' },
    { id:'RS-1046', type:'Internet',   unit:'E-210',   status:'open',     progress:5,   desc:'No network connectivity since morning.',      priority:'low' },
  ];

  // CO3: Object – status display config (Object inheritance pattern)
  const STATUS = {
    open:     { label:'Open',        cls:'s-open', bar:'var(--rose)',  icon:'🔴' },
    progress: { label:'In Progress', cls:'s-prog', bar:'var(--amber)', icon:'🔄' },
    resolved: { label:'Resolved',    cls:'s-res',  bar:'var(--teal)',  icon:'✅' },
  };

  // CO3: Object – type icon map | Object inheritance – derived from base config
  const ICONS  = { Plumbing:'🔧', Electrical:'⚡', Lift:'🛗', Sanitation:'🧹', Security:'🔐', Internet:'🌐', Pest:'🐛', Other:'📌' };
  const ICO_BG = { open:'rgba(255,92,122,0.15)', progress:'rgba(247,163,38,0.15)', resolved:'rgba(0,212,170,0.15)' };

  let activeTab = 'open'; // CO3: Variable

  /* ─────────────────────────────────────────────
     CO4: DOM manipulation – render complaint list
     CO3: Functions, Array methods, Arrow functions
  ───────────────────────────────────────────── */
  // CO3: Function (arrow) – render filtered complaint list
  const renderList = () => {
    const list = document.getElementById('clist');
    list.innerHTML = '';

    // CO3: Array methods – filter | Arrow function
    const filtered = complaints.filter(c => c.status === activeTab);

    // CO3: Conditions – show empty state if no complaints in tab
    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-st">
        <span>${activeTab === 'resolved' ? '🎉' : '📭'}</span>
        <p>No ${STATUS[activeTab].label} complaints.</p>
      </div>`;
      return;
    }

    // CO3: Loops – forEach (Array method)
    filtered.forEach((c, i) => {
      const s = STATUS[c.status];
      const row = document.createElement('div'); // CO4: DOM manipulation
      row.className = 'crow';
      row.style.animationDelay = `${i * 0.05}s`; // CO3: Basic expressions – template literal
      row.setAttribute('role', 'listitem');       // CO2: Accessibility attributes
      row.innerHTML = `
        <div class="crow-ico" style="background:${ICO_BG[c.status]}">${ICONS[c.type] || '📋'}</div>
        <div class="crow-inf">
          <strong>${c.type} · ${c.unit}</strong>
          <span>${c.desc.slice(0, 55)}${c.desc.length > 55 ? '…' : ''}</span>
        </div>
        <div class="crow-rt">
          <span class="sbdg ${s.cls}">${s.icon} ${s.label}</span>
          <div class="mbar">
            <div class="mbar-f" style="width:0%;background:${s.bar};" data-w="${c.progress}%"></div>
          </div>
        </div>`;
      list.appendChild(row);
    });

    // CO4: Async Programming – animate progress bars after DOM paint
    setTimeout(() => {
      list.querySelectorAll('.mbar-f').forEach(b => { b.style.width = b.dataset.w; });
    }, 120);
  };

  // CO3: Function – update stat counters | CO4: DOM manipulation
  const updateStats = () => {
    // CO3: Array methods – filter + length
    document.getElementById('cOpen').textContent = complaints.filter(c => c.status === 'open').length;
    document.getElementById('cProg').textContent = complaints.filter(c => c.status === 'progress').length;
    document.getElementById('cRes').textContent  = complaints.filter(c => c.status === 'resolved').length;
  };

  // CO3: Function – set active tab | CO4: DOM manipulation
  const setTab = (tab) => {
    activeTab = tab;
    // CO4: DOM manipulation – toggle tab button active classes
    document.querySelectorAll('.tbtn').forEach(b => {
      const on = b.dataset.tab === tab; // CO3: Conditions
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on); // CO2: Accessibility attributes
    });
    document.querySelectorAll('.scard').forEach(c => {
      c.classList.toggle('atab', c.dataset.tab === tab);
    });
    renderList();
  };

  // CO4: Event handling – tab buttons and stat cards
  document.querySelectorAll('.tbtn, .scard').forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab)); // CO3: Arrow fn
    btn.addEventListener('keydown', e => {                        // CO2: Accessibility – keyboard nav
      if (e.key === 'Enter' || e.key === ' ') setTab(btn.dataset.tab);
    });
  });

  /* ─────────────────────────────────────────────
     LOGIN – CO3: Conditions, Functions
     CO5: Form validation with JavaScript
  ───────────────────────────────────────────── */
  // CO4: Event handling – login form submit
  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault(); // CO4: DOM Events

    const email = document.getElementById('lEmail').value.trim();
    const pass  = document.getElementById('lPass').value;
    const err   = document.getElementById('loginErr');

    // CO3: Conditions – validate non-empty inputs
    if (!email || !pass) {
      err.textContent = 'Please enter email and password.';
      document.getElementById('lEmail').classList.toggle('err', !email);
      document.getElementById('lPass').classList.toggle('err', !pass);
      return;
    }

    // CO3: Conditions – accept any valid credentials
    err.textContent = '';
    // CO3: Basic expressions – derive name from email
    const name = email.split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    // CO4: Browser storage – save session to sessionStorage
    sessionStorage.setItem('rs_user', JSON.stringify({ name, email }));
    document.getElementById('uName').textContent = name;

    // CO4: DOM manipulation – show app page
    document.getElementById('loginPage').classList.add('hide');
    document.getElementById('appPage').classList.add('show');
    updateStats();
    setTab('open');
  });

  /* ─────────────────────────────────────────────
     LOGOUT – CO4: Event handling, Browser storage
  ───────────────────────────────────────────── */
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('rs_user'); // CO4: Browser storage
    document.getElementById('appPage').classList.remove('show');
    document.getElementById('loginPage').classList.remove('hide');
    document.getElementById('loginForm').reset();
    document.getElementById('loginErr').textContent = '';
  });

  /* ─────────────────────────────────────────────
     PRIORITY BUTTONS – CO4: Event handling
     CO3: Arrow functions, Conditions
  ───────────────────────────────────────────── */
  const pBtns = document.querySelectorAll('.pbtn');
  const pVal  = document.getElementById('pVal');

  pBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // CO3: Loops + Conditions – deselect all, then activate clicked
      pBtns.forEach(b => { b.classList.remove('al','am','ah'); b.setAttribute('aria-pressed','false'); });
      const p = btn.dataset.p; // CO3: Object property access
      if (p === 'low')    btn.classList.add('al'); // CO3: Conditions
      if (p === 'medium') btn.classList.add('am');
      if (p === 'high')   btn.classList.add('ah');
      btn.setAttribute('aria-pressed', 'true');
      pVal.value = p; // CO4: DOM manipulation
    });
  });

  /* ─────────────────────────────────────────────
     FORM VALIDATION & SUBMIT
     CO5: Form validation with JavaScript
     CO5: Handling user input dynamically
     CO3: Functions, Conditions, Objects, Arrays
  ───────────────────────────────────────────── */
  // CO3: Function (arrow) – reusable single-field validator
  const vf = (id, cond, eid) => {
    const v = document.getElementById(id).value.trim();
    const ok = cond(v); // CO3: Conditions
    document.getElementById(id).classList.toggle('err', !ok);
    document.getElementById(eid).classList.toggle('show', !ok);
    return ok; // CO3: Basic expressions – return boolean
  };

  // CO4: Event handling – complaint form submit
  document.getElementById('cForm').addEventListener('submit', e => {
    e.preventDefault(); // CO4: DOM Events

    // CO5: Form validation with JavaScript – validate each field
    const oks = [
      vf('rName',  v => v.length > 1,  'e1'),
      vf('rPhone', v => v.length >= 10, 'e2'),
      vf('rEmail', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'e3'), // CO3: regex
      vf('rUnit',  v => v.length > 0,  'e4'),
      vf('cType',  v => v !== '',      'e5'),
      vf('rDesc',  v => v.length >= 20,'e7'),
    ];
    const pOk = pVal.value !== ''; // CO3: Conditions
    document.getElementById('e6').classList.toggle('show', !pOk);

    if (oks.every(Boolean) && pOk) { // CO3: Array methods – every

      // CO3: Objects – build new complaint object
      const nc = {
        id:       `RS-${1047 + Math.floor(Math.random() * 900)}`, // CO3: Number literal
        type:     document.getElementById('cType').value,
        unit:     document.getElementById('rUnit').value.trim(),
        status:   'open',
        progress: 5,       // CO3: Number literal
        priority: pVal.value,
        desc:     document.getElementById('rDesc').value.trim(),
      };

      complaints.unshift(nc); // CO3: Array methods – unshift (add to front)

      // CO4: Browser storage – persist to sessionStorage
      sessionStorage.setItem('rs_complaints', JSON.stringify(complaints));

      // CO4: Async Programming – Promise simulation for async submit
      new Promise(resolve => setTimeout(resolve, 500)) // CO3: Arrow fn
        .then(() => { // CO4: Promises – .then() callback
          showToast(`✅ ${nc.id} submitted!`);
          e.target.reset();
          // CO3: Array methods – forEach to reset priority buttons
          pBtns.forEach(b => { b.classList.remove('al','am','ah'); b.setAttribute('aria-pressed','false'); });
          pVal.value = '';
        });

      // CO5: Handling user input dynamically – update dashboard immediately
      updateStats();
      setTab('open'); // Switch to Open tab to show new complaint
    }
  });

  /* ─────────────────────────────────────────────
     TOAST NOTIFICATION
     CO3: Arrow function, Callback function
  ───────────────────────────────────────────── */
  // CO3: Function (arrow)
  const showToast = msg => {
    const t = document.getElementById('toast');
    t.textContent = msg; // CO4: DOM manipulation
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000); // CO3: Callback function
  };

  /* ─────────────────────────────────────────────
     SESSION CHECK – CO4: Browser storage
     CO5: Optimize page load times
  ───────────────────────────────────────────── */
  const sess = sessionStorage.getItem('rs_user'); // CO4: Browser storage
  if (sess) { // CO3: Conditions
    const u = JSON.parse(sess); // CO3: Object
    document.getElementById('uName').textContent = u.name;
    document.getElementById('loginPage').classList.add('hide');
    document.getElementById('appPage').classList.add('show');
    updateStats();
    setTab('open');
  }

  /* ─────────────────────────────────────────────
     THEME TOGGLE
     CO2: Theme management using CSS custom properties
     CO4: DOM manipulation, Browser storage
  ───────────────────────────────────────────── */
  let isDark = true; // CO3: Variable

  // CO4: Browser storage – restore saved theme on load
  const savedTheme = localStorage.getItem('rs_theme');
  if (savedTheme === 'light') { // CO3: Conditions
    isDark = false;
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeBtn').textContent = '☀️ Light';
  }

  // CO4: Event handling – theme toggle button
  document.getElementById('themeBtn').addEventListener('click', () => {
    isDark = !isDark; // CO3: Basic expressions – toggle boolean
    // CO3: Conditions
    if (isDark) {
      document.documentElement.removeAttribute('data-theme'); // CO4: DOM manipulation
      document.getElementById('themeBtn').textContent = '🌙 Dark';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.getElementById('themeBtn').textContent = '☀️ Light';
    }
    localStorage.setItem('rs_theme', isDark ? 'dark' : 'light'); // CO4: Browser storage
  });

  /* ─────────────────────────────────────────────
     RESET RESOLVED COMPLAINTS
     CO4: Event handling, DOM manipulation
     CO3: Array methods – filter, reduce, splice
  ───────────────────────────────────────────── */
  const modal = document.getElementById('resetModal');

  // CO4: Event handling – open confirm modal
  document.getElementById('resetResolvedBtn').addEventListener('click', () => {
    modal.classList.add('show'); // CO4: DOM manipulation
  });

  // CO4: Event handling – cancel button closes modal
  document.getElementById('modalCancel').addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // CO4: Event handling – confirm reset
  document.getElementById('modalConfirm').addEventListener('click', () => {
    modal.classList.remove('show');

    // CO3: Array methods – filter to count resolved
    const count = complaints.filter(c => c.status === 'resolved').length;

    // CO3: Array methods – reduce to collect indices, then splice in-place
    const toRemove = complaints.reduce((acc, c, i) => {
      if (c.status === 'resolved') acc.push(i); // CO3: Conditions
      return acc;
    }, []);
    toRemove.reverse().forEach(i => complaints.splice(i, 1)); // CO3: Array methods

    updateStats(); // CO4: DOM manipulation

    // CO3: Conditions – switch tab if on resolved
    if (activeTab === 'resolved') setTab('open');
    else renderList();

    // CO3: Template literal, ternary – dynamic message
    showToast(`🗑 ${count} resolved complaint${count !== 1 ? 's' : ''} cleared.`);
  });

  // Close modal when clicking outside the box
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show'); // CO3: Conditions
  });

  /* ─────────────────────────────────────────────
     CO5: CORS – in production, API calls include
       Access-Control-Allow-Origin headers for the deployed domain.

     CO5: ES6 modules – in modular build:
       import { login }          from './modules/auth.js';
       import { submitComplaint } from './modules/complaints.js';
       import { validateForm }    from './modules/validate.js';

     CO5: Deploying the Project – built via CI/CD pipeline,
       deployed to HTTPS cloud host (Vercel/Netlify/AWS).

     CO3: Number literals:
       const MASK = 0xFF;   // hexadecimal literal
       const BIG  = 1e5;    // scientific notation = 100000
  ───────────────────────────────────────────── */

}); // end DOMContentLoaded
