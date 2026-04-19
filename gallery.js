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
    if (imgPath.includes('thumbs/')) return imgPath;
    const idx = imgPath.indexOf('images/');
    const withWebpExt = (path) => path.replace(/\.[^./]+$/, '.webp');
    if (idx !== -1) {
        return withWebpExt(imgPath.slice(0, idx) + 'thumbs/' + imgPath.slice(idx));
    }
    return withWebpExt('thumbs/' + imgPath);
}

function placeholderDataUrl() {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='10' viewBox='0 0 16 10'><rect width='16' height='10' fill='%23eee'/></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function setTileRatio(card, img) {
    if (!card || !img) return;
    if (!img.naturalWidth || !img.naturalHeight) return;
    card.style.setProperty('--gallery-ratio', `${img.naturalWidth} / ${img.naturalHeight}`);
    card.classList.add('tile-ready');
}

const masonryState = {
    resizeBound: false
};

function getGridColumnCount(grid) {
    const count = parseInt(window.getComputedStyle(grid).columnCount, 10);
    return Number.isFinite(count) && count > 0 ? count : 1;
}

function collectCardsInSourceOrder(grid) {
    const cards = Array.from(grid.querySelectorAll('.gallery-card'));
    cards.sort((a, b) => {
        const aOrder = parseInt(a.dataset.order || '0', 10);
        const bOrder = parseInt(b.dataset.order || '0', 10);
        return aOrder - bOrder;
    });
    return cards;
}

function applyLeftToRightMasonry(grid) {
    if (!grid) return;

    const cards = collectCardsInSourceOrder(grid);
    if (!cards.length) return;

    const colCount = getGridColumnCount(grid);
    const computed = window.getComputedStyle(grid);
    const gap = computed.columnGap || '1rem';

    const cols = Array.from({ length: colCount }, () => {
        const col = document.createElement('div');
        col.className = 'gallery-grid-col';
        col.style.display = 'flex';
        col.style.flexDirection = 'column';
        return col;
    });

    cards.forEach((card, idx) => {
        cols[idx % colCount].appendChild(card);
    });

    grid.innerHTML = '';
    grid.style.columnCount = 'initial';
    grid.style.columnGap = 'normal';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${colCount}, minmax(0, 1fr))`;
    grid.style.gap = gap;

    cols.forEach((col) => grid.appendChild(col));
}

function applyLeftToRightMasonryAll() {
    document.querySelectorAll('.gallery-grid').forEach((grid) => {
        applyLeftToRightMasonry(grid);
    });
}

function ensureMasonryResizeHandler() {
    if (masonryState.resizeBound) return;
    masonryState.resizeBound = true;

    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
        resizeRaf = window.requestAnimationFrame(() => {
            applyLeftToRightMasonryAll();
            resizeRaf = null;
        });
    });
}

function readableName(path) {
    const fileName = path.split("/").pop().replace(/\.[^.]+$/, "");
    return fileName.replace(/[-_]/g, " ");
}

function readableFolderName(name) {
    if (!name) return '';
    return decodeURIComponent(name)
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeImageEntry(entry) {
    if (typeof entry === 'string') {
        return { src: entry, caption: '' };
    }

    if (entry && typeof entry === 'object' && typeof entry.path === 'string') {
        return { src: entry.path, caption: entry.caption || '' };
    }

    return null;
}

function deriveCaptionPath(jsonPath) {
    if (!jsonPath) return '';
    return jsonPath.replace(/gallery\.json$/i, 'caption.json');
}

async function fetchCaptionMap(captionPath) {
    if (!captionPath) return {};

    try {
        const resp = await fetch(captionPath);
        if (!resp.ok) {
            if (resp.status !== 404) {
                console.warn(`Failed to load captions: ${captionPath} (HTTP ${resp.status})`);
            }
            return {};
        }

        const data = await resp.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return data;
        }

        console.warn(`Unsupported caption format in ${captionPath}; expected an object map`);
        return {};
    } catch (err) {
        console.warn(`Failed to load captions: ${captionPath}`, err);
        return {};
    }
}

function captionForPath(captionMap, imgPath) {
    if (!captionMap || !imgPath) return '';
    const caption = captionMap[imgPath];
    return typeof caption === 'string' ? caption : '';
}

function normalizeGalleryData(data, fallbackTitle = '') {
    if (Array.isArray(data) && data.length && typeof data[0] === 'string') {
        return [{ title: fallbackTitle, description: '', images: data }];
    }

    if (Array.isArray(data)) {
        return data;
    }

    if (data && Array.isArray(data.images)) {
        return [{
            title: data.title || fallbackTitle,
            description: data.description || '',
            images: data.images
        }];
    }

    throw new Error('Unsupported JSON format for gallery data');
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
        <div class="lightbox-figure" style="position:relative;">
            <button id="lightbox-close" class="lightbox-close">Close</button>
            <img id="lightbox-image" alt="" />
            <figcaption id="lightbox-caption"></figcaption>
            <button id="lightbox-prev" class="lightbox-arrow lightbox-prev" style="position:absolute; left:12px; top:50%; transform:translateY(-50%);">‹</button>
            <button id="lightbox-next" class="lightbox-arrow lightbox-next" style="position:absolute; right:12px; top:50%; transform:translateY(-50%);">›</button>
        </div>
    `;

    document.body.appendChild(lb);
    return lb;
}

function renderGalleryFromData(rootId = 'gallery', captionsByPath = {}) {
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

            (category.images || []).forEach((entry) => {
            const image = normalizeImageEntry(entry);
            if (!image) return;
            const imgPath = image.src;
            const index = flat.length;
            flat.push({
                src: imgPath,
                title: category.title || '',
                label: readableName(imgPath),
                caption: image.caption || captionForPath(captionsByPath, imgPath)
            });

            const btn = document.createElement('button');
            btn.className = 'gallery-card';
            btn.type = 'button';
            btn.dataset.order = String(index);
            btn.setAttribute('aria-label', `Open ${readableName(imgPath)} in fullscreen`);

            const img = document.createElement('img');
            img.className = 'gallery-thumb thumb';
            img.alt = `${category.title || ''} - ${readableName(imgPath)}`;
            img.loading = 'lazy';
            img.dataset.full = safeImagePath(imgPath);
            img.dataset.index = index;
            img.decoding = 'async';

            img.addEventListener('load', () => setTileRatio(btn, img), { once: true });

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

            btn.addEventListener('click', () => openLightbox(index));

            grid.appendChild(btn);

            if (img.complete) {
                setTileRatio(btn, img);
            }
        });

        section.append(header, grid);
        galleryRoot.appendChild(section);
    });

    window.__gallery_flat = flat;

    // thumbnails load full images immediately; no lazy-thumb observer

    setupLightbox();
    ensureMasonryResizeHandler();
    window.requestAnimationFrame(applyLeftToRightMasonryAll);

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
        if (caption) {
            const captionText = (item.caption || '').trim();
            caption.textContent = captionText;
            caption.style.display = captionText ? '' : 'none';
        }
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
    const { jsonPath, captionPath, galleryId = 'gallery', title } = options;

    if (!jsonPath) {
        console.warn('loadGallery: no jsonPath provided, attempting to render existing galleryData');
        renderGalleryFromData(galleryId);
        return;
    }

    try {
        const resp = await fetch(jsonPath);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        const galleryData = normalizeGalleryData(
            data,
            title || (document.querySelector('h1')?.textContent || '')
        );
        const captionsByPath = await fetchCaptionMap(captionPath || deriveCaptionPath(jsonPath));

        window.galleryData = galleryData;
        renderGalleryFromData(galleryId, captionsByPath);
    } catch (err) {
        console.error('Failed to load gallery JSON:', err);
    }
}
async function loadFolderGalleries(options = {}) {
    const {
        basePath,
        folders = [],
        galleryId = 'gallery',
        title
    } = options;

    if (!basePath) {
        console.warn('loadFolderGalleries: no basePath provided');
        return;
    }

    const normalizedBase = basePath.replace(/\/$/, '');

    if (!Array.isArray(folders) || folders.length === 0) {
        await loadGallery({
            jsonPath: `${normalizedBase}/gallery.json`,
            captionPath: `${normalizedBase}/caption.json`,
            galleryId,
            title: title || (document.querySelector('h1')?.textContent || '')
        });
        return;
    }

    const folderSections = await Promise.all(
        folders.map(async (folder) => {
            const folderPath = `${normalizedBase}/${folder}`;
            const jsonPath = `${folderPath}/gallery.json`;

            try {
                const [resp, captionMap] = await Promise.all([
                    fetch(jsonPath),
                    fetchCaptionMap(`${folderPath}/caption.json`)
                ]);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                const parsed = normalizeGalleryData(data, readableFolderName(folder));

                return parsed.map((section) => {
                    const sectionImages = section.images || [];
                    return {
                        title: section.title || readableFolderName(folder),
                        description: section.description || '',
                        images: sectionImages.map((entry) => {
                            const image = normalizeImageEntry(entry);
                            if (!image) return entry;
                            return {
                                path: image.src,
                                caption: image.caption || captionForPath(captionMap, image.src)
                            };
                        })
                    };
                });
            } catch (err) {
                console.warn(`Failed to load subfolder gallery JSON: ${jsonPath}`, err);
                return [];
            }
        })
    );

    const sections = folderSections.flat();

    if (!sections.length) {
        console.warn('No subfolder galleries loaded; falling back to base gallery.json');
        await loadGallery({
            jsonPath: `${normalizedBase}/gallery.json`,
            galleryId,
            title: title || (document.querySelector('h1')?.textContent || '')
        });
        return;
    }

    window.galleryData = sections;
    renderGalleryFromData(galleryId);
}

document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
document.addEventListener('DOMContentLoaded', initGallery);
