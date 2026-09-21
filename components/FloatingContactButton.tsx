'use client';
import React, { useState, useEffect } from 'react';
import { MessageCircleMore, Building2, X } from 'lucide-react';
import Link from "next/link";

type FormDataType = {
  orgtype: string;
  course: string;
  company: string;
  contact: string;
  title: string;
  headcount: string;
  duration: string;
  mode: string;
  location: string;
  contactinfo: string;
  note: string;
};

const initialForm: FormDataType = {
  orgtype: '',
  course: '',
  company: '',
  contact: '',
  title: '',
  headcount: '',
  duration: '',
  mode: '',
  location: '',
  contactinfo: '',
  note: '',
};

export default function FloatingContactButton() {
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(initialForm);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setIsSubmitted(false);
    setFormData(initialForm);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData(initialForm);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('提交失敗，請稍後再試或透過WhatsApp聯絡我們');
      }
    } catch (err) {
      alert('網路異常，提交失敗，請稍後再試或透過WhatsApp聯絡我們');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {expanded && (
          <>
            <button
              id='navbar-cform'
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-700 text-white py-3 px-5 rounded-full shadow-xl hover:bg-cyan-800 transition-all duration-300 flex items-center space-x-2"
            >
              <Building2 className="text-xl" />
              <span className="font-medium whitespace-nowrap">企業查詢</span>
            </button>
            <Link
              id='navbar-wsbutton'
              href="https://wa.me/51001888"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white py-3 px-5 rounded-full shadow-xl hover:bg-green-600 transition-all duration-300 flex items-center space-x-2"
              aria-label="WhatsApp查詢"
            >
              <MessageCircleMore className="text-xl" />
              <span className="font-medium whitespace-nowrap">WhatsApp查詢</span>
            </Link>
          </>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-cyan-700 text-white w-14 h-14 rounded-full shadow-xl hover:bg-cyan-800 transition-all duration-300 flex items-center justify-center"
        >
          {expanded ? <X className="text-2xl" /> : <MessageCircleMore className="text-2xl" />}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 md:p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <span className="text-cyan-700 text-sm font-medium">NITTP 政府資助課程 · 認可培訓機構</span>
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-2">索取企業培訓方案</h1>
                  <p className="text-gray-600 mt-2">留下資料，我們會於 1 個工作天內回覆您，了解您的培訓需要。</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="field">
                    <label className="block text-gray-800 mb-1">貴機構類型 <span className="text-red-500">*</span></label>
                    <select
                      name="orgtype"
                      value={formData.orgtype}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">請選擇</option>
                      <option>企業／商業公司</option>
                      <option>社福機構／NGO</option>
                      <option>學校／教育機構</option>
                      <option>政府／公營機構</option>
                      <option>個人報讀</option>
                      <option>其他</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="block text-gray-800 mb-1">培訓需求 <span className="text-red-500">*</span></label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">請選擇（可於備註列明多項）</option>
                      <optgroup label="辦公室應用">
                        <option>員工運用 AI 處理文書（會議紀錄、電郵、通告、報告）</option>
                        <option>員工運用 AI 製作簡報、圖像、社交媒體素材</option>
                        <option>員工運用 AI 整理資料、處理 Excel／報表</option>
                      </optgroup>
                      <optgroup label="企業進階（核心團隊／資深員工／IT 團隊）">
                        <option>建立內部 AI 同事（Claude Agent Skill）</option>
                        <option>運用 MCP 將 AI 接上公司系統（Workflow Automation）</option>
                        <option>運用 Power Automate／Copilot Studio 自動化 M365 流程</option>
                        <option>AI 資料留於公司、私有化部署（Local LLM）</option>
                        <option>運用 AI 進行資安防禦（AI Cyber Security）</option>
                        <option>部門級 AI 流程優化（RAG／流程自動化）</option>
                      </optgroup>
                      <optgroup label="數據">
                        <option>員工運用 Python 處理數據、製作分析報表</option>
                      </optgroup>
                      <optgroup label="資安">
                        <option>員工防範釣魚電郵、保護公司資料</option>
                      </optgroup>
                      <optgroup label="學界">
                        <option>舉辦 AI 講座／分享會（學生）</option>
                        <option>舉辦 AI 網頁／小程序工作坊</option>
                      </optgroup>
                      <optgroup label="其他">
                        <option>尚未確定，希望諮詢</option>
                      </optgroup>
                    </select>
                    <p className="text-gray-500 text-sm mt-1">不確定可選「尚未確定，希望諮詢」，並於備註補充。</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="field">
                      <label className="block text-gray-800 mb-1">公司名稱 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="貴公司名稱"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="field">
                      <label className="block text-gray-800 mb-1">稱呼 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        placeholder="聯絡人姓名"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="field">
                      <label className="block text-gray-800 mb-1">參加人數 <span className="text-red-500">*</span></label>
                      <select
                        name="headcount"
                        value={formData.headcount}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">請選擇</option>
                        <option>20 人以下</option>
                        <option>21 – 50 人</option>
                        <option>51 – 100 人</option>
                        <option>101 – 200 人</option>
                        <option>200 人以上</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="block text-gray-800 mb-1">時長要求</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">請選擇</option>
                        <option>半日（4 小時）</option>
                        <option>一日（6–8 小時）</option>
                        <option>多日／長期計劃</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="field">
                      <label className="block text-gray-800 mb-1">上課模式</label>
                      <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">請選擇</option>
                        <option>包班（導師上門）</option>
                        <option>到校（旺角）</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="block text-gray-800 mb-1">上課地區<span className="text-gray-500 text-sm">（如有）</span></label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="例如：荃灣／旺角／港島"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="block text-gray-800 mb-1">聯絡電話／電郵 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="contactinfo"
                      value={formData.contactinfo}
                      onChange={handleChange}
                      required
                      placeholder="電話或電郵，方便我們聯絡"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="field">
                    <label className="block text-gray-800 mb-1">備註</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={4}
                      placeholder="例如：希望培訓時間、特別需求等"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-cyan-700 text-white rounded-3xl hover:bg-cyan-800 transition-colors disabled:opacity-60"
                  >
                    {loading ? '提交中...' : '送出查詢'}
                  </button>
                  <p className="text-gray-500 text-sm">提交後，我們會經電話或WhatsApp回覆您。資料僅用作跟進培訓查詢。</p>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl text-green-500 mb-4">✓</div>
                <h2 className="text-2xl font-semibold text-gray-800">查詢已送出</h2>
                <p className="text-gray-600 mt-3">
                  感謝您的查詢。我們會於 1 個工作天內，經電話或 WhatsApp 聯絡您，了解您的培訓需要。
                </p>
                <button
                  id="ite-corporate-mail"
                  onClick={resetForm}
                  className="mt-6 px-6 py-3 bg-cyan-700 text-white rounded-full hover:bg-cyan-800 transition-colors"
                >
                  再次送出查詢
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
