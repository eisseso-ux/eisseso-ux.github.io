/*
    Gallery loader + viewer
    - Provides `loadGallery({ jsonPath, galleryId, title })` to load a simple
        JSON array of image paths and render a sectioned gallery with thumbnails.
    - Ports the layout, lazy-thumb upgrade, and lightbox behavior from gallery_old.js
*/

const galleryDataGlobal = window.galleryData || [];

function safeImagePath(path) {
    return path.replace(/ /g, "%20");
}

function thumbForFullPath(imgPath) {
    if (!imgPath) return imgPath;
    if (imgPath.includes('_thumbs/')) return imgPath;
    const idx = imgPath.indexOf('images/');
    if (idx !== -1) {
        return imgPath.slice(0, idx) + '_thumbs/' + imgPath.slice(idx);
    }
    return '_thumbs/' + imgPath;
}

function placeholderDataUrl() {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'><rect width='16' height='10' fill='%23eee'/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function readableName(path) {
    const fileName = path.split("/").pop().replace(/\.[^.]+$/, "");
    return fileName.replace(/[-_]/g, " ");
}

function ensureLightboxMarkup() {
    // Prefer an inline `.gallery .lightbox` provided by the page template
    const pageLightbox = document.querySelector('.gallery .lightbox');
    if (pageLightbox) return pageLightbox;

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

function renderGalleryFromData(rootId = 'gallery') {
    const galleryRoot = document.getElementById(rootId);
    if (!galleryRoot) return;

    const galleryData = window.galleryData || galleryDataGlobal;
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
        h2.textContent = category.title || '';
        const p = document.createElement('p');
        p.className = 'section-description';
        p.textContent = category.description || '';
        header.append(h2, p);

        const grid = document.createElement('div');
        grid.className = 'gallery-grid';

            (category.images || []).forEach((imgPath) => {
            const index = flat.length;
            flat.push({ src: imgPath, title: category.title || '', label: readableName(imgPath) });

            const btn = document.createElement('button');
            btn.className = 'gallery-card';
            btn.type = 'button';
            btn.setAttribute('aria-label', `Open ${readableName(imgPath)} in fullscreen`);

            const img = document.createElement('img');
            img.className = 'gallery-thumb thumb';
            img.alt = `${category.title || ''} - ${readableName(imgPath)}`;
            img.loading = 'lazy';
            img.dataset.full = safeImagePath(imgPath);
            img.dataset.index = index;

            // load a pre-generated thumbnail when available (falls back to full image path)
            img.src = safeImagePath(thumbForFullPath(imgPath));

            img.onerror = () => {
                // If the thumbnail failed, try the full image once before showing placeholder
                if (!img.dataset._triedFull) {
                    img.dataset._triedFull = '1';
                    img.src = img.dataset.full || safeImagePath(img.dataset.full || '');
                    return;
                }
                if (!img.classList.contains('thumb-missing')) {
                    img.classList.add('thumb-missing');
                    img.src = placeholderDataUrl();
                }
            };

            btn.appendChild(img);
            const meta = document.createElement('div');
            meta.className = 'gallery-meta';
            meta.textContent = category.title || '';
            btn.appendChild(meta);

            btn.addEventListener('click', () => openLightbox(index));

            grid.appendChild(btn);
        });

        section.append(header, grid);
        galleryRoot.appendChild(section);
    });

    window.__gallery_flat = flat;

    // thumbnails load full images immediately; no lazy-thumb observer

    setupLightbox();

    // Render compact thumbnail strip when page uses the `.gallery` template
    try {
        renderThumbnailsIfTemplatePresent(flat);
    } catch (err) {
        console.warn('renderThumbnailsIfTemplatePresent failed', err);
    }
}

function renderThumbnailsIfTemplatePresent(flat) {
    const thumbsRoot = document.querySelector('.gallery .thumbnails');
    if (!thumbsRoot) return;
    thumbsRoot.innerHTML = '';

    flat.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'thumb-btn';
        btn.setAttribute('aria-label', `Open ${item.label} in lightbox`);

        const img = document.createElement('img');
        img.className = 'thumb';
        img.alt = `${item.title} - ${item.label}`;
        img.loading = 'lazy';
        img.dataset.index = idx;
        img.dataset.full = safeImagePath(item.src);
        img.src = safeImagePath(thumbForFullPath(item.src));
        img.onerror = () => {
            if (!img.dataset._triedFull) {
                img.dataset._triedFull = '1';
                img.src = img.dataset.full || safeImagePath(img.dataset.full || '');
                return;
            }
            if (!img.classList.contains('thumb-missing')) {
                img.classList.add('thumb-missing');
                img.src = placeholderDataUrl();
            }
        };

        btn.appendChild(img);
        btn.addEventListener('click', () => openLightbox(idx));
        thumbsRoot.appendChild(btn);
    });
}

function setupLightbox() {
    const lb = ensureLightboxMarkup();

    const img = lb.querySelector('#lightbox-image') || lb.querySelector('.lightbox-img');
    const caption = lb.querySelector('#lightbox-caption') || lb.querySelector('.lightbox-caption');
    const closeBtn = lb.querySelector('#lightbox-close') || lb.querySelector('.close-btn') || lb.querySelector('.lightbox-close');
    const prevBtn = lb.querySelector('#lightbox-prev');
    const nextBtn = lb.querySelector('#lightbox-next');

    function show(index) {
        const flat = window.__gallery_flat || [];
        if (!flat.length) return;
        index = (index + flat.length) % flat.length;
        window.__gallery_current = index;
        const item = flat[index];
        if (img) {
            img.src = safeImagePath(item.src);
            img.alt = `${item.title} - ${item.label}`;
        }
        if (caption) caption.textContent = `${item.title} | ${item.label}`;
        lb.classList.add('visible');
        lb.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function hide() {
        lb.classList.remove('visible');
        lb.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    if (closeBtn) closeBtn.onclick = hide;
    if (prevBtn) prevBtn.onclick = () => show((window.__gallery_current || 0) - 1);
    if (nextBtn) nextBtn.onclick = () => show((window.__gallery_current || 0) + 1);

    lb.addEventListener('click', (e) => {
        if (e.target === lb) hide();
    });

    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('visible')) return;
        if (e.key === 'Escape') hide();
        if (e.key === 'ArrowRight') show((window.__gallery_current || 0) + 1);
        if (e.key === 'ArrowLeft') show((window.__gallery_current || 0) - 1);
    });

    window.__gallery_open = (i) => show(i);
}

function openLightbox(index) {
    if (window.__gallery_open) window.__gallery_open(index);
}

function initGallery() {
    renderGalleryFromData('gallery');
}

async function loadGallery(options = {}) {
    const { jsonPath, galleryId = 'gallery', title } = options;

    if (!jsonPath) {
        console.warn('loadGallery: no jsonPath provided, attempting to render existing galleryData');
        renderGalleryFromData(galleryId);
        return;
    }

    try {
        const resp = await fetch(jsonPath);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        let galleryData;
        if (Array.isArray(data) && data.length && typeof data[0] === 'string') {
            galleryData = [{ title: title || (document.querySelector('h1')?.textContent || ''), description: '', images: data }];
        } else if (Array.isArray(data)) {
            galleryData = data;
        } else if (data && Array.isArray(data.images)) {
            galleryData = [{ title: data.title || title || '', description: data.description || '', images: data.images }];
        } else {
            throw new Error('Unsupported JSON format for gallery data');
        }

        window.galleryData = galleryData;
        renderGalleryFromData(galleryId);
    } catch (err) {
        console.error('Failed to load gallery JSON:', err);
    }
}

document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
document.addEventListener('DOMContentLoaded', initGallery);
