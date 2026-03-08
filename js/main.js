/* ============================================================
   HERO DUST PARTICLES (canvas)
   ============================================================ */
(function () {
  const hero = document.querySelector('.hero');
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-dust';
  canvas.setAttribute('aria-hidden', 'true');
  // Insert after .hero-overlay so dust sits above the base gradient
  hero.querySelector('.hero-overlay').insertAdjacentElement('afterend', canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  // Pre-joined rgba channel strings for performance
  const COLS = [
    '212,180,106',  // gold
    '232,213,160',  // pale gold
    '240,228,188',  // very pale gold
    '176,163,212',  // pale lavender
  ];

  class Dust {
    constructor(scatter) { this.init(scatter); }
    init(scatter) {
      this.x = Math.random() * W;
      this.y = scatter ? Math.random() * H : H + 4;
      this.r = 0.4 + Math.random() * 1.4;
      this.vy = -(0.07 + Math.random() * 0.18);
      this.vx = (Math.random() - 0.5) * 0.18;
      this.life = 0;
      this.max = 1000 + Math.random() * 220;
      this.peak = 0.07 + Math.random() * 0.2;
      this.col = COLS[Math.floor(Math.random() * COLS.length)];
    }
    tick() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const t = this.life / this.max;
      const a = t < 0.2 ? (t / 0.2) * this.peak
        : t > 0.8 ? ((1 - t) / 0.2) * this.peak
          : this.peak;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${a.toFixed(3)})`;
      ctx.fill();
      if (this.life >= this.max || this.y < -4) this.init(false);
    }
  }

  resize();
  const pts = Array.from({ length: 120 }, () => new Dust(true));

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => p.tick());
    requestAnimationFrame(loop);
  })();

  window.addEventListener('resize', resize, { passive: true });
})();

/* ============================================================
   HERO SPARKLES
   ============================================================ */
(function () {
  const hero = document.querySelector('.hero');
  const COUNT = 30;
  const COLORS = [
    { color: '#d4b46a', glow: 'rgba(212,180,106,0.55)' },
    { color: '#c49a3c', glow: 'rgba(196,154, 60,0.50)' },
    { color: '#e8d5a0', glow: 'rgba(232,213,160,0.45)' },
    { color: '#f0e4bc', glow: 'rgba(212,180,106,0.35)' },
  ];

  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement('span');
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    // Vertical arm longer than horizontal for classic glint look
    const armV = (7 + Math.random() * 13).toFixed(1);
    const armH = (armV * (0.35 + Math.random() * 0.25)).toFixed(1);
    const dur = (3.5 + Math.random() * 3.5).toFixed(2);
    const del = (Math.random() * 8).toFixed(2);
    const x = (4 + Math.random() * 92).toFixed(1);
    const y = (4 + Math.random() * 92).toFixed(1);
    const rot = (Math.random() * 45).toFixed(0);
    const opa = (0.45 + Math.random() * 0.5).toFixed(2);

    s.className = 'sparkle';
    s.style.cssText = [
      `left:${x}%`,
      `top:${y}%`,
      `--sparkle-color:${col.color}`,
      `--sparkle-glow:${col.glow}`,
      `--sparkle-arm-v:${armV}px`,
      `--sparkle-arm-h:${armH}px`,
      `--sparkle-dur:${dur}s`,
      `--sparkle-delay:${del}s`,
      `--sparkle-rot:${rot}deg`,
      `--sparkle-opacity:${opa}`,
    ].join(';');

    hero.appendChild(s);
  }
})();

/* ============================================================
   HEADER — scroll state
   ============================================================ */
const header = document.getElementById('site-header');

function updateHeader() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ============================================================
   MOBILE NAV
   ============================================================ */
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  mainNav.classList.toggle('open', !expanded);
  document.body.style.overflow = expanded ? '' : 'hidden';
});

// Close nav on link click
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
const WEDDING_DATE = new Date('2027-06-12T16:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.querySelector('.countdown-bar').innerHTML =
      '<p style="text-align:center;color:#d4b483;font-family:\'Cormorant Garamond\',serif;font-size:1.5rem;letter-spacing:0.05em">Today is the day!</p>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent = String(days);
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lbLabel = document.getElementById('lightbox-label');
const lbImg = document.getElementById('lightbox-img');
const lbClose = document.getElementById('lightbox-close');
const lbPrev = document.getElementById('lightbox-prev');
const lbNext = document.getElementById('lightbox-next');
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  showSlide(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lbClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  galleryItems[currentIndex].focus();
}

function showSlide(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentIndex].querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbLabel.textContent = `Photo ${currentIndex + 1} of ${galleryItems.length}`;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showSlide(currentIndex - 1));
lbNext.addEventListener('click', () => showSlide(currentIndex + 1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
  if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
});

/* ============================================================
   SCROLL FADE-IN
   ============================================================ */
const fadeTargets = [
  '.section-label',
  '.section-title',
  '.story-grid',
  '.timeline-item',
  '.event-card',
  '.gallery-item',
  '.faq-item',
  '.link-card',
  '.links-intro',
];

const allFadeEls = document.querySelectorAll(fadeTargets.join(','));
allFadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Small stagger for sibling groups
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60 * (entry.target.dataset.fadeDelay || 0));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add stagger indices to grouped siblings
document.querySelectorAll('.events-grid, .links-grid, .gallery-grid, .timeline').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.dataset.fadeDelay = i;
  });
});

allFadeEls.forEach(el => observer.observe(el));

/* ============================================================
   WISTERIA CURSOR TRAIL
   ============================================================ */
(function () {
  // Petals and individual flowers — small enough to feel like falling blooms
  const ASSETS = [
    'wisteria/petal 0.png', 'wisteria/petal 1.png', 'wisteria/petal 2.png',
    'wisteria/petal 3.png', 'wisteria/petal 4.png', 'wisteria/petal 5.png',
    'wisteria/petal 6.png', 'wisteria/petal 7.png', 'wisteria/petal 8.png',
    'wisteria/petal 9.png', 'wisteria/petal 10.png',
    'wisteria/petals 0.png', 'wisteria/petals 1.png', 'wisteria/petals 2.png',
    'wisteria/flower 0.png', 'wisteria/flower 1.png', 'wisteria/flower 2.png',
    'wisteria/flower 3.png', 'wisteria/flower 4.png', 'wisteria/flower 5.png',
    'wisteria/flower side 0.png', 'wisteria/flower side 1.png',
  ];

  // Preload so first spawn is instant
  ASSETS.forEach(src => { const i = new Image(); i.src = src; });

  let mouseX = 0, mouseY = 0;
  let lastX = 0, lastY = 0, lastTime = 0;
  const petals = [];
  const MAX_PETALS = 120;
  const REPEL_RADIUS = 150;

  class Petal {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 28 + Math.random() * 24;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.rot = Math.random() * 360;
      this.rotV = (Math.random() - 0.5) * 4;
      this.life = 0;
      this.maxLife = (200 + Math.random() * 60) | 0;

      this.el = document.createElement('img');
      this.el.src = ASSETS[Math.floor(Math.random() * ASSETS.length)];
      this.el.setAttribute('aria-hidden', 'true');
      this.el.className = 'cursor-petal';
      document.body.appendChild(this.el);
    }

    update(mx, my) {
      // Repel from cursor
      const dx = this.x - mx;
      const dy = this.y - my;
      const dist = Math.hypot(dx, dy) || 0.001;
      if (dist < REPEL_RADIUS) {
        const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * 0.6;
        this.vx += (dx / dist) * f;
        this.vy += (dy / dist) * f;
      }

      // Gravity
      this.vy += 0.02;

      // Rotation-driven glide: petal drifts along its facing direction
      const rad = (this.rot * Math.PI) / 180;
      this.vx += Math.cos(rad) * 0.022;
      this.vy += Math.sin(rad) * 0.022;

      // Damping
      this.vx *= 0.96;
      this.vy *= 0.96;

      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.rotV;
      this.life++;

      const t = this.life / this.maxLife;
      const opacity = t < 0.15 ? (t / 0.15) * 0.9
        : t > 0.65 ? ((1 - t) / 0.35) * 0.9
          : 0.9;

      this.el.style.width = `${this.size.toFixed(1)}px`;
      this.el.style.height = `${this.size.toFixed(1)}px`;
      this.el.style.left = `${(this.x - this.size / 2).toFixed(1)}px`;
      this.el.style.top = `${(this.y - this.size / 2).toFixed(1)}px`;
      this.el.style.transform = `rotate(${this.rot.toFixed(1)}deg)`;
      this.el.style.opacity = opacity.toFixed(3);

      return this.life < this.maxLife;
    }

    remove() { this.el.remove(); }
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const now = Date.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (Math.hypot(dx, dy) < 5 || now - lastTime < 25) return;
    if (petals.length < MAX_PETALS) petals.push(new Petal(e.clientX, e.clientY));
    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
  }, { passive: true });

  (function loop() {
    for (let i = petals.length - 1; i >= 0; i--) {
      if (!petals[i].update(mouseX, mouseY)) {
        petals[i].remove();
        petals.splice(i, 1);
      }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   STORY PHOTO SLIDESHOW
   ============================================================ */
(function () {
  const SELFIES = [
    { src: 'selfies/download_20210213_140606.webp', date: 'February 2021', location: 'Bend, OR' },
    { src: 'selfies/download_20210325_145148.webp', date: 'March 2021', location: 'Puget Sound, WA' },
    { src: 'selfies/image5.webp', date: 'April 2024', location: 'Wrightsville Beach, NC' },
    { src: 'selfies/IMG_3016.webp', date: 'May 2021', location: 'Hawaii?' },
    { src: 'selfies/PXL_20210502_050256827.webp', date: 'May 2021', location: 'Lapakahi State Historical Park, HI' },
    { src: 'selfies/PXL_20210502_050335697.PORTRAIT.webp', date: 'May 2021', location: 'Lapakahi State Historical Park, HI' },
    { src: 'selfies/PXL_20210801_173724384.webp', date: 'August 2021', location: 'San Francisco Bay, CA' },
    { src: 'selfies/PXL_20210904_023256719.webp', date: 'September 2021', location: 'Salem, OR' },
    { src: 'selfies/PXL_20211002_030402180~2.webp', date: 'October 2021', location: 'Portland, OR' },
    { src: 'selfies/PXL_20211127_200257681.webp', date: 'November 2021', location: 'Dulles International Airport, NC' },
    { src: 'selfies/PXL_20221212_230834798.webp', date: 'December 2022', location: 'Cozumel, Mexico' },
    { src: 'selfies/PXL_20230101_024920291.webp', date: 'January 2023', location: 'Eugene, OR' },
    { src: 'selfies/PXL_20231119_020535917.webp', date: 'November 2023', location: 'Oregon Zoo' },
    { src: 'selfies/PXL_20231119_034722948.webp', date: 'November 2023', location: 'Oregon Zoo' },
    { src: 'selfies/PXL_20240422_204432008.webp', date: 'April 2024', location: 'Wrightsville Beach, NC' },
    { src: 'selfies/PXL_20240509_231714316.webp', date: 'May 2024', location: 'Folly Beach, SC' },
    { src: 'selfies/PXL_20240621_041451450.webp', date: 'June 2024', location: 'Jacksonville, OR' },
    { src: 'selfies/PXL_20240713_212935689.webp', date: 'July 2024', location: 'Sonoma, CA' },
    { src: 'selfies/PXL_20240714_001541581.webp', date: 'July 2024', location: 'Sonoma, CA' },
    { src: 'selfies/PXL_20240808_230937970.webp', date: 'August 2024', location: 'Port Royal, SC' },
    { src: 'selfies/PXL_20240816_175832577.webp', date: 'August 2024', location: 'Pigeon Forge, TN' },
    { src: 'selfies/PXL_20240816_202237644.webp', date: 'August 2024', location: 'Sevierville, TN' },
    { src: 'selfies/PXL_20240819_001657115.webp', date: 'August 2024', location: 'Gatlinburg, TN' },
    { src: 'selfies/PXL_20240831_121833720.webp', date: 'August 2024', location: 'Walt Disney World, FL' },
    { src: 'selfies/PXL_20240831_211710733.webp', date: 'August 2024', location: 'Walt Disney World, FL' },
    { src: 'selfies/PXL_20240901_003343116.webp', date: 'September 2024', location: 'Walt Disney World, FL' },
    { src: 'selfies/PXL_20241014_221104800.webp', date: 'October 2024', location: 'Topsail Beach, NC' },
    { src: 'selfies/PXL_20241026_233739932.NIGHT.webp', date: 'October 2024', location: 'Beaufort, SC' },
    { src: 'selfies/PXL_20241113_145559026.webp', date: 'November 2024', location: 'Topsail Beach, NC' },
    { src: 'selfies/PXL_20241208_141505201.webp', date: 'December 2024', location: 'Greenville, NC' },
    { src: 'selfies/PXL_20250122_031716560.webp', date: 'January 2025', location: 'Greenville, NC' },
    { src: 'selfies/PXL_20251017_234059393.webp', date: 'October 2025', location: 'Durham, NC' },
    { src: 'selfies/PXL_20260116_224149697.webp', date: 'January 2026', location: 'Greenville, NC' },
    { src: 'selfies/Snapchat-1327981760.webp', date: 'Spring 2022', location: 'Eugene, OR' },
    { src: 'selfies/Snapchat-1704615897.webp', date: 'December 2025', location: 'Savannah, GA' },
    { src: 'selfies/Snapchat-1908219670.webp', date: 'Fall 2022', location: 'Eugene, OR' },
    { src: 'selfies/Snapchat-2063169310.webp', date: 'Winter 2023?', location: '???' },
    { src: 'selfies/Snapchat-904925079.webp', date: '???', location: 'Greenville, NC' },
  ];

  // Shuffle order
  for (let i = SELFIES.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [SELFIES[i], SELFIES[j]] = [SELFIES[j], SELFIES[i]];
  }

  const imgs = document.querySelectorAll('.story-photo');
  if (imgs.length < 2) return;

  // Preload all images
  SELFIES.forEach(({ src }) => { const i = new Image(); i.src = src; });

  const caption = document.querySelector('.story-slide-caption');
  const captionDate = caption.querySelector('.story-slide-date');
  const captionLocation = caption.querySelector('.story-slide-location');

  function updateCaption(item) {
    captionDate.textContent = item.date;
    captionLocation.textContent = item.location;
  }

  let front = imgs[1]; // visible on top
  let back = imgs[0];  // hidden behind
  back.style.opacity = '0';
  front.style.zIndex = '2';
  back.style.zIndex = '1';

  // Set initial image and caption to first shuffled entry
  front.src = SELFIES[0].src;
  updateCaption(SELFIES[0]);

  let current = 0;
  let paused = false;
  let transitioning = false;

  // Stage the first "back" image immediately so it's ready before the first tick
  function stageNext() {
    const next = (current + 1) % SELFIES.length;
    back.src = SELFIES[next].src;
  }
  stageNext();

  document.querySelector('.story-image').addEventListener('mouseenter', () => paused = true);
  document.querySelector('.story-image').addEventListener('mouseleave', () => paused = false);

  setInterval(() => {
    if (paused || transitioning) return;
    transitioning = true;
    current = (current + 1) % SELFIES.length;
    const item = SELFIES[current];

    // back.src is already loaded (staged at end of previous cycle)
    caption.style.opacity = '0';
    front.style.opacity = '0';
    back.style.opacity = '1';

    // Wait until the 0.6s CSS transition is fully done before resetting
    setTimeout(() => {
      updateCaption(item);
      caption.style.opacity = '1';
      [front, back] = [back, front];
      front.style.zIndex = '2';
      back.style.zIndex = '1';
      // Reset new back instantly without transition
      back.style.transition = 'none';
      back.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        back.style.transition = '';
        // Stage the NEXT image into back now that it's safely hidden
        stageNext();
        transitioning = false;
      }));
    }, 650);
  }, 3000);
})();

/* ============================================================
   WISTERIA SCATTERED DECORATIONS
   ============================================================ */
(function () {
  const placements = [
    // Countdown bar — left: cluster drooping out
    {
      parent: '.countdown-bar',
      src: 'wisteria/cluster 0.png',
      css: 'left:-20px;bottom:-40px;width:clamp(100px,12vw,185px);opacity:0.5;transform:rotate(12deg) scaleX(-1)',
    },
    // Countdown bar — petals drifting near center-right
    {
      parent: '.countdown-bar',
      src: 'wisteria/leaf 1.png',
      css: 'right:2%;top:32px;width:clamp(55px,6vw,160px);opacity:0.5;transform:rotate(-22deg)',
    },
    // Our Story — top right: flowers
    {
      parent: '#our-story',
      src: 'wisteria/flowers 2.png',
      css: 'top:15px;right:5px;width:clamp(100px,12vw,185px);opacity:0.5;transform:rotate(-170deg)',
    },
    // Events — bottom left: leaf and stem
    {
      parent: '#events',
      src: 'wisteria/leaf and stem 1.png',
      css: 'bottom:-20px;left:-25px;width:clamp(80px,9vw,135px);opacity:0.5;transform:rotate(36deg)',
    },
    // Gallery — top right: flowers cluster
    {
      parent: '#gallery',
      src: 'wisteria/flowers 0.png',
      css: 'top:-15px;right:-10px;width:clamp(95px,11vw,165px);opacity:0.5;transform:rotate(-10deg)',
    },
    // FAQ — top left: leaf
    {
      parent: '#faq',
      src: 'wisteria/leaf 1.png',
      css: 'top:-10px;left:-15px;width:clamp(70px,8vw,115px);opacity:0.5;transform:rotate(15deg) scaleX(-1)',
    },
    // Footer — left: cluster
    {
      parent: '.site-footer',
      src: 'wisteria/cluster 0.png',
      css: 'left:-20px;top:50%;transform:translateY(-50%) rotate(8deg);width:clamp(100px,12vw,175px);opacity:0.5',
    },
    // Footer — right: flower side mirrored
    {
      parent: '.site-footer',
      src: 'wisteria/flower side 2.png',
      css: 'right:-8px;top:50%;transform:translateY(-50%) scaleX(-1) rotate(72deg);width:clamp(75px,9vw,130px);opacity:0.5',
    },
    // Footer — leaf accent
    {
      parent: '.site-footer',
      src: 'wisteria/leaf 0.png',
      css: 'right:25%;bottom:0;width:clamp(50px,5vw,78px);opacity:0.5;transform:rotate(-80deg)',
    },
  ];

  placements.forEach(({ parent, src, css }) => {
    const el = document.querySelector(parent);
    if (!el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const img = document.createElement('img');
    img.src = src;
    img.setAttribute('aria-hidden', 'true');
    img.className = 'wisteria-deco';
    img.style.cssText = css;
    el.prepend(img);  // prepend so content layers on top naturally
  });
})();

/* ============================================================
   RSVP MODAL
   ============================================================ */
(() => {
  const RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwn1QRWCcaDBVc4oQhOQVJYuFs7YsOvZnGx75nc4B6aIzcNretHmxSbulslvq7DKrSOeg/exec';

  const modal = document.getElementById('rsvp-modal');
  const closeBtn = document.getElementById('rsvp-close');
  const form = document.getElementById('rsvp-form');
  const attendingSelect = document.getElementById('rsvp-attending');
  const attendingFields = document.getElementById('rsvp-attending-fields');
  const submitBtn = document.getElementById('rsvp-submit');
  const submitText = submitBtn.querySelector('.rsvp-submit-text');
  const submitLoading = submitBtn.querySelector('.rsvp-submit-loading');
  const successDiv = document.getElementById('rsvp-success');
  const errorDiv = document.getElementById('rsvp-error');
  const retryBtn = document.getElementById('rsvp-retry');
  const triggers = document.querySelectorAll('.rsvp-open');
  let returnFocus = null;

  /* --- Open / Close --- */
  function openRsvp(trigger) {
    returnFocus = trigger || document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    form.elements[0].focus();
  }

  function closeRsvp() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus();
    resetModal();
  }

  function resetModal() {
    form.reset();
    form.hidden = false;
    attendingFields.hidden = true;
    successDiv.hidden = true;
    errorDiv.hidden = true;
    submitBtn.disabled = false;
    submitText.hidden = false;
    submitLoading.hidden = true;
    clearErrors();
  }

  /* --- Triggers --- */
  triggers.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openRsvp(el);
    });
  });

  closeBtn.addEventListener('click', closeRsvp);

  modal.querySelector('.rsvp-modal-backdrop').addEventListener('click', closeRsvp);

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeRsvp();
    if (e.key === 'Tab') trapFocus(e);
  });

  /* --- Conditional fields --- */
  attendingSelect.addEventListener('change', () => {
    attendingFields.hidden = attendingSelect.value !== 'yes';
  });

  /* --- Validation --- */
  function clearErrors() {
    form.querySelectorAll('.rsvp-field--error').forEach(el => el.classList.remove('rsvp-field--error'));
    form.querySelectorAll('.rsvp-field-error').forEach(el => el.remove());
  }

  function showError(field, message) {
    const wrapper = field.closest('.rsvp-field');
    wrapper.classList.add('rsvp-field--error');
    const msg = document.createElement('div');
    msg.className = 'rsvp-field-error';
    msg.textContent = message;
    wrapper.appendChild(msg);
  }

  function validate() {
    clearErrors();
    let valid = true;
    let firstInvalid = null;

    const name = form.elements.name;
    if (!name.value.trim()) {
      showError(name, 'Name is required');
      valid = false;
      firstInvalid = firstInvalid || name;
    }

    const email = form.elements.email;
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      valid = false;
      firstInvalid = firstInvalid || email;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, 'Please enter a valid email');
      valid = false;
      firstInvalid = firstInvalid || email;
    }

    const attending = form.elements.attending;
    if (!attending.value) {
      showError(attending, 'Please select an option');
      valid = false;
      firstInvalid = firstInvalid || attending;
    }

    if (firstInvalid) firstInvalid.focus();
    return valid;
  }

  /* --- Submission --- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitText.hidden = true;
    submitLoading.hidden = false;

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      attending: form.elements.attending.value,
      guests: form.elements.guests.value,
      meal: form.elements.meal.value,
      dietary: form.elements.dietary.value.trim(),
      song: form.elements.song.value.trim(),
    };

    try {
      const res = await fetch(RSVP_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(res.status);
      form.hidden = true;
      successDiv.hidden = false;
    } catch {
      form.hidden = true;
      errorDiv.hidden = false;
    }
  });

  retryBtn.addEventListener('click', () => {
    errorDiv.hidden = true;
    form.hidden = false;
    submitBtn.disabled = false;
    submitText.hidden = false;
    submitLoading.hidden = true;
  });

  /* --- Focus trap --- */
  function trapFocus(e) {
    const focusable = modal.querySelectorAll(
      'button:not([hidden]):not([disabled]), input:not([hidden]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled])'
    );
    const visible = Array.from(focusable).filter(el => el.offsetParent !== null);
    if (!visible.length) return;
    const first = visible[0];
    const last = visible[visible.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
})();
