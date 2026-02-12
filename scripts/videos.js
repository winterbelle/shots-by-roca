const videos = [
  {
    url: "https://www.instagram.com/reel/DMDYdgPOSlj/",
    thumb: "./assets/thumbnail/qualifying-round3.png",
    caption: "Panamerican Nationals Qualifying Round 3 - 2025"
  },
  {
    url: "https://www.instagram.com/reel/DL_RsQKMc2l/",
    thumb: "./assets/thumbnail/panamerican-day2.png",
    caption: "PanAmerican Nationals Day 2 - 2025"
  },
  {
    url: "https://www.instagram.com/reel/DPuVKYgDj8R/",
    thumb: "./assets/thumbnail/torque-coffee.png",
    caption: "TORQUE & COFFEE: VINNY TEN RACING EDITION - 2025"
  },
  {
    url: "https://www.instagram.com/reel/DL45B7TRGbQ/",
    thumb: "./assets/thumbnail/clean-culture.png",
    caption: "CLEAN CULTURE NEW JERSEY - 2025"
  },
];

const grid = document.getElementById("videosGrid");

videos.forEach(v => {
  const a = document.createElement("a");
  a.href = v.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = "video-card";

  const img = document.createElement("img");
  img.src = v.thumb;
  img.alt = v.caption || "Instagram video";
  img.loading = "lazy";
  img.decoding = "async";

  const meta = document.createElement("div");
  meta.className = "video-card__meta";
  meta.textContent = v.caption || "Watch on Instagram";

  a.appendChild(img);
  a.appendChild(meta);
  grid.appendChild(a);
});
