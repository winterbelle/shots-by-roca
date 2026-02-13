console.log("gallery.js loaded");

//Supabase connection
const SUPABASE_URL = "https://jkrohypnjvyjyytmfgxh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprcm9oeXBuanZ5anl5dG1mZ3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTY5ODMsImV4cCI6MjA4NjM5Mjk4M30.d_75roPEflSOSZ1pSe-uCOybPxU91vliJ9fmpubRCMk";

window.sb = window.sb || window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
window.sb = sb;

//bucket + category folders
const BUCKET = "photos";

const folderMap = {
  performance: "performance",
  events: "events",
  details: "details",
  scenic: "scenic",
};

//galleries object
const galleries = {};

//helper functions
function prettyTitle(key) {
  // fallback if caption differs
  const map = {
    performance: "Performance & Motion",
    events: "Events & Lifestyle",
    details: "Details & Portraits",
    scenic: "Scenic Views",
  };
  return map[key] || key;
}

function preload(list) {
  list.forEach((item) => {
    const img = new Image();
    img.src = item.src;
  });
}

async function loadGalleryFromFolder(key) {
  const folder = folderMap[key];

  const { data, error } = await sb
    .storage
    .from(BUCKET)
    .list(folder, {
      limit: 200,
      sortBy: { column: "name", order: "asc" } 
    });

  if (error) {
    console.error("Error loading folder:", key, error);
    galleries[key] = [];
    return;
  }

  // filter out non-files and unsupported formats, and ignore hidden files
  const files = (data || []).filter(f =>
    f.name && !f.name.startsWith(".") && /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name)
  );

  galleries[key] = files.map(f => {
    const path = `${folder}/${f.name}`;
    const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path);

    return {
      src: pub.publicUrl,
      caption: prettyTitle(key) 
    };
  });

  console.log(`Loaded ${galleries[key].length} images for ${key}`);
}

async function loadAllGalleries() {
  await Promise.all(Object.keys(folderMap).map(loadGalleryFromFolder));
  console.log("All galleries loaded ✅", galleries);
}


// LIGHTBOX ELEMENTS
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

const album = document.getElementById("album");
const albumGrid = document.getElementById("albumGrid");
const albumTitle = document.getElementById("albumTitle");
const albumClose = document.getElementById("albumClose");

let currentGallery = [];
let galleryIndex = 0;
let currentKey = null;

// LIGHTBOX FUNCTIONS
function openLightbox(galleryKey, startIndex = 0) {
  currentGallery = galleries[galleryKey] || [];
  if (!currentGallery.length) return;

  preload(currentGallery);

  galleryIndex = startIndex;
  render();

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");

  if (!album.classList.contains("is-open")) {
    document.body.style.overflow = "";
  }
}


function render() {
  const item = currentGallery[galleryIndex];
  if (!item) return;
  lbImg.src = item.src;
  lbCaption.textContent = item.caption || "";
}

function next() {
  if (!currentGallery.length) return;
  galleryIndex = (galleryIndex + 1) % currentGallery.length;
  render();
}

function prev() {
  if (!currentGallery.length) return;
  galleryIndex = (galleryIndex - 1 + currentGallery.length) % currentGallery.length;
  render();
}

// ALBUM FUNCTIONS
function openAlbum(galleryKey) {
  const list = galleries[galleryKey] || [];
  if (!list.length) {
    console.warn(`No images found for "${galleryKey}". Check bucket/folder names & permissions.`);
    return;
  }

  preload(list);

  albumTitle.textContent = prettyTitle(galleryKey);
  albumGrid.innerHTML = "";

  list.forEach((item, i) => {
    const thumb = document.createElement("img");
    thumb.src = item.src;
    thumb.alt = item.caption || albumTitle.textContent;
    thumb.loading = "lazy";

    thumb.addEventListener("click", () => {
      openLightbox(galleryKey, i);
    });


    albumGrid.appendChild(thumb);
  });

  album.classList.add("is-open");
  album.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeAlbum() {
  album.classList.remove("is-open");
  album.setAttribute("aria-hidden", "true");
  if (!lightbox.classList.contains("is-open")) {
    document.body.style.overflow = "";
  }
}


lbClose?.addEventListener("click", closeLightbox);
lbNext?.addEventListener("click", next);
lbPrev?.addEventListener("click", prev);

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

albumClose?.addEventListener("click", closeAlbum);

album?.addEventListener("click", (e) => {
  if (e.target === album) closeAlbum();
});


//keyboard controls
document.addEventListener("keydown", (e) => {
  if (lightbox?.classList.contains("is-open")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    return;
  }

  if (album?.classList.contains("is-open")) {
    if (e.key === "Escape") closeAlbum();
  }
});

//swipe for touch devices
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  const threshold = 50; // minimum distance required

  if (swipeDistance > threshold) {
    prev(); // swipe right → previous image
  } else if (swipeDistance < -threshold) {
    next(); // swipe left → next image
  }
}



async function init() {
  // Load all images first
  await loadAllGalleries();

  // Hook tile clicks AFTER galleries exist
  document.querySelectorAll(".tile[data-gallery]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const key = tile.dataset.gallery;
      openAlbum(key);
    });
  });

  console.log("✅ Gallery fully initialized");
}

init();
