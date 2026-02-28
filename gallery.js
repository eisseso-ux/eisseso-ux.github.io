async function loadGallery(options) {
    const {
        jsonPath,
        galleryId = "gallery"
    } = options;

    try {
        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const images = await response.json();

        const gallery = document.getElementById(galleryId);
        if (!gallery) {
            throw new Error(`Element with id '${galleryId}' not found.`);
        }

        if (!Array.isArray(images)) {
            throw new Error("JSON file is not an array.");
        }

        gallery.innerHTML = ""; // Clear existing content

        images.forEach(image => {
            const img = document.createElement("img");
            img.src = image;
            img.alt = "";
            img.className = "gallery-image";
            gallery.appendChild(img);
        });

    } catch (error) {
        console.error(`Gallery failed to load (${jsonPath}):`, error);
    }
}