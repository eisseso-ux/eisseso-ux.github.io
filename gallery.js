/*
  EASY EDIT GUIDE:
  - Update image paths in galleryData below.
  - Keep each image path in quotes, separated by commas.
  - You can add or remove categories and files anytime.
*/

const galleryData = [
  {
    title: "Photography",
    description: "Portraits, editorial shots, and documentary moments.",
    images: [
      "images/Photography/14C12537C-F6D0-4EA8-9CAF-87BFCEFA65D5_1_105_c.jpg",
      "images/Photography/EllaPortrait-2.jpg",
      "images/Photography/EllaPortrait-21.jpg",
      "images/Photography/beach day chi sequential.jpg",
      "images/Photography/oge01_2023_otis-1.jpg",
      "images/Photography/oge01_2023_otis-10.jpg",
      "images/Photography/oge01_2023_otis-12.jpg",
      "images/Photography/oge01_2023_otis-40.jpg",
      "images/Photography/oge01_2023_otis-52.jpg",
      "images/Photography/oge01_2024_LasVegasEdits-16.jpg",
      "images/Photography/oge01_2024_LasVegasEdits-17.jpg",
      "images/Photography/oge01_2024_LasVegasEdits-21.jpg"
    ]
  },
  {
    title: "Plush",
    description: "Soft sculpture and creature studies.",
    images: [
      "images/plush/0231E659-D958-41FB-93B3-98CFD4754037-8a046d6.jpg",
      "images/plush/0231E659-D958-41FB-93B3-98CFD4754037.jpg",
      "images/plush/0525978C-6FC2-4A82-8A4D-742ECB2C454C-98faf48.jpg",
      "images/plush/0B6BF97A-41B2-45C8-BCA3-E17570E07711-3643e19.jpg",
      "images/plush/11C0590B-05BE-4808-A9EE-211B33A43F13-87b201e.jpg",
      "images/plush/2024-01-08%2005_49_03%20+0000.jpeg",
      "images/plush/3B0A899C-B940-40B8-88F3-B020EBDA1F10-63b6526.jpg",
      "images/plush/40FC789E-7CC3-49BB-8913-0B70DAF89E7C.jpg",
      "images/plush/8F0F29FB-C398-4B63-9BDF-6502C66E882B.jpg",
      "images/plush/9BFC96E0-C27B-405F-9B21-B67F3048703C.jpg",
      "images/plush/B6FB17B6-7ABD-40AB-8B5B-656837460FFB.jpg",
      "images/plush/FA643882-7A87-4541-9E9D-E3A84EDA16E4.jpg"
    ]
  },
  {
    title: "Sculpture",
    description: "Material explorations in three-dimensional form.",
    images: [
      "images/sculpture/70062880692__EFC53687-9317-4294-92BD-06B5C736.jpeg",
      "images/sculpture/70318868136__98DA6A44-E5B9-490D-85A2-446AB4A4.jpeg",
      "images/sculpture/DSCF0284.JPG",
      "images/sculpture/Eisses_14.JPG",
      "images/sculpture/Eisses_20-665a307.JPG",
      "images/sculpture/IMG_0049.jpeg",
      "images/sculpture/IMG_0468.jpg",
      "images/sculpture/IMG_0585.jpeg",
      "images/sculpture/IMG_1989-fd324a0.JPG",
      "images/sculpture/IMG_1989.JPG",
      "images/sculpture/IMG_1992.JPG",
      "images/sculpture/IMG_2001.JPG"
    ]
  },
  {
    title: "Wearable Design",
    description: "Garments and textile-based wearable pieces.",
    images: [
      "images/wearable design/IMG_0288.jpg",
      "images/wearable design/IMG_0545 2.jpeg",
      "images/wearable design/IMG_0548 2.jpeg",
      "images/wearable design/IMG_0550.jpeg",
      "images/wearable design/IMG_0551.jpeg",
      "images/wearable design/IMG_0558.jpeg",
      "images/wearable design/IMG_0564.jpeg",
      "images/wearable design/IMG_0572.jpeg",
      "images/wearable design/IMG_0574.jpeg",
      "images/wearable design/IMG_0580.jpeg",
      "images/wearable design/IMG_0613.jpeg",
      "images/wearable design/oge12_2024_Quilt&Earrings-10.jpg"
    ]
  },
  {
    title: "2D Design",
    description: "Branding, posters, typography, and digital compositions.",
    images: [
      "images/2d design/BlueStickerNoBorder.png",
      "images/2d design/Design.jpeg",
      "images/2d design/FinalLogo.png",
      "images/2d design/GlowLetters.png",
      "images/2d design/Hideous%20Darlings%20Poster.jpg",
      "images/2d design/IMG_1848.PNG",
      "images/2d design/IMG_2776.JPG",
      "images/2d design/IMG_2777.JPG",
      "images/2d design/IMG_3375.jpeg",
      "images/2d design/IMG_6118.JPG",
      "images/2d design/IMG_6119.JPG",
      "images/2d design/IMG_7431.jpeg"
    ]
  },
  {
    title: "Drawing / Printmaking / Painting",
    description: "Fine art studies and mixed process works on paper and canvas.",
    images: [
      "images/drawing printmaking painting/5BA72228-5256-4082-9412-B257F7AD2153 copy.jpeg",
      "images/drawing printmaking painting/Eisses_1.jpg",
      "images/drawing printmaking painting/Eisses_10.jpg",
      "images/drawing printmaking painting/Eisses_33.jpg",
      "images/drawing printmaking painting/FullSizeRender%20(1).jpg",
      "images/drawing printmaking painting/Gathered005.jpg",
      "images/drawing printmaking painting/Gathered007.jpg",
      "images/drawing printmaking painting/IMG_0022.jpeg",
      "images/drawing printmaking painting/IMG_0273.jpeg",
      "images/drawing printmaking painting/IMG_0784.JPG",
      "images/drawing printmaking painting/IMG_0917.jpeg",
      "images/drawing printmaking painting/IMG_2085.jpeg"
    ]
  }
];

const galleryRoot = document.getElementById("gallery-root");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeButton = document.getElementById("lightbox-close");
const previousButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let flatImages = [];
let currentIndex = 0;

function safeImagePath(path) {
  return path.replace(/ /g, "%20");
}

function readableName(path) {
  const fileName = path.split("/").pop().replace(/\.[^.]+$/, "");
  return fileName.replace(/[-_]/g, " ");
}

// Build candidate thumbnail paths (do NOT include full-size image)
function makeThumbCandidates(fullPath) {
  const lastSlash = fullPath.lastIndexOf("/");
  const dir = lastSlash >= 0 ? fullPath.slice(0, lastSlash) : ".";
  const filename = lastSlash >= 0 ? fullPath.slice(lastSlash + 1) : fullPath;
  const dot = filename.lastIndexOf(".");
  const base = dot >= 0 ? filename.slice(0, dot) : filename;
  const ext = dot >= 0 ? filename.slice(dot) : "";

  return [
    `${dir}/thumbs/${filename}`,
    `${dir}/${base}-thumb${ext}`,
    `${dir}/${base}_thumb${ext}`,
    `${dir}/${base}-small${ext}`,
    `${dir}/${base}_small${ext}`,
    `${dir}/small-${filename}`
  ];
}

function tryLoadCandidates(img, candidates) {
  let i = 0;
  function tryNext() {
    if (i >= candidates.length) return;
    const url = safeImagePath(candidates[i]);
    img.src = url;
    const onError = () => {
      img.removeEventListener('error', onError);
      img.removeEventListener('load', onLoad);
      i++;
      tryNext();
    };
    const onLoad = () => {
      img.removeEventListener('error', onError);
      img.removeEventListener('load', onLoad);
    };
    img.addEventListener('error', onError);
    img.addEventListener('load', onLoad);
  }
  tryNext();
}

function loadThumbForImg(img) {
  const raw = img.dataset.fullRaw;
  if (!raw) return;
  const candidates = makeThumbCandidates(raw);
  tryLoadCandidates(img, candidates);
}

function initThumbnailLoading() {
  if (!('IntersectionObserver' in window)) {
    // If IO not supported, attempt to load thumbnails immediately
    document.querySelectorAll('.gallery-card img').forEach(loadThumbForImg);
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        obs.unobserve(img);
        loadThumbForImg(img);
      }
    });
  }, { rootMargin: '300px 0px' });

  document.querySelectorAll('.gallery-card img').forEach((img) => io.observe(img));
}

// Render a single unified gallery grid without boxed category segments.
function renderGallery() {
  flatImages = [];
  galleryRoot.innerHTML = "";

  galleryData.forEach((category) => {
    const section = document.createElement("section");
    section.className = "project-section";

    const header = document.createElement("div");
    header.className = "section-header";

    const heading = document.createElement("h2");
    heading.className = "section-title";
    heading.textContent = category.title;

    const description = document.createElement("p");
    description.className = "section-description";
    description.textContent = category.description;

    header.append(heading, description);

    const grid = document.createElement("div");
    grid.className = "gallery-grid";

    category.images.forEach((imagePath) => {
      const imageIndex = flatImages.length;
      flatImages.push({
        src: imagePath,
        title: category.title,
        label: readableName(imagePath)
      });

      const button = document.createElement("button");
      button.className = "gallery-card";
      button.type = "button";
      button.setAttribute("aria-label", `Open ${readableName(imagePath)} in fullscreen`);
      button.addEventListener("click", () => openLightbox(imageIndex));

      const image = document.createElement("img");
      image.src = safeImagePath(imagePath);
      image.alt = `${category.title} - ${readableName(imagePath)}`;
      image.loading = "lazy";

      const meta = document.createElement("div");
      meta.className = "gallery-meta";
      meta.innerHTML = `<span class="meta-title">${category.title}</span>`;

      button.append(image, meta);
      grid.appendChild(button);
    });

    section.append(header, grid);
    galleryRoot.appendChild(section);
  });
}

function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add("visible");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("visible");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function updateLightboxImage() {
            image.src = placeholderDataUrl();
            image.alt = `${category.title} - ${readableName(imagePath)}`;
            image.loading = "lazy";
            image.dataset.full = safeImagePath(imagePath);
            image.dataset.fullRaw = imagePath;
  lightboxCaption.textContent = `${item.title} | ${item.label}`;
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % flatImages.length;
  updateLightboxImage();
}

function showPreviousImage() {
  currentIndex = (currentIndex - 1 + flatImages.length) % flatImages.length;
  updateLightboxImage();
}

closeButton.addEventListener("click", closeLightbox);
nextButton.addEventListener("click", showNextImage);
previousButton.addEventListener("click", showPreviousImage);

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("visible")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }

  if (event.key === "ArrowLeft") {
    showPreviousImage();
  }
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
renderGallery();
// start lazy thumbnail loading after render
initThumbnailLoading();
