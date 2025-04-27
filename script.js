// ------------------------------
// ページ読み込み時、パスワード認証を行う
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    fetch("password.json")
      .then(response => response.json())
      .then(data => {
        const correctPassword = data.password;
        const userPassword = prompt("パスワードを入力してください:");
  
        if (userPassword !== correctPassword) {
          alert("パスワードが間違っています。アクセスできません。");
          window.location.href = "https://google.com"; // 失敗時リダイレクト
        } else {
          // 認証成功時にページ初期化を実行
          initializePage();
        }
      })
      .catch(error => {
        console.error("パスワードファイルの読み込みに失敗しました:", error);
        alert("エラーが発生しました。");
      });
  });
  
  // ------------------------------
  // 認証成功後にページを初期化する関数
  // CSVを読み込んで、カテゴリ分け・表示を行う
  // ------------------------------
  function initializePage() {
    fetch("data.csv")
      .then(res => res.text())
      .then(csvText => {
        const data = Papa.parse(csvText, { header: true }).data;
        const grouped = groupByCategory(data);
        renderSidebar(grouped);
        renderGallery(grouped);
  
        // 検索バーのイベント設定
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", () => {
          const keyword = searchInput.value.trim().toLowerCase();
          if (!keyword) {
            renderGallery(groupByCategory(data));
          } else {
            const filtered = data.filter(item =>
              item.type.toLowerCase().includes(keyword)
            );
            renderGallery(groupByCategory(filtered));
          }
        });
      });
  }
  
  // ------------------------------
  // CSVデータをカテゴリごとにグループ化する関数
  // ------------------------------
  function groupByCategory(data) {
    const result = {};
    data.forEach(item => {
      if (!result[item.category]) {
        result[item.category] = [];
      }
      result[item.category].push(item);
    });
    return result;
  }
  
  // ------------------------------
  // 左側（上部）のメニュー（カテゴリ一覧）を生成する関数
  // ------------------------------
  function renderSidebar(groupedData) {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = ""; // 一旦クリア
  
    for (const category in groupedData) {
      const link = document.createElement("a");
      link.href = `#${category}`;
      link.textContent = category;
      sidebar.appendChild(link);
    }
  }
  
  // ------------------------------
  // メインギャラリーを生成・表示する関数
  // カテゴリごとにアコーディオン風に開閉できる
  // ------------------------------
  function renderGallery(groupedData) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // 一旦クリア
  
    for (const category in groupedData) {
      // カテゴリのセクション作成
      const section = document.createElement("section");
      section.className = "category-section";
      section.id = category;
  
      // アコーディオンヘッダー作成
      const header = document.createElement("h2");
      header.textContent = category;
      header.style.cursor = "pointer";
  
      // 画像を格納するコンテナ作成
      const container = document.createElement("div");
      container.className = "image-container";
      container.style.display = "none"; // 最初は閉じておく
  
      // 画像を追加
      groupedData[category].forEach(item => {
        const img = document.createElement("img");
        img.src = `images/${item.category}/${item.filename}`;
        img.alt = item.filename;
        container.appendChild(img);
      });
  
      // ヘッダークリックで開閉切り替え
      header.addEventListener("click", () => {
        if (container.style.display === "none") {
          container.style.display = "flex";
        } else {
          container.style.display = "none";
        }
      });
  
      // セクションにヘッダーとコンテナを追加
      section.appendChild(header);
      section.appendChild(container);
  
      // ギャラリー本体に追加
      gallery.appendChild(section);
    }
  }
  