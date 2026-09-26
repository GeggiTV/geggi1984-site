document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = "no";
  const supportedLanguages = ["no", "en"];

  let currentLang = localStorage.getItem("siteLanguage") || defaultLang;

  function getText(key, lang) {
    const parts = key.split(".");
    let current = siteContent.translations[lang];

    for (const part of parts) {
      if (!current || !(part in current)) return null;
      current = current[part];
    }

    return typeof current === "string" ? current : null;
  }

  function renderClips() {
    const grid = document.getElementById("clipsGrid");
    const empty = document.getElementById("clipsEmpty");
    if (!grid) return;

    grid.innerHTML = "";

    if (!siteContent.clips || siteContent.clips.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";

    siteContent.clips.forEach((clip) => {
      const title = currentLang === "no" ? clip.title_no : clip.title_en;
      const card = document.createElement("a");
      card.href = clip.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "clip-card";

      card.innerHTML = `
        <div class="clip-thumb">
          <img src="${clip.thumbnail}" alt="${title}" loading="lazy">
          <div class="clip-play">▶</div>
        </div>
        <div class="clip-title">${title}</div>
      `;

      grid.appendChild(card);
    });
  }

  function renderVideos() {
    const grid = document.getElementById("videosGrid");
    const empty = document.getElementById("videosEmpty");
    if (!grid) return;

    grid.innerHTML = "";

    if (!siteContent.videos || siteContent.videos.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";

    siteContent.videos.forEach((video) => {
      const title = currentLang === "no" ? video.title_no : video.title_en;
      const description = currentLang === "no" ? video.description_no : video.description_en;

      const card = document.createElement("a");
      card.href = `https://www.youtube.com/watch?v=${video.videoId}`;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.className = "video-card";

      card.innerHTML = `
        <div class="video-thumb">
          <img src="https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg" alt="${title}" loading="lazy">
          <div class="video-play">▶</div>
        </div>
        <div class="video-content">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function renderSchedule() {
    const grid = document.getElementById("scheduleGrid");
    if (!grid) return;

    grid.innerHTML = "";

    siteContent.schedule.forEach((slot) => {
      const day = currentLang === "no" ? slot.day_no : slot.day_en;
      const game = currentLang === "no" ? slot.game_no : slot.game_en;
      const status = currentLang === "no" ? slot.status_no : slot.status_en;

      const card = document.createElement("div");
      card.className = "schedule-card";

      card.innerHTML = `
        <div class="schedule-day">${day}</div>
        <div class="schedule-time">${slot.time}</div>
        <div class="schedule-game">${game}</div>
        <div class="schedule-status">${status}</div>
      `;

      grid.appendChild(card);
    });
  }

  function renderNews() {
    const grid = document.getElementById("newsGrid");
    const empty = document.getElementById("newsEmpty");
    if (!grid) return;

    grid.innerHTML = "";

    if (!siteContent.news || siteContent.news.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";

    siteContent.news.forEach((item) => {
      const title = currentLang === "no" ? item.title_no : item.title_en;
      const excerpt = currentLang === "no" ? item.excerpt_no : item.excerpt_en;

      const card = document.createElement("article");
      card.className = "news-card";

      card.innerHTML = `
        <div class="news-date">${item.date}</div>
        <h3>${title}</h3>
        <p>${excerpt}</p>
      `;

      grid.appendChild(card);
    });
  }

  function renderAbout() {
    const aboutText = document.getElementById("aboutText");
    if (!aboutText) return;

    const text = currentLang === "no" ? siteContent.about.text_no : siteContent.about.text_en;
    aboutText.innerHTML = `<p>${text}</p>`;
  }

  function renderSocialLinks() {
    const container = document.getElementById("socialLinks");
    if (!container) return;

    container.innerHTML = "";

    siteContent.socialLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "social-link-btn";
      a.textContent = `${link.icon} ${link.name}`;
      container.appendChild(a);
    });
  }

  function renderContactInfo() {
    const emailEl = document.getElementById("emailContact");
    const vippsEl = document.getElementById("vippsNumber");
    const socialEl = document.getElementById("contactSocial");
    const discordBtn = document.getElementById("discordButton");

    if (emailEl) {
      emailEl.innerHTML = `<a href="mailto:${siteContent.contact.email}">${siteContent.contact.email}</a>`;
    }

    if (vippsEl) {
      vippsEl.textContent = siteContent.contact.vippsNumber;
    }

    if (socialEl) {
      socialEl.innerHTML = siteContent.socialLinks
        .map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>`)
        .join(" | ");
    }

    if (discordBtn) {
      discordBtn.href = siteContent.contact.discordServer;
      discordBtn.textContent = currentLang === "no"
        ? siteContent.translations.no.community.joinDiscord
        : siteContent.translations.en.community.joinDiscord;
    }
  }

  function updateStaticText() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      const translation = getText(key, currentLang);
      if (translation) {
        node.textContent = translation;
      }
    });
  }

  function updateLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      const active = button.dataset.lang === currentLang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function renderAll() {
    renderClips();
    renderVideos();
    renderSchedule();
    renderNews();
    renderAbout();
    renderSocialLinks();
    renderContactInfo();
  }

  function applyLanguage(lang) {
    if (!supportedLanguages.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem("siteLanguage", lang);
    document.documentElement.lang = lang;
    updateStaticText();
    updateLanguageButtons();
    renderAll();
  }

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.lang));
  });

  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      const nav = document.getElementById("navigation");
      if (nav) nav.classList.toggle("active");
    });
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const nav = document.getElementById("navigation");
      if (nav) nav.classList.remove("active");
    });
  });

  updateStaticText();
  updateLanguageButtons();
  renderAll();
});
