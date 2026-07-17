# Update on 2026.7.17
  components/GoogleMap.tsx
  Add: Set default business hours, line 2 & line 27


# Update on 2026-03-12

  // Missing -> Delete Double Nav
  app/privacy-policy/page.tsx

  // Fixed WhatsApp button
  WhatsApp Order sent to Front
  components/Navbar.tsx
  Line 134: z-49
  components/Whatsapp.tsx
  Line 10: z-50

  // SEO setting
  components/GoogleMap.tsx
  app/page.tsx
  app/layout.tsx
  app/Posts/page.tsx
  app/core/page.tsx
  app/about/page.tsx
  app/ourteam/page.tsx

  // Seperating OurTeam
  Add components: components/Teacher.tsx



# Update on 2026-03-09

    ### COURSE 課程總覽
    /components/ShopPage.tsx
    類型篩選 & 狀態篩選 高級 Overflow 修正
    app/(user)/user/[userId]/shop/page.tsx


    /shop
    此版本欠日期時間、參考文章，不能夠直接return
    app/shop/[shopId]/page.tsx
    app/(user)/user/[userId]/shop/[productsId]/page.tsx

    左側：
    唔要張圖 個位換影片
    目標x3 優化佢

    右側：
    Button 字改成報名 / user -> 報名及付款
    加報讀流程（流程式咁做）


  ### Navbar
    components/Navbar.tsx
    睇下可唔可以改風格
    Remove - n8nChatbox
    Add - WhatsApp button -> Whatsapp.tsx [only display on public & user]
    rename user navbar: 願望清單 > 心儀課程
    Changed Logo: White -> Blue

    /WhatsApp item
    components/Whatsapp.tsx
    Add Whatsapp 界面

  ### Other Page
    /login
    app/login/components/login.tsx
    Line 137:登入 > 學生登入
    Add: mt-20

    /register
    components/CreateForm/Create-User-Form_client.tsx
    Line 224: 帳戶名稱 > 登入帳號
    LIne 244: 姓名 > 學生姓名
    Add: 報名流程 

    /user/id
    app/(user)/user/[userId]/page.tsx
    Line 159: 用戶資料 > 學生資料
    Line 164: 用ID > 學生 ID
    Line 168: 用戶名 > 登入帳號
    Line 172: 姓名 > 學生姓名

    /user cart
    app/(user)/user/[userId]/cart/page.tsx
    願望清單 > 心儀課程

    app/ourteam/page.tsx
    Remove: Double Nav
    Upate Typo: Lung -> Wai
    Add Teacher: Antoninus Yeung

    /about page
    app/about/page.tsx
    Add button: 個人客製化方案 / 報價 [Whatsapp] & 企業客製化方案 / 報價 [Email]
    Update Google Map

    //core
    Remove Double Nav


  ### Post
  app/Posts/[id]/page.tsx
  app/Posts/page.tsx
  **改時要小心，不要動到SEO meta**


### Public page setting
  middleware.ts
  Add: /ourteam, /privacy-policy

### Next config
  next.config.ts
  Add: picsum.photos

  ==== 改動notes ====

  帳目紀錄 gen 成invoice??


# =====================
# =====================
# =====================
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





