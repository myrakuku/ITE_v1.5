import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/Logo_Blue.png';
import hero from '../../public/banner.jpg';

export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 企業培訓首屏區｜突出NITTP資助與課程核心價值 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 items-stretch">
          <div className="bg-gray-200 min-h-[50vh] md:min-h-[70vh] rounded-l-lg overflow-hidden">
            <Image
              src={hero}
              alt="企業AI培訓｜技術轉移落地"
              width={1200}
              height={800}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <p className="text-gray-400 font-light mb-3">ITE 宏業創科教育｜新型工業化及科技培訓計劃（NITTP）認可培訓機構</p>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">企業AI培訓｜不止課堂教學</h2>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">直接將AI工作流程導入貴機構</h2>
            <p className="text-gray-600 font-light mb-8 leading-relaxed">
              有別於一般理論導向培訓，ITE主打企業技術轉移服務：將成熟的AI工具、營運流程與實務方法，完整移植至貴企業。確保員工不只掌握概念，課後可即時落地執行，協助機構減省文書處理、數據整理等重複性工作，實現降本增效與數碼轉型。
              <br /><br />
              企業報讀可申請政府資助，最高可獲50%課程資助，降低團隊數碼升級成本。
            </p>
            <div>
              <Link href="/contact">
                <button className="px-5 py-2 border-gray-700 border-2 text-gray-800 rounded-3xl hover:bg-gray-800 hover:text-white transition-colors">
                  索取企業專屬培訓方案
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 企業技術轉移核心價值 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">企業AI技術轉移：非理論課程，重視落地成效</h3>
        <p className="text-gray-600 mt-6 font-bold">
          並非單純授課，而是將成熟的企業AI營運能力導入貴機構。
        </p>
        <p className="text-gray-600 mt-1 font-light">
          市面上多數培訓僅教授工具操作，員工完成課程返回崗位後，往往難以應用。ITE之技術轉移服務會按企業所屬行業、崗位分工及現有系統，定制專屬培訓方案；透過實務演練，交付可直接重用的模板與工作流程，解決「學習後難以落地」的常見痛點。
        </p>
        <p className="text-gray-600 mt-6 font-bold">
          NITTP政府資助｜降低企業培訓開支
        </p>
        <p className="text-gray-600 mt-1 font-light">
          本機構為新型工業化及科技培訓計劃認可培訓單位，企業報讀課程可申請資助，最高可獲50%資助。我們會協助處理資助申請手續，協助機構以較低成本完成團隊科技升級。
        </p>
      </section>

      {/* 工具匹配區｜不綁定單一工具，配合企業現有系統 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-xl my-8">
        <h2 className="text-3xl font-light text-gray-700 mb-2">不綁定單一工具，配合企業現有系統生態</h2>
        <p className="text-gray-600 font-light mb-8">
          拒絕模板化教學！我們依據貴機構現有使用之系統與工具定制課程，學員所學內容可直接應用，減少磨合成本，即日落地。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-4 text-left text-gray-700 font-medium">適配工具</th>
                <th className="py-4 text-left text-gray-700 font-medium">企業價值</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Microsoft 365 Copilot</span></td>
                <td className="py-4 text-gray-600">沿用現有M365帳戶，實現文書、會議記錄、報告自動化，適合非政府組織、社福機構及公營單位</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Claude</span></td>
                <td className="py-4 text-gray-600">長文本分析、專業報告撰寫，適合管理層、專業團隊及AI智能代理開發</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Hermes（開源模型）</span></td>
                <td className="py-4 text-gray-600">本地部署方案，數據無需上載至公有雲，適合對資料私隱有高要求之企業</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Codex</span></td>
                <td className="py-4 text-gray-600">程式碼生成、腳本自動化，適合IT團隊技術進階開發</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Gemini</span></td>
                <td className="py-4 text-gray-600">整合Google生態，適合採用Google Workspace的企業及機構</td>
              </tr>
              <tr>
                <td className="py-4"><span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm">Deepseek</span></td>
                <td className="py-4 text-gray-600">成本可控，支援本地部署，適合不希望內部數據上雲的企業</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 基礎課程：全體員工普及培訓 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">基礎層 · 適合全體員工</span>
          <h2 className="text-3xl font-light text-gray-700 mt-4 mb-2">基礎AI能力培訓 · 覆蓋各崗位日常工作</h2>
          <p className="text-gray-600 font-light mb-8">
            無需技術基礎！課程為一般員工而設，快速掌握AI辦公技巧，處理文書、數據、簡報製作，同時建立資安基本認知，全面提升團隊基礎效率。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-cyan-700 text-white rounded-full text-xs font-medium">旗艦課程 · 主推非政府組織／社福機構</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">Microsoft 365 Copilot 企業應用</h3>
              <p className="text-gray-600 text-sm mb-3">直接使用貴機構現有M365帳戶，無需額外採購，快速自動化文書及會議相關工作</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>Word：自動生成服務報告、申請文件、會議紀錄</li>
                <li>Excel：個案數據統計、整理，自動生成圖表</li>
                <li>PowerPoint：活動匯報、董事會專業簡報製作</li>
                <li>Teams：會議自動記錄、摘要整理、工作跟進</li>
                <li>Outlook：快速草擬電郵，調整專業語氣</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">全體員工</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">AI辦公室應用</h3>
              <p className="text-gray-600 text-sm mb-3">掌握提示詞設計技巧，全方位提升日常辦公效率</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>利用AI處理會議記錄、電郵、工作報告</li>
                <li>一鍵生成簡報、宣傳圖像、社交媒體內容</li>
                <li>智能整理雜亂數據，優化Excel報表</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">全體員工</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">網絡安全意識</h3>
              <p className="text-gray-600 text-sm mb-3">按企業場景定制教學，可安排半日或全日課程，保護企業機密資料</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>辨識釣魚電郵及社交工程類型詐騙風險</li>
                <li>建立密碼及帳戶管理規範，保護企業機密數據</li>
                <li>認識資安事故應變機制與日常防護流程</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">行政・會計・營運</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">Python數據分析</h3>
              <p className="text-gray-600 text-sm mb-3">零基礎可修讀，協助行政、會計人員自動化重複資料整理工作</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>自動化資料輸入、表單填寫等重複工序</li>
                <li>快速整理CSV/Excel數據，整合各部門報表</li>
                <li>建立可重複使用的企業自動化流程</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 進階課程：核心團隊、資深員工、IT團隊 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-xl my-8">
        <div>
          <span className="inline-block px-3 py-1 bg-cyan-700 text-white rounded-full text-sm font-medium">進階層 · 核心團隊／資深員工／IT團隊</span>
          <h2 className="text-3xl font-light text-gray-700 mt-4 mb-2">建立企業自有AI能力，實現長遠數碼轉型</h2>
          <p className="text-gray-600 font-light mb-8">
            課程針對企業骨幹及IT團隊設計，除工具應用外，更可學習搭建AI系統、自動化工作流程及私有化部署，建立企業專屬技術優勢。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">AI Agent</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">Claude Agent Skill</h3>
              <p className="text-gray-600 text-sm mb-3">協助IT團隊搭建內部智能辦公助手，自動處理各類業務場景</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>搭建可自主執行辦公任務的企業AI助手</li>
                <li>定制Agent功能，串接各類業務場景</li>
                <li>由工具應用升級至企業AI生產系統</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">工作流自動化</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">MCP Workflow Automation</h3>
              <p className="text-gray-600 text-sm mb-3">消除數據孤島，跨系統自動同步資料，節省大量重複工作成本</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>AI Agent連接企業內部各類系統</li>
                <li>跨部門、跨系統自動同步數據</li>
                <li>透過n8n/Python實作，落地自動化工作流程</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">Microsoft 生態</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">M365 Workflow Automation</h3>
              <p className="text-gray-600 text-sm mb-3">善用現有M365資源，無需新增軟件成本即可優化內部流程</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>使用Power Automate搭建辦公自動化流程</li>
                <li>透過Copilot Studio開發企業專屬AI助手</li>
                <li>串接SharePoint、Teams、Outlook整個生態</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">私有化部署</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">AI本地部署（Local LLM）</h3>
              <p className="text-gray-600 text-sm mb-3">高保密企業專屬方案，內部數據無需上載公有雲，避免資料外洩風險</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>搭建Deepseek、Llama等開源模型本地環境</li>
                <li>企業數據全程保留於內部，不上公有雲</li>
                <li>適合金融、政府、社福等對私隱要求嚴格的機構</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">資安進階</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">AI Cyber Security</h3>
              <p className="text-gray-600 text-sm mb-3">強化企業資安防護，建立AI時代的合規管理體系</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>運用AI智能偵測威脅，執行主動防禦</li>
                <li>認識AI衍生的新型網絡攻擊及防護方法</li>
                <li>建立負責任AI應用準則與企業合規制度</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-block px-3 py-1 bg-gray-700 text-white rounded-full text-xs font-medium">組合方案</span>
              <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-3">企業AI轉型（長遠計劃）</h3>
              <p className="text-gray-600 text-sm mb-3">一站式服務：由免費評估開始，分階段推動企業AI轉型</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                <li>為期六個月分階段落地，按部門逐步升級</li>
                <li>優化提示詞設計，梳理企業工作流程</li>
                <li>搭建知識庫、資安管控及落地執行規劃</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 選擇ITE的核心優勢 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-light text-gray-700 mb-2 text-center">選擇ITE作企業AI技術轉移服務的理由</h2>
        <p className="text-gray-600 font-light text-center mb-10 max-w-2xl mx-auto">
          我們專注提供紮實的企業技術轉移，拒絕流水式理論教學，確保每項培訓均可為企業帶來實質效益。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">1</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">循序漸進，易於落地</h3>
            <p className="text-gray-600 text-sm">避免大量高深理論，由淺入深分階段教學，不論新舊員工皆可掌握並應用。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">2</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">示範與實操並重</h3>
            <p className="text-gray-600 text-sm">導師先完整示範操作流程，再個別帶領學員實習，避免「聽得懂但無法執行」的情況。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">3</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">配套資源，即時應用</h3>
            <p className="text-gray-600 text-sm">課後提供專屬模板、工作流程及工具，學員可於課後直接於機構內使用，快速產生效益。</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white font-bold mb-4">4</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">資深導師，具備實戰經驗</h3>
            <p className="text-gray-600 text-sm">導師團隊平均擁有15年行業實務經驗，均為政商學界在職專業人士，並非純理論教學。</p>
          </div>
        </div>
      </section>

      {/* 常見問題 FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-xl my-8">
        <h2 className="text-3xl font-light text-gray-700 mb-8 text-center">常見問題</h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">NITTP資助申請流程為何？</h4>
            <p className="text-gray-600">我們會協助企業處理資助申請手續，課程完成後按計劃申請最高50%資助。</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">課程可於貴機構辦公地點進行嗎？</h4>
            <p className="text-gray-600">可以，課程可選擇於貴機構場地、網上形式或我們旺角課室進行，班期可彈性安排半日或全日。</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">課程完結後是否提供後續支援？</h4>
            <p className="text-gray-600">課後提供模板、標準作業程序（SOP），並設短期跟進支援，協助團隊處理落地階段遇到的問題。</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">除企業培訓外，是否設有學界課程？</h4>
            <p className="text-gray-600">設有，另備中小學AI講座及工作坊，歡迎另行查詢。</p>
          </div>
        </div>
      </section>

      {/* 諮詢CTA區塊 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-xl my-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">團隊科技轉型，由一次免費諮詢開始</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            若未能確定合適課程、資助方案或開班模式，無需自行摸索。提交貴機構需求，我們可免費定制專屬培訓方案、核算資助金額及建議合適班期。
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
        </div>
      </section>
    </div>
  );
}
