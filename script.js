document.addEventListener("DOMContentLoaded", () => {
  let grouped = {};
  let rawData = [];

  // 初期読み込み：CSVを取得して描画
  fetch("data.csv")
    .then(res => res.text())
    .then(csvText => {
      const data = Papa.parse(csvText, { header: true }).data;
      rawData = data;

      grouped = groupByCategory(data);
      renderSidebar(grouped);
      renderGallery(grouped);
    });

  // 入力欄の監視（Typeでフィルター）
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
      renderGallery(groupByCategory(rawData)); // 全件
    } else {
      const filtered = rawData.filter(item =>
        item.type.toLowerCase().includes(keyword)
      );
      renderGallery(groupByCategory(filtered));
    }
  });

  // ---------- 関数：カテゴリ別にグループ ----------
  function groupByCategory(data) {
    const grouped = {};
    data.forEach(({ category, filename, title, type }) => {
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ filename, title, type });
    });
    return grouped;
  }

  // ---------- 関数：左メニュー ----------
  function renderSidebar(grouped) {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    Object.keys(grouped).forEach(category => {
      const link = document.createElement("a");
      link.href = `#${category}`;
      link.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      sidebar.appendChild(link);
    });
  }

  // ---------- 関数：右ギャラリー ----------
  function renderGallery(grouped) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    Object.entries(grouped).forEach(([category, images]) => {
      const section = document.createElement("section");
      section.className = "category-section";
      section.id = category;

      const header = document.createElement("h2");
      header.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      section.appendChild(header);

      const container = document.createElement("div");
      container.className = "image-container";

      images.forEach(({ filename, title }) => {
        const img = document.createElement("img");
        img.src = `images/${category}/${filename}`;
        img.alt = title;
        img.title = title;
        container.appendChild(img);
      });

      section.appendChild(container);
      gallery.appendChild(section);
    });
  }
});
