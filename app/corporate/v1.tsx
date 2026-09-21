
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/Logo_Blue.png';
import hero from '../../public/banner.jpg';

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 企業培訓 Banner 區 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
          <div className="bg-gray-200 min-h-[50vh] md:min-h-[70vh] rounded-l-lg overflow-hidden">
            <Image
              src={hero}
              alt="企業培訓"
              width={1200}
              height={800}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="text-gray-400 font-light mb-3">NITTP 政府資助課程 · 認可培訓機構</p>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">AI 科技轉移落地</h2>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">專屬企業團隊升級方案</h2>
            <p className="text-gray-600 font-light mb-8 leading-relaxed">
              不同於普通理論培訓，ITE 主打【企業技術轉移】：把成熟的AI工具、工作流程、營運方法，完整移植到貴公司。不讓員工只懂概念，學完即刻上手、落地執行，真正幫企業降本提效、完成數位轉型。
            </p>
            <div>
              <Link href="/contact">
                <button className="px-5 py-2 border-gray-700 border-2 text-gray-800 rounded-3xl hover:bg-gray-800 hover:text-white transition-colors">
                  索取企業培訓方案
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 企業技術轉移核心價值（通俗企業視角） */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">什麼是企業技術轉移？</h3>
        <p className="text-gray-600 mt-6 font-bold">
          不是單純上課，是把「成熟的企業AI營運能力」搬進你的公司。
        </p>
        <p className="text-gray-600 mt-1 font-light">
          大部分培訓只教工具操作，員工學完返公司依然不會用、用不上。ITE 的技術轉移，是按企業行業、崗位、現有系統，定制專屬學習方案：手把手教、實操演練、輸出可复用模板與流程，幫團隊徹底解決「學不會、用不上、落地難」的痛點。
        </p>
        <p className="text-gray-600 mt-6 font-bold">
          NITTP 政府資助 · 降低企業培訓成本
        </p>
        <p className="text-gray-600 mt-1 font-light">
          本機構為官方認可培訓單位，企業報讀可申請新型工業化及科技培訓計劃資助，最高可獲50%課程資助，低成本完成團隊科技升級。
        </p>
      </section>

      {/* 工具匹配區｜不綁定工具、按需定制 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-xl my-8">
        <h2 className="text-3xl font-light text-gray-700 mb-2">不綁死單一工具，贴合企業現有生態</h2>
        <p className="text-gray-600 font-light mb-8">
          拒絕模板化教學！我們按貴公司正在使用的系統與工具定制課程，學員所學即所用，零磨合成本、即日落地。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-4 text-left text-gray-700 font-medium">适配工具</th>
                <th className="py-4 text-left text-gray-700 font-medium">適用團隊 / 機構</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Microsoft 365 Copilot</span></td>
                <td className="py-4 text-gray-600">NGO、社福、政府、全套M365企業機構</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Claude</span></td>
                <td className="py-4 text-gray-600">決策者、資深員工、IT團隊、AI Agent開發</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Hermes（開源模型）</span></td>
                <td className="py-4 text-gray-600">決策者、資深員工、IT團隊、私隱敏感企業、本地部署需求</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Codex</span></td>
                <td className="py-4 text-gray-600">決策者、資深員工、IT團隊、技術進階開發</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Gemini</span></td>
                <td className="py-4 text-gray-600">決策者、資深員工、IT團隊、Google Workspace用戶機構</td>
              </tr>
              <tr>
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Deepseek</span></td>
                <td className="py-4 text-gray-600">決策者、資深員工、IT團隊、控成本、數據不上雲企業</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 普及層：全體員工基礎課程 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">普及層 · 適合全體員工</span>
          <h2 className="text-3xl font-light text-gray-700 mt-4 mb-2">基礎AI能力 · 覆蓋全崗位日常工作</h2>
          <p className="text-gray-600 font-light mb-8">
            零技術門檻、無需基礎！專為普通員工定制，快速掌握AI辦公技巧，解決文書、數據、簡報、資安基礎痛點，全面提升團隊基礎效率。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-cyan-700 text-white rounded-full text-xs font-medium">旗艦課程 · 主推 NGO／社福</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">Microsoft 365 Copilot 企業應用</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>Word：自動生成服務報告、申請書、會議紀錄</li>
                <li>Excel：個案數據統計、整理、自動生成圖表</li>
                <li>PowerPoint：活動匯報、董事會專業簡報製作</li>
                <li>Teams：會議自動記錄、摘要整理、工作跟進</li>
                <li>Outlook：快速草擬電郵、調整專業語氣</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                复用企業現有M365賬號，無需額外採購成本
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">全體員工</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">AI 辦公室應用</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>AI快速處理會議記錄、電郵、工作報告</li>
                <li>一鍵生成簡報、宣傳圖、社交媒體貼文</li>
                <li>智能整理雜亂數據、自動優化Excel報表</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                掌握提示詞技巧，全方位提升日常辦公效率
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">全體員工</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">網絡安全意識</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>識別釣魚電郵、社交工程詐騙風險</li>
                <li>規範密碼、賬戶管理，保護企業機密數據</li>
                <li>掌握突發安全事故應變與日常防護流程</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                企業定制場景教學，半日/全日靈活開班
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">行政・會計・營運</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">Python 數據分析</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>自動化資料輸入、表單填寫重複工作</li>
                <li>快速整理CSV/Excel數據、整合各部門報表</li>
                <li>搭建可重複使用的企業自動化流程</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                零基礎可學，手把手實操、逐步落地
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">學界專場</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">學界 AI 講座／工作坊</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>學生專屬AI科普講座、主題分享會</li>
                <li>AI網頁、小程序實戰開發工作坊</li>
                <li>AI美術生成、創意作品設計與展示</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                中小學定制課程，時長靈活可調整
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 進階層：核心/資深/IT團隊 進階課程 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-xl my-8">
        <div>
          <span className="inline-block px-3 py-1 bg-cyan-700 text-white rounded-full text-sm font-medium">進階層 · 核心團隊／資深員工／IT團隊</span>
          <h2 className="text-3xl font-light text-gray-700 mt-4 mb-2">搭建企業自有AI能力，實現長期轉型</h2>
          <p className="text-gray-600 font-light mb-8">
            針對企業核心骨幹與IT團隊，不止學會使用工具，更能自主搭建AI系統、自動化流程、私有化部署，打造企業專屬技術壁壘。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">AI Agent</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">Claude Agent Skill</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>搭建可自主辦公的企業AI助手</li>
                <li>定制Agent技能、完成業務場景串接</li>
                <li>從工具使用升級為企業AI生產系統</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                助力IT團隊搭建內部智能辦公體系
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">工作流自動化</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">MCP Workflow Automation</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>AI Agent對接企業內部各類系統</li>
                <li>跨部門、跨系統數據自動串接同步</li>
                <li>n8n/Python實作，落地自動化工作流</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                消除數據孤島，大幅節省重複工作成本
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">Microsoft 生態</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">M365 Workflow Automation</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>Power Automate搭建辦公自動化流程</li>
                <li>Copilot Studio定制企業專屬AI助手</li>
                <li>串接SharePoint/Teams/Outlook全生態</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                盘活現有M365資源，零新增成本升級
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">私有化部署</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">AI 本地部署（Local LLM）</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>Deepseek/Llama等開源模型本地搭建</li>
                <li>企業數據全程留內部、不上公有雲</li>
                <li>滿足金融、政府、社福高私隱需求</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                高保密企業專屬方案，杜絕數據洩露風險
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">資安進階</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">AI Cyber Security</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>運用AI智能偵測威脅、主動防禦風險</li>
                <li>洞悉AI時代新型網絡攻擊與防護技巧</li>
                <li>建立負責任AI應用與企業合規體系</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                強化企業資安壁壘，合規安全雙保障
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">組合方案</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">企業 AI 轉型（長線計劃）</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>6個月分階段落地，逐部門完成升級</li>
                <li>AI提示詞優化+企業工作流程梳理</li>
                <li>知識庫搭建+資安管控+落地實施規劃</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-500 text-sm">
                一站式服務：從免費評估到全面落地
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 點解揀 ITE 核心優勢 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-light text-gray-700 mb-2 text-center">完成課程，並非僅知其然</h2>
        <p className="text-gray-600 font-light text-center mb-10 max-w-2xl mx-auto">
          我們專注紮實的企業技術轉移，拒絕流水式理論教學，讓每一次培訓都能為企業創造實質價值。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">1</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">循序漸進、零門檻落地</h3>
            <p className="text-gray-600 text-sm">拋棄高深理論堆砌，由淺入深分階段教學，無論新舊員工都能跟得上、學得會、用得好。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">2</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">示範帶操、實戰教學</h3>
            <p className="text-gray-600 text-sm">導師先完整示範操作流程，再一對一帶領學員實操練習，杜絕「聽得懂、做不出」的問題。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">3</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">帶走即用、落地見效</h3>
            <p className="text-gray-600 text-sm">課後附送專屬模板、工作流程、實用小工具，學員即日可帶回公司應用，快速產生效益。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">4</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">資深導師、實戰經驗</h3>
            <p className="text-gray-600 text-sm">導師團隊平均15年行業實戰經歷，均為政商院校在職專業人士，拒絕純理論派教學。</p>
          </div>
        </div>
      </section>

      {/* 轉型諮詢 CTA 區塊 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-xl my-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">團隊科技轉型，由一次諮詢開始</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            不清楚適合的課程、資助方案或開班模式？無需自行摸索！留下企業需求，我們免費定制專屬培訓方案、核算資助金額、匹配合適班期。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <button className="px-6 py-3 bg-cyan-700 text-white rounded-3xl hover:bg-cyan-800 transition-colors">
                索取企業專屬培訓方案
              </button>
            </Link>
            <Link href="https://wa.me/85251001888" target="_blank" rel="noopener noreferrer">
              <button className="px-6 py-3 border-2 border-cyan-700 text-cyan-700 rounded-3xl hover:bg-cyan-50 transition-colors">
                WhatsApp 即時諮詢
              </button>
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">ITE 宏業創科教育｜九龍旺角彌敦道 610 號荷李活商業中心 1501 室</p>
        </div>
      </section>
    </div>
  );
}