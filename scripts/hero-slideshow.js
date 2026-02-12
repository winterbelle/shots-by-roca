(() => {
  const sb = window.sb;

  const BUCKET = "photos";
  const DESKTOP_FOLDER = "Slideshow";
  const MOBILE_FOLDER  = "Slideshow-Mobile";

  const hero = document.getElementById("hero");
  if (!hero) return;

  const layerA = hero.querySelector(".hero-bg--a");
  const layerB = hero.querySelector(".hero-bg--b");

  const displayTime = 3500;

  const isMobile = () => window.matchMedia("(max-width: 800px)").matches;

  function preload(urls) {
    return Promise.all(
      urls.map(
        (src) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = reject;
            img.src = src;
          })
      )
    );
  }

  function setBg(el, src) {
    el.style.backgroundImage = `url("${src}")`;
  }

  async function loadUrlsFromFolder(folder) {
    const { data, error } = await sb.storage.from(BUCKET).list(folder, {
      limit: 50,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.error("Slideshow list error:", error);
      return [];
    }

    return (data || [])
      .filter((f) => f.name && /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name))
      .map((f) => {
        const path = `${folder}/${f.name}`;
        return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      });
  }

  let heroImages = [];
  let index = 0;
  let showingA = true;
  let timer = null;
  let activeFolder = null;

  function nextSlide() {
    if (!heroImages.length) return;

    index = (index + 1) % heroImages.length;

    const incoming = showingA ? layerB : layerA;
    const outgoing = showingA ? layerA : layerB;

    setBg(incoming, heroImages[index]);
    incoming.offsetHeight; // force reflow

    incoming.style.opacity = "1";
    outgoing.style.opacity = "0";

    showingA = !showingA;
  }

  async function startSlideshow(folder) {
    activeFolder = folder;
    index = 0;
    showingA = true;

    heroImages = await loadUrlsFromFolder(folder);

    if (!heroImages.length) {
      console.warn(`No hero images found in ${BUCKET}/${folder}`);
      return;
    }

    await preload(heroImages);

    setBg(layerA, heroImages[0]);
    layerA.style.opacity = "1";
    layerB.style.opacity = "0";

    if (timer) clearInterval(timer);
    timer = setInterval(nextSlide, displayTime);
  }

  // init
  (async function init() {
    const folder = isMobile() ? MOBILE_FOLDER : DESKTOP_FOLDER;
    await startSlideshow(folder);
  })();

  // if user rotates phone / resizes browser, swap slideshows
  window.addEventListener("resize", async () => {
    const folder = isMobile() ? MOBILE_FOLDER : DESKTOP_FOLDER;
    if (folder !== activeFolder) {
      await startSlideshow(folder);
    }
  });
})();
