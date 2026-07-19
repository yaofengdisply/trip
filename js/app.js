/* ========================================
   Trip - 旅行攻略网站 主逻辑
   ======================================== */

// ---- DOM References ----
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---- Render Helpers ----
function renderStars(rating) {
  const full = Math.floor(rating);
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      html += '<svg class="star-icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    } else {
      html += '<svg class="empty-star" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }
  }
  return html;
}

function getTypeIcon(type) {
  const icons = {
    "历史文化": "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    "世界遗产": "M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z",
    "自然风光": "M7 14l-5 5h4l3-3 2 2 4-4 4 3V5H7v9z",
    "古城古镇": "M3 21h18v-2H3v2zM3 3v2h18V3H3zm0 6v6h4V9H3zm6 0v6h4V9H9zm6 0v6h4V9h-4z",
    "海岛文艺": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
  };
  return icons[type] || icons["自然风光"];
}

// ---- Card Render ----
function createSpotCard(spot) {
  const card = document.createElement("div");
  card.className = "spot-card fade-in-stagger";
  card.innerHTML = `
    <div class="spot-card-img-wrapper">
      <img class="spot-card-img" src="${spot.image}" alt="${spot.name}" loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=img-placeholder><svg viewBox=\\'0 0 24 24\\' fill=none stroke=currentColor stroke-width=2><path d=\\'${getTypeIcon(spot.type)}\\'/></svg></div>'">
    </div>
    <div class="spot-card-body">
      <div class="spot-card-header">
        <span class="spot-card-name">${spot.name}</span>
        <span class="spot-card-rating">
          ${spot.rating}
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>
        </span>
      </div>
      <div class="spot-card-city">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${spot.city}
      </div>
      <div class="spot-card-summary">${spot.summary.substring(0, 80)}...</div>
      <div class="spot-card-tags">
        <span class="spot-card-tag">${spot.type}</span>
        <span class="spot-card-tag">${spot.season}</span>
      </div>
    </div>
  `;
  card.addEventListener("click", () => {
    window.location.href = `pages/spot.html?id=${spot.id}`;
  });
  return card;
}

// ---- Home Page ----
function initHomePage() {
  const grid = $(".spot-grid");
  if (!grid) return;

  const searchInput = $("#searchInput");
  const filterTags = $$(".filter-tag");

  function renderSpots(filter = "", type = "") {
    grid.innerHTML = "";
    const filtered = spotsData.filter((s) => {
      const matchSearch = !filter ||
        s.name.includes(filter) ||
        s.city.includes(filter) ||
        s.type.includes(filter);
      const matchType = !type || s.type === type;
      return matchSearch && matchType;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column:1/-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <h3>未找到匹配的景点</h3>
          <p>试试其他关键词或筛选条件</p>
        </div>`;
      return;
    }

    filtered.forEach((s) => {
      grid.appendChild(createSpotCard(s));
    });
  }

  // Search
  searchInput.addEventListener("input", (e) => {
    filterTags.forEach((t) => t.classList.remove("active"));
    renderSpots(e.target.value);
  });

  // Filter tags
  filterTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const isActive = tag.classList.contains("active");
      filterTags.forEach((t) => t.classList.remove("active"));
      if (!isActive) {
        tag.classList.add("active");
      }
      searchInput.value = "";
      renderSpots("", isActive ? "" : tag.dataset.filter);
    });
  });

  renderSpots();
}

// ---- Spot Detail Page ----
function initDetailPage() {
  const container = $(".spot-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const spot = spotsData.find((s) => s.id === id);

  if (!spot) {
    container.innerHTML = `<div class="container"><div class="no-results"><h3>景点未找到</h3><p>返回<a href="../index.html" style="color:var(--primary)">首页</a></p></div></div>`;
    return;
  }

  // Update breadcrumb
  const breadcrumb = $(".breadcrumb .current");
  if (breadcrumb) breadcrumb.textContent = spot.name;

  // Update page title
  document.title = `${spot.name} - Trip 旅行攻略`;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = spot.summary.substring(0, 150);

  // Render
  container.innerHTML = `
    <div class="container">
      <img class="spot-detail-hero" src="../${spot.image}" alt="${spot.name}"
        onerror="this.style.display='none'">

      <div class="spot-detail-header">
        <h1 class="spot-detail-name">${spot.name}</h1>
        <span class="spot-detail-rating">
          ${renderStars(spot.rating)}
          <span style="margin-left:4px">${spot.rating}</span>
        </span>
      </div>

      <div class="spot-detail-meta">
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <div><strong>开放时间</strong><br>${spot.openTime}</div>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <div><strong>门票价格</strong><br>${spot.price}</div>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          <div><strong>所在城市</strong><br>${spot.city}</div>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <div><strong>建议时长</strong><br>${spot.duration}</div>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9"/><path d="M3.3 7A9 9 0 0 1 12 3c5 0 9 4 9 9"/><path d="M12 7v5l3 3"/></svg>
          <div><strong>最佳季节</strong><br>${spot.season}</div>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <div><strong>景点类型</strong><br>${spot.type}</div>
        </div>
      </div>

      <div class="spot-detail-summary">${spot.summary}</div>

      <!-- Transport -->
      <div class="detail-module">
        <div class="detail-module-header" onclick="toggleModule(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <h3>交通指南</h3>
          <svg class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="detail-module-body">
          <div class="route-item">
            <div class="route-label">外部交通</div>
            <p>${spot.transport.external}</p>
          </div>
          <div class="route-item">
            <div class="route-label">内部交通</div>
            <p>${spot.transport.internal}</p>
          </div>
        </div>
      </div>

      <!-- Routes -->
      <div class="detail-module">
        <div class="detail-module-header" onclick="toggleModule(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><polyline points="13 9 13 14 9 14"/></svg>
          <h3>推荐路线</h3>
          <svg class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="detail-module-body">
          <div class="route-item">
            <div class="route-label">1日游</div>
            <p>${spot.routes.day1}</p>
          </div>
          <div class="route-item">
            <div class="route-label">2日游</div>
            <p>${spot.routes.day2 || "暂无推荐"}</p>
          </div>
          <div class="route-item">
            <div class="route-label">3日游</div>
            <p>${spot.routes.day3 || "暂无推荐"}</p>
          </div>
        </div>
      </div>

      <!-- Must-see Spots -->
      <div class="detail-module">
        <div class="detail-module-header" onclick="toggleModule(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          <h3>必打卡景点</h3>
          <svg class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="detail-module-body">
          ${spot.spots.map((s) => `<div class="list-item">${s}</div>`).join("")}
        </div>
      </div>

      <!-- Food -->
      <div class="detail-module">
        <div class="detail-module-header" onclick="toggleModule(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          <h3>美食推荐</h3>
          <svg class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="detail-module-body">
          ${spot.food.map((f) => `<div class="list-item">${f}</div>`).join("")}
        </div>
      </div>

      <!-- Hotels -->
      <div class="detail-module">
        <div class="detail-module-header" onclick="toggleModule(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/><path d="M9 18v.01"/></svg>
          <h3>住宿建议</h3>
          <svg class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="detail-module-body">
          ${spot.hotels.map((h) => `<div class="list-item">${h}</div>`).join("")}
        </div>
      </div>

      <!-- Tips -->
      <div class="detail-module">
        <div class="detail-module-header" onclick="toggleModule(this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <h3>实用 Tips</h3>
          <svg class="toggle-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="detail-module-body">
          ${spot.tips.map((t) => `<div class="tips-item">${t}</div>`).join("")}
        </div>
      </div>
    </div>
  `;
}

// ---- Global Functions ----
function toggleModule(header) {
  header.parentElement.classList.toggle("collapsed");
}

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initNav() {
  const path = window.location.pathname;
  $$(".nav-links a").forEach((a) => {
    a.classList.remove("active");
    if (path.endsWith(a.getAttribute("href")) ||
        (path.endsWith("/") && a.getAttribute("href") === "#")) {
      a.classList.add("active");
    }
  });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initBackToTop();
  initHomePage();
  initDetailPage();
});
