# Update on 2026-02-09

## 整體改動

**字體選用Gill Sans
// globals.css
body {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}


### COURSE 課程總覽
// components/ShopPage.tsx
**Public about page 更改了整個頁面，看上去更加的似一個課程的排版

// app/user/id/shop/page.tsx
**User about page 更改了整個頁面，看上去更加的似一個課程的排版(與公開版一樣設計，但價錢不同，有折扣)


// app/user/id/shop/productsId/page.tsx
**手機版面圖片縮短、內容加了隔行功能、去除不必要的字眼、位置上改動(目標群眾，課程目標，適用場景)

// app/user/id/shop/shopId/page.tsx
**手機版面圖片縮短、內容加了隔行功能、去除不必要的字眼、位置上改動(目標群眾，課程目標，適用場景)


// components/Navbar.tsx
**Navbar 改了顏色，現在是 bg-slate-900

// app/about/page.tsx
**整頁內容改動，Static page，Navbar不變，有button 連結去(首頁/ ; Whatsapp 彈頁; 核心課程介紹 /core; 團隊介紹 /ourtteam; Footer連結去 /privacy-policy)


### 新頁面(3)
/core
/ourtteam
/privacy-policy (新加，做marketing / SEO 有用)

### components （加入 tsx file ）
Footer.tsx
GoogleMap.tsx


### Media 相片

// navbar page
Logo_WHite.png
**需更換成 “去背照的company logo“, 取替舊的圖片

// about page
b1.png
b2.png
b3.png
banner.jpg
core.png
**新加入圖片

// ourteam page
TA_Myra.jpeg
Teacher_Eric.png
Teacher_HoncyLee.webp
Teacher_JTsang.png
Teacher_WaiLung.webp
**新加入/更改圖片





