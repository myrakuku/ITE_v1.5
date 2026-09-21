// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleMap from '@/components/GoogleMap';

export default function ContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    services: [] as string[],
    contactType: '',
    details: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => {
        const current = prev.services;
        if (checked) {
          return { ...prev, services: [...current, value] };
        } else {
          return { ...prev, services: current.filter((s) => s !== value) };
        }
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          services: [],
          contactType: '',
          details: '',
        });
      } else {
        alert('提交失敗，請稍後再試或透過WhatsApp聯絡我們');
      }
    } catch (err) {
      alert('提交失敗，請稍後再試或透過WhatsApp聯絡我們');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">聯絡我們</h1>
          <p className="mt-2 text-gray-600 font-light">
            有任何問題或需求，歡迎填寫以下表單，我們將於 1 個工作天內與您聯絡
          </p>
        </div>

        {!submitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左側 Google Map */}
            <div className="bg-white border border-gray-100">
              <GoogleMap />
            </div>

            {/* 右側 聯絡表單 */}
            <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 姓名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    稱呼 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="請輸入您的姓名"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                {/* 電話 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電話 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="請輸入您的聯絡電話"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                {/* 電郵 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    電郵 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="請輸入您的電子郵件"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                {/* 感興趣服務（多選） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    感興趣的產品 / 服務類型（可多選）
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '課程諮詢',
                      '教材購買',
                      '培訓服務',
                      '合作提案',
                      '技術支援',
                      '其他產品',
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center p-3 border rounded-lg cursor-pointer transition border-gray-200 hover:border-cyan-400 hover:bg-cyan-50"
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={item}
                          checked={formData.services.includes(item)}
                          onChange={handleChange}
                          className="mr-2 accent-cyan-700"
                        />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 聯絡類型（單選） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    類型 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['個人', '團體', '公司', '其他'].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center px-4 py-2 border rounded-full cursor-pointer transition ${
                          formData.contactType === type
                            ? 'border-cyan-700 bg-cyan-50 text-cyan-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactType"
                          value={type}
                          checked={formData.contactType === type}
                          onChange={handleChange}
                          required
                          className="mr-2 accent-cyan-700"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 詳細內容 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    詳細內容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="details"
                    rows={4}
                    value={formData.details}
                    onChange={handleChange}
                    required
                    placeholder="請詳細描述您的需求或問題..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-y"
                  />
                </div>

                {/* 按鈕 */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-cyan-700 text-white rounded-3xl font-medium hover:bg-cyan-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '提交中…' : '提交表單'}
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-3xl font-medium hover:bg-gray-200 transition"
                  >
                    返回
                  </button> */}
                </div>

                <p className="text-gray-500 text-sm text-center">
                  提交後，我們會經電郵／WhatsApp 回覆您。資料僅用作跟進查詢。
                </p>
              </form>
            </div>
          </div>
        ) : (
          // 提交成功畫面
          <div className="bg-white shadow-sm rounded-xl p-12 border border-gray-100 text-center">
            <div className="text-5xl text-green-500 mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-gray-800">查詢已送出</h2>
            <p className="text-gray-600 mt-3 max-w-md mx-auto">
              感謝您的查詢。我們會於 1 個工作天內，經電郵或 WhatsApp 回覆您。
            </p>
            <button
              onClick={resetForm}
              className="mt-6 px-6 py-3 bg-cyan-700 text-white rounded-3xl hover:bg-cyan-800 transition-colors"
            >
              再次填寫
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
