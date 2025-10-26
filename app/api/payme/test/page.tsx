// 'use client';

// import { useState } from 'react';

// export default function PayMeTestPage() {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [amount, setAmount] = useState('0.81'); // 默認觸發成功支付場景

//   const testScenarios = [
//     { value: '0.81', label: '成功支付 (0.81)' },
//     { value: '0.80', label: '正常過期 (0.80)' },
//     { value: '0.44', label: '服務器錯誤 - 無 PayCode (0.44)' },
//     { value: '0.45', label: '服務器錯誤 - 無狀態 (0.45)' },
//     { value: '0.77', label: '支付失敗 (0.77)' },
//   ];

//   const createTestPayment = async (testAmount: string) => {
//     setLoading(true);
//     setResult(null);

//     try {
//       const response = await fetch('/api/payme/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: 'test-user-' + Date.now(),
//           amount: parseFloat(testAmount),
//           description: '測試支付',
//           items: [
//             {
//               productId: 'test-product-1',
//               quantity: 1,
//               real_price: parseFloat(testAmount),
//             },
//           ],
//         }),
//       });

//       const data = await response.json();
//       setResult(data);

//       if (data.paymentUrl) {
//         // 在新窗口打開支付頁面
//         window.open(data.paymentUrl, '_blank');
//       }
//     } catch (error) {
//       setResult({ error: '請求失敗: ' + error });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6">PayMe 測試工具</h1>
      
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-4">測試場景</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {testScenarios.map((scenario) => (
//             <button
//               key={scenario.value}
//               onClick={() => {
//                 setAmount(scenario.value);
//                 createTestPayment(scenario.value);
//               }}
//               disabled={loading}
//               className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
//             >
//               <div className="font-medium">{scenario.label}</div>
//               <div className="text-sm text-gray-600">點擊測試</div>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-2">
//           自定義金額:
//         </label>
//         <input
//           type="number"
//           step="0.01"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           className="p-2 border rounded mr-2"
//         />
//         <button
//           onClick={() => createTestPayment(amount)}
//           disabled={loading}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
//         >
//           {loading ? '處理中...' : '測試支付'}
//         </button>
//       </div>

//       {result && (
//         <div className="mt-6 p-4 border rounded">
//           <h3 className="font-semibold mb-2">響應結果:</h3>
//           <pre className="bg-gray-100 p-4 rounded overflow-auto">
//             {JSON.stringify(result, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState } from 'react';

// 定義 PaymeResult 類型
interface PaymeResult {
  paymentUrl?: string;
  orderId?: string;
  paymentId?: string;
  error?: string;
  details?: string;
}

export default function PayMeTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymeResult | null>(null);
  const [amount, setAmount] = useState('0.81'); // 默認觸發成功支付場景

  const testScenarios = [
    { value: '0.81', label: '成功支付 (0.81)' },
    { value: '0.80', label: '正常過期 (0.80)' },
    { value: '0.44', label: '服務器錯誤 - 無 PayCode (0.44)' },
    { value: '0.45', label: '服務器錯誤 - 無狀態 (0.45)' },
    { value: '0.77', label: '支付失敗 (0.77)' },
  ];

  const createTestPayment = async (testAmount: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/payme/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-' + Date.now(),
          amount: parseFloat(testAmount),
          description: '測試支付',
          items: [
            {
              productId: 'test-product-1',
              quantity: 1,
              real_price: parseFloat(testAmount),
            },
          ],
        }),
      });

      const data: PaymeResult = await response.json();
      setResult(data);

      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      }
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : '請求失敗' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">PayMe 測試工具</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">測試場景</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testScenarios.map((scenario) => (
            <button
              key={scenario.value}
              onClick={() => {
                setAmount(scenario.value);
                createTestPayment(scenario.value);
              }}
              disabled={loading}
              className="p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="font-medium">{scenario.label}</div>
              <div className="text-sm text-gray-600">點擊測試</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          自定義金額:
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={() => createTestPayment(amount)}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '處理中...' : '測試支付'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">響應結果:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}