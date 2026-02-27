/*
  Fresh gallery viewer
  - Renders per-category sections
  - Loads thumbnails from _thumbs/<original-path> first to save bandwidth
  - After window `load` preloads full-res images and swaps them in when ready
  - Provides a simple lightbox (created if missing)
*/

const galleryData = [
  {
    title: '2D Design',
    description: '',
    images: [
      'images/2d design/BlueStickerNoBorder.png',
      'images/2d design/Design.jpeg',
      'images/2d design/FinalLogo.png',
      'images/2d design/GlowLetters.png',
      'images/2d design/gray.png',
      'images/2d design/Hideous%20Darlings%20Poster.jpg',
      'images/2d design/IMG_1848.PNG',
      'images/2d design/IMG_2776.JPG',
      'images/2d design/IMG_2777.JPG',
      'images/2d design/IMG_3375.jpeg',
      'images/2d design/IMG_6118.JPG',
      'images/2d design/IMG_6119.JPG',
      'images/2d design/IMG_7431.jpeg',
      'images/2d design/Monochrome.png',
      'images/2d design/navy.png',
      'images/2d design/Scan%208.jpeg',
      'images/2d design/Screen%20Shot%202020-07-14%20at%207.35.05%20AM.png',
      'images/2d design/Screen%20Shot%202020-07-14%20at%207.35.59%20AM.png',
      'images/2d design/Screen%20Shot%202020-07-14%20at%207.41.06%20AM.png',
      'images/2d design/Screen%20Shot%202020-07-14%20at%208.11.47%20AM.png',
      'images/2d design/Screenshot%202025-01-25%20at%203.54.24%E2%80%AFPM.png',
      'images/2d design/YellowWhiteSticker.png'
    ]
  },
  {
    title: 'Drawing / Printmaking / Painting',
    description: '',
    images: [
      'images/drawing printmaking painting/5BA72228-5256-4082-9412-B257F7AD2153 copy.jpeg',
      'images/drawing printmaking painting/Class of 2019 30.75x46.5.tif',
      'images/drawing printmaking painting/Eisses_1.jpg',
      'images/drawing printmaking painting/Eisses_10.jpg',
      'images/drawing printmaking painting/Eisses_33.jpg',
      'images/drawing printmaking painting/FullSizeRender%20(1).jpg',
      'images/drawing printmaking painting/Gathered005.jpg',
      'images/drawing printmaking painting/Gathered007.jpg',
      'images/drawing printmaking painting/IMG_0022.jpeg',
      'images/drawing printmaking painting/IMG_0273.jpeg',
      'images/drawing printmaking painting/IMG_0784.JPG',
      'images/drawing printmaking painting/IMG_0917.jpeg',
      'images/drawing printmaking painting/IMG_2085.jpeg',
      'images/drawing printmaking painting/IMG_3192.jpeg',
      'images/drawing printmaking painting/IMG_3195.jpeg',
      'images/drawing printmaking painting/IMG_3622 copy.jpeg',
      'images/drawing printmaking painting/IMG_3659 copy.jpeg',
      'images/drawing printmaking painting/IMG_4313.jpeg',
      'images/drawing printmaking painting/IMG_5724.jpeg',
      'images/drawing printmaking painting/IMG_7508.JPG'
    ]
  },
  {
    title: 'Photography',
    description: '',
    images: [
      'images/Photography/14C12537C-F6D0-4EA8-9CAF-87BFCEFA65D5_1_105_c.jpg',
      'images/Photography/beach day chi sequential.jpg',
      'images/Photography/EllaPortrait-2.jpg',
      'images/Photography/EllaPortrait-21.jpg',
      'images/Photography/oge01_2023_otis-1.jpg',
      'images/Photography/oge01_2023_otis-10.jpg',
      'images/Photography/oge01_2023_otis-12.jpg',
      'images/Photography/oge01_2023_otis-40.jpg',
      'images/Photography/oge01_2023_otis-52.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-16.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-17.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-21.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-28.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-29.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-32.jpg',
      'images/Photography/oge01_2024_LasVegasEdits-37.jpg',
      'images/Photography/oge02_2023_caleb-36-Edit.jpg',
      'images/Photography/oge02_2023_Ella-113.jpg',
      'images/Photography/oge02_2023_meredithbagdress-103.jpg',
      'images/Photography/oge02_2023_meredithbagdress-130.jpg',
      'images/Photography/oge02_2023_meredithbagdress-132.jpg',
      'images/Photography/oge02_2023_meredithbagdress-159.jpg',
      'images/Photography/oge02_2023_meredithbagdress-353.jpg',
      'images/Photography/oge02_2023_meredithbagdress-67.jpg',
      'images/Photography/oge02_2023_OliviaPrez-30-2.jpg',
      'images/Photography/oge02_2023_OliviaPrez-4-2.jpg',
      'images/Photography/oge02_2023_OliviaPrez-49-2.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits-10.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits-14.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits-20.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits-3.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits-34.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits2-1.jpg',
      'images/Photography/oge02_2025_SadieViolinEdits2-2.jpg',
      'images/Photography/originals-1.jpg'
    ]
  },
  {
    title: 'Plush',
    description: '',
    images: [
      'images/plush/0231E659-D958-41FB-93B3-98CFD4754037-8a046d6.jpg',
      'images/plush/0231E659-D958-41FB-93B3-98CFD4754037.jpg',
      'images/plush/0525978C-6FC2-4A82-8A4D-742ECB2C454C-98faf48.jpg',
      'images/plush/0B6BF97A-41B2-45C8-BCA3-E17570E07711-3643e19.jpg',
      'images/plush/11C0590B-05BE-4808-A9EE-211B33A43F13-87b201e.jpg',
      'images/plush/2024-01-08%2005_49_03%20+0000.jpeg',
      'images/plush/3B0A899C-B940-40B8-88F3-B020EBDA1F10-63b6526.jpg',
      'images/plush/40FC789E-7CC3-49BB-8913-0B70DAF89E7C.jpg',
      'images/plush/8F0F29FB-C398-4B63-9BDF-6502C66E882B.jpg',
      'images/plush/9BFC96E0-C27B-405F-9B21-B67F3048703C.jpg',
      'images/plush/B6FB17B6-7ABD-40AB-8B5B-656837460FFB.jpg',
      'images/plush/FA643882-7A87-4541-9E9D-E3A84EDA16E4.jpg',
      'images/plush/IMG_1151.jpeg',
      'images/plush/oge03_2025_rayedits1-1.jpg',
      'images/plush/oge03_2025_rayedits1-10.jpg',
      'images/plush/oge03_2025_rayedits1-11.jpg',
      'images/plush/oge03_2025_rayedits1-12.jpg',
      'images/plush/oge03_2025_rayedits1-13.jpg',
      'images/plush/oge03_2025_rayedits1-14.jpg',
      'images/plush/oge03_2025_rayedits1-15.jpg',
      'images/plush/oge03_2025_rayedits1-16.jpg',
      'images/plush/oge03_2025_rayedits1-17.jpg',
      'images/plush/oge03_2025_rayedits1-2.jpg',
      'images/plush/oge03_2025_rayedits1-3.jpg',
      'images/plush/oge03_2025_rayedits1-4.jpg',
      'images/plush/oge03_2025_rayedits1-5.jpg',
      'images/plush/oge03_2025_rayedits1-6.jpg',
      'images/plush/oge03_2025_rayedits1-7.jpg',
      'images/plush/oge03_2025_rayedits1-8.jpg',
      'images/plush/oge03_2025_rayedits1-9.jpg',
      'images/plush/oge03_2025_slugshootedits1-1.jpg',
      'images/plush/oge03_2025_slugshootedits1-10.jpg',
      'images/plush/oge03_2025_slugshootedits1-11.jpg',
      'images/plush/oge03_2025_slugshootedits1-12.jpg',
      'images/plush/oge03_2025_slugshootedits1-13.jpg',
      'images/plush/oge03_2025_slugshootedits1-14.jpg',
      'images/plush/oge03_2025_slugshootedits1-15.jpg',
      'images/plush/oge03_2025_slugshootedits1-16.jpg',
      'images/plush/oge03_2025_slugshootedits1-17.jpg',
      'images/plush/oge08_2023_etsyedits-16-2.jpg',
      'images/plush/oge08_2023_etsyedits-17-2.jpg',
      'images/plush/oge08_2023_etsyedits-18-2.jpg',
      'images/plush/oge08_2023_etsyedits-20-2.jpg',
      'images/plush/oge08_2023_etsyedits-3-2.jpg',
      'images/plush/oge10_2025_Starfish-1.JPG',
      'images/plush/oge10_2025_Starfish-16.JPG',
      'images/plush/oge10_2025_Starfish-18.JPG',
      'images/plush/oge10_2025_Starfish-21.JPG',
      'images/plush/oge10_2025_Starfish-22.JPG',
      'images/plush/oge10_2025_Starfish-25.JPG',
      'images/plush/oge10_2025_Starfish-28.JPG',
      'images/plush/oge10_2025_Starfish-29.JPG',
      'images/plush/oge10_2025_Starfish-3.JPG',
      'images/plush/oge10_2025_Starfish-31.JPG',
      'images/plush/oge10_2025_Starfish-32.JPG',
      'images/plush/oge10_2025_Starfish-35.JPG',
      'images/plush/oge10_2025_Starfish-36.JPG',
      'images/plush/oge10_2025_Starfish-40.JPG',
      'images/plush/oge10_2025_Starfish-42.JPG',
      'images/plush/oge10_2025_Starfish-43.JPG',
      'images/plush/oge10_2025_Starfish-44.JPG',
      'images/plush/oge10_2025_Starfish-45.JPG',
      'images/plush/oge10_2025_Starfish-46.JPG',
      'images/plush/oge10_2025_Starfish-5.JPG',
      'images/plush/oge10_2025_Starfish-50.JPG',
      'images/plush/oge10_2025_Starfish-52.JPG',
      'images/plush/oge10_2025_Starfish-54.JPG',
      'images/plush/oge10_2025_Starfish-56.JPG',
      'images/plush/oge10_2025_Starfish-63.JPG',
      'images/plush/oge10_2025_Starfish-8.JPG'
    ]
  },
  {
    title: 'Sculpture',
    description: '',
    images: [
      'images/sculpture/70062880692__EFC53687-9317-4294-92BD-06B5C736.jpeg',
      'images/sculpture/70318868136__98DA6A44-E5B9-490D-85A2-446AB4A4.jpeg',
      'images/sculpture/DSCF0284.JPG',
      'images/sculpture/Eisses_14.JPG',
      'images/sculpture/Eisses_20-665a307.JPG',
      'images/sculpture/IMG_0049.jpeg',
      'images/sculpture/IMG_0468.jpg',
      'images/sculpture/IMG_0585.jpeg',
      'images/sculpture/IMG_1989-fd324a0.JPG',
      'images/sculpture/IMG_1989.JPG',
      'images/sculpture/IMG_1992.JPG',
      'images/sculpture/IMG_2001.JPG',
      'images/sculpture/IMG_2008.JPG',
      'images/sculpture/IMG_2009.JPG',
      'images/sculpture/IMG_2012.JPG',
      'images/sculpture/IMG_2013.JPG',
      'images/sculpture/IMG_2014.JPG',
      'images/sculpture/IMG_2017.JPG',
      'images/sculpture/IMG_2018.JPG',
      'images/sculpture/IMG_2019.JPG',
      'images/sculpture/IMG_2020.JPG',
      'images/sculpture/IMG_2021-4919178.JPG',
      'images/sculpture/IMG_2021.JPG',
      'images/sculpture/IMG_2022.JPG',
      'images/sculpture/IMG_2024.JPG',
      'images/sculpture/IMG_2026-669963d.JPG',
      'images/sculpture/IMG_2026.JPG',
      'images/sculpture/IMG_2028.JPG',
      'images/sculpture/IMG_2030-0c84a4e.JPG',
      'images/sculpture/IMG_2030.JPG',
      'images/sculpture/IMG_2031.JPG',
      'images/sculpture/IMG_2032-020dbfe.JPG',
      'images/sculpture/IMG_2032.JPG',
      'images/sculpture/IMG_2036-c59086b.JPG',
      'images/sculpture/IMG_2036.JPG',
      'images/sculpture/IMG_2040.JPG',
      'images/sculpture/IMG_2041-486775c.JPG',
      'images/sculpture/IMG_2041.JPG',
      'images/sculpture/IMG_2043.JPG',
      'images/sculpture/IMG_2046-da2d237.JPG',
      'images/sculpture/IMG_2046.JPG',
      'images/sculpture/IMG_2047-642baf6.JPG',
      'images/sculpture/IMG_2047-b2b2b6f.JPG',
      'images/sculpture/IMG_2047.JPG',
      'images/sculpture/IMG_2048.JPG',
      'images/sculpture/IMG_2050.JPG',
      'images/sculpture/IMG_2052.JPG',
      'images/sculpture/IMG_2053.JPG',
      'images/sculpture/IMG_2054.JPG',
      'images/sculpture/IMG_2055.JPG',
      'images/sculpture/IMG_2056-642baf6.JPG',
      'images/sculpture/IMG_2057-fa56cd4.JPG',
      'images/sculpture/IMG_2058.JPG',
      'images/sculpture/IMG_2059-b33b7c4.JPG',
      'images/sculpture/IMG_3816.jpeg',
      'images/sculpture/IMG_6852.jpeg',
      'images/sculpture/IMG_6984.jpeg',
      'images/sculpture/kidneyshrimp.JPG'
    ]
  },
  {
    title: 'Wearable Design',
    description: '',
    images: [
      'images/wearable design/IMG_0288.jpg',
      'images/wearable design/IMG_0350.heic',
      'images/wearable design/IMG_0545 2.jpeg',
      'images/wearable design/IMG_0548 2.jpeg',
      'images/wearable design/IMG_0550.jpeg',
      'images/wearable design/IMG_0551.jpeg',
      'images/wearable design/IMG_0558.jpeg',
      'images/wearable design/IMG_0564.jpeg',
      'images/wearable design/IMG_0572.jpeg',
      'images/wearable design/IMG_0574.jpeg',
      'images/wearable design/IMG_0580.jpeg',
      'images/wearable design/IMG_0613.jpeg',
      'images/wearable design/oge12_2024_Quilt&Earrings-10.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-13.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-17.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-2.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-20.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-21.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-22.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-24.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-26.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-29.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-32.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-33.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-35.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-39.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-7.jpg',
      'images/wearable design/oge12_2024_Quilt&Earrings-9.jpg'
    ]
  }
];

// --- Helpers ---
function safeImagePath(path) {
  return path.replace(/ /g, "%20");
}

function placeholderDataUrl() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'><rect width='16' height='10' fill='#eee'/></svg>`;
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
