/*
  Fresh gallery viewer
  - Renders per-category sections
  - Loads thumbnails from _thumbs/<original-path> first to save bandwidth
  - After window `load` preloads full-res images and swaps them in when ready
  - Provides a simple lightbox (created if missing)
*/

const galleryData = [
  // Keep the same data structure as before; update paths here if needed.
  // (The file already contains your galleryData; keep it synced.)
];

// --- Helpers ---
function safeImagePath(path) {
  return path.replace(/ /g, "%20");
}

function placeholderDataUrl() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'><rect width='16' height='10' fill='%23eee'/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function thumbPathFor(fullPath) {
  return `_thumbs/${fullPath}`; // mirrors original path inside _thumbs/
}

function readableName(path) {
  const fileName = path.split("/").pop().replace(/\.[^.]+$/, "");
  return fileName.replace(/[-_]/g, " ");
}

// --- DOM elements (may be created if missing) ---
function ensureLightboxMarkup() {
  let lb = document.getElementById('lightbox');
  if (lb) return lb;

  lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.setAttribute('aria-hidden', 'true');

  lb.innerHTML = `
    <div class="lightbox-figure">
      <button id="lightbox-close" class="lightbox-close">Close</button>
      <img id="lightbox-image" alt="" />
      <figcaption id="lightbox-caption"></figcaption>
      <button id="lightbox-prev" class="lightbox-arrow lightbox-prev">‹</button>
      <button id="lightbox-next" class="lightbox-arrow lightbox-next">›</button>
    </div>
  `;

  document.body.appendChild(lb);
  return lb;
}

// --- Gallery rendering ---
function renderGalleryFromData(rootId = 'gallery-root') {
  const galleryRoot = document.getElementById(rootId);
  if (!galleryRoot) return;

  // If galleryData is empty in this file, try to reuse existing global data (older file)
  if (!galleryData || galleryData.length === 0) {
    console.warn('galleryData is empty — no images to render');
    return;
  }

  galleryRoot.innerHTML = '';
  const flat = [];

  galleryData.forEach((category) => {
    const section = document.createElement('section');
    section.className = 'project-section';

    const header = document.createElement('div');
    header.className = 'section-header';
    const h2 = document.createElement('h2');
    h2.className = 'section-title';
    h2.textContent = category.title;
    const p = document.createElement('p');
    p.className = 'section-description';
    p.textContent = category.description || '';
    header.append(h2, p);

    const grid = document.createElement('div');
    grid.className = 'gallery-grid';

    (category.images || []).forEach((imgPath) => {
      const index = flat.length;
      flat.push({ src: imgPath, title: category.title, label: readableName(imgPath) });

      const btn = document.createElement('button');
      btn.className = 'gallery-card';
      btn.type = 'button';
      btn.setAttribute('aria-label', `Open ${readableName(imgPath)} in fullscreen`);

      const img = document.createElement('img');
      img.className = 'gallery-thumb';
      img.alt = `${category.title} - ${readableName(imgPath)}`;
      img.loading = 'lazy';
      img.dataset.full = safeImagePath(imgPath);
      img.dataset.index = index;

      // Start with thumbnail path (fast, small)
      img.src = safeImagePath(thumbPathFor(imgPath));

      // if thumb missing, keep placeholder until full swaps in
      img.onerror = () => {
        if (!img.classList.contains('thumb-missing')) {
          img.classList.add('thumb-missing');
          img.src = placeholderDataUrl();
        }
      };

      btn.appendChild(img);
      const meta = document.createElement('div');
      meta.className = 'gallery-meta';
      meta.textContent = category.title;
      btn.appendChild(meta);

      btn.addEventListener('click', () => openLightbox(index));

      grid.appendChild(btn);
    });

    section.append(header, grid);
    galleryRoot.appendChild(section);
  });

  // store flat images for lightbox
  window.__gallery_flat = flat;

  // ensure lightbox exists and wire events
  setupLightbox();
}

// --- Lightbox implementation ---
function setupLightbox() {
  const lb = ensureLightboxMarkup();
  const img = lb.querySelector('#lightbox-image');
  const caption = lb.querySelector('#lightbox-caption');
  const closeBtn = lb.querySelector('#lightbox-close');
  const prevBtn = lb.querySelector('#lightbox-prev');
  const nextBtn = lb.querySelector('#lightbox-next');

  function show(index) {
    const flat = window.__gallery_flat || [];
    if (!flat.length) return;
    index = (index + flat.length) % flat.length;
    window.__gallery_current = index;
    const item = flat[index];
    img.src = safeImagePath(item.src);
    img.alt = `${item.title} - ${item.label}`;
    caption.textContent = `${item.title} | ${item.label}`;
    lb.classList.add('visible');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function hide() {
    lb.classList.remove('visible');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  closeBtn.onclick = hide;
  prevBtn.onclick = () => show((window.__gallery_current || 0) - 1);
  nextBtn.onclick = () => show((window.__gallery_current || 0) + 1);

  lb.addEventListener('click', (e) => {
    if (e.target === lb) hide();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('visible')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  // expose openLightbox function
  window.__gallery_open = (i) => show(i);
}

function openLightbox(index) {
  if (window.__gallery_open) window.__gallery_open(index);
}

// --- Upgrade thumbs to full-res after page load ---
function upgradeThumbnailsToFull() {
  const imgs = Array.from(document.querySelectorAll('.gallery-thumb'));
  if (!imgs.length) return;

  // stagger loads to avoid hammering the network
  imgs.forEach((img, i) => {
    const full = img.dataset.full;
    if (!full) return;
    // if full already set, skip
    if (img.dataset.upgraded === '1') return;

    // stagger by 120ms per image
    setTimeout(() => {
      const loader = new Image();
      loader.onload = () => {
        img.src = full;
        img.dataset.upgraded = '1';
      };
      loader.onerror = () => {
        // keep thumb / placeholder if full fails
      };
      loader.src = full;
    }, i * 120);
  });
}

// --- Initialization ---
function initGallery() {
  // If galleryData was intentionally left in the file header previously,
  // replace with the real data by the user or keep the existing global `galleryData`.
  // Render and start thumbnail -> full upgrade.
  renderGalleryFromData('gallery-root');
  // Upgrade after window load so browser can finish initial rendering and load small thumbs first
  window.addEventListener('load', () => {
    try {
      upgradeThumbnailsToFull();
    } catch (e) {
      console.error('Error upgrading thumbnails:', e);
    }
  });
}

// Run on script load
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
document.addEventListener('DOMContentLoaded', initGallery);
