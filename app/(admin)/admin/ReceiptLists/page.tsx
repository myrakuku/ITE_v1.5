// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface ReceiptData {
//   id: string;
//   title: string;
//   price: number;
//   Invoice_id: string;
//   total: number;
//   servetype: string;
//   studentname: string;
//   PaymentMethods: string[];
//   content: string[];
// }

// interface VoidData {
//   title: string;
//   price: number;
// }

// const ReceiptListsPage = () => {
//   const [GetReceiptData, setGetReceiptData] = useState<ReceiptData[]>([]);
//   const [GetVoidData, setGetVoidData] = useState<VoidData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | undefined>("");

//   useEffect(() => {
//     const fetchReceiptData = async () => {
//       try {
//         const res = await fetch("/api/Receipt_Lists");
//         if (!res.ok) {
//           throw new Error("無法載入收據資料");
//         }
//         const result = await res.json();
//         setGetReceiptData(Array.isArray(result) ? result : []);
//       } catch (err: any) {
//         console.error("載入錯誤:", err);
//         setError("無法載入收據資料");
//       }
//     };

//     const fetchVoidData = async () => {
//       try {
//         const res = await fetch("/api/Void_Lists");
//         if (!res.ok) {
//           throw new Error("無法載入補單資料");
//         }
//         const result = await res.json();
//         setGetVoidData(Array.isArray(result) ? result : []);
//       } catch (err: any) {
//         console.error("載入錯誤:", err);
//         setError("無法載入補單資料");
//       }
//     };

//     Promise.all([fetchReceiptData(), fetchVoidData()]).finally(() => {
//       setLoading(false);
//     });
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#80A8BD] flex justify-center items-center pt-20">
//         <p className="text-[#80A8BD] text-lg">正在加載...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#80A8BD] flex justify-center items-center pt-20">
//         <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#80A8BD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
//       <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-xl font-bold tracking-tight text-[#80A8BD]">
//             收據列表
//           </h1>
//           {/* <Link
//             href="/admin/ReceiptLists/createvoid"
//             className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
//           >
//             建立補單
//           </Link> */}
//         </div>
//         <div className="space-y-6">
//           {GetReceiptData.length > 0 ? (
//             GetReceiptData.map((d) => (
//               <Link
//                 key={d.id}
//                 href={`/admin/ReceiptLists/${d.id}`}
//                 className="block bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
//               >
//                 <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
//                 <p className="text-gray-900">服務類型: {d.servetype || "無"}</p>
//                 <p className="text-gray-900">學生姓名: {d.studentname || "無"}</p>
//               </Link>
//             ))
//           ) : (
//             <p className="text-gray-900">無收據資料</p>
//           )}
//           <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mt-8">
//             補單列表
//           </h2>
//           {GetVoidData.length > 0 ? (
//             GetVoidData.map((d, index) => (
//               <div
//                 key={index}
//                 className="bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
//               >
//                 <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
//                 <p className="text-gray-900">價錢: {d.price ?? "無"}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-900">無補單資料</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReceiptListsPage;

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // 新增 toast 導入以增強錯誤提示

interface ReceiptData {
  id: string;
  title: string;
  price: number;
  Invoice_id: string;
  servetype: string;
  studentname: string;
  PaymentMethods: string[];
  content: string[];
  isPayment: boolean; // 新增，與 Prisma 模式對齊
  DB: number; // 新增，與 Prisma 模式對齊
  adminFee: number; // 新增，與 Prisma 模式對齊
  createdAt: string; // 新增，與 Prisma 模式對齊
  updatedAt: string; // 新增，與 Prisma 模式對齊
}

interface VoidData {
  title: string;
  price: number;
}

const ReceiptListsPage = () => {
  const [GetReceiptData, setGetReceiptData] = useState<ReceiptData[]>([]);
  const [GetVoidData, setGetVoidData] = useState<VoidData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const res = await fetch("/api/Receipt_Lists");
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setGetReceiptData(Array.isArray(result) ? result : []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "無法載入收據資料";
        console.error("載入收據錯誤:", err);
        setError(errorMessage);
        toast.error(errorMessage); // 使用 toast 顯示錯誤
      }
    };

    const fetchVoidData = async () => {
      try {
        const res = await fetch("/api/Void_Lists");
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setGetVoidData(Array.isArray(result) ? result : []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "無法載入補單資料";
        console.error("載入補單錯誤:", err);
        setError(errorMessage);
        toast.error(errorMessage); // 使用 toast 顯示錯誤
      }
    };

    Promise.all([fetchReceiptData(), fetchVoidData()]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#80A8BD] flex justify-center items-center pt-20">
        <p className="text-[#80A8BD] text-lg">正在加載...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#80A8BD] flex justify-center items-center pt-20">
        <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#80A8BD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#80A8BD]">
            收據列表
          </h1>
          {/* <Link
            href="/admin/ReceiptLists/createvoid"
            className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            建立補單
          </Link> */}
        </div>
        <div className="space-y-6">
          {GetReceiptData.length > 0 ? (
            GetReceiptData.map((d) => (
              <Link
                key={d.id}
                href={`/admin/ReceiptLists/${d.id}`}
                className="block bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
              >
                <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
                <p className="text-gray-900">服務類型: {d.servetype || "無"}</p>
                <p className="text-gray-900">學生姓名: {d.studentname || "無"}</p>
                <p className="text-gray-900">
                  支付狀態: {d.isPayment ? "已付款" : "未付款"}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-900">無收據資料</p>
          )}
          <h2 className="text-xl font-bold tracking-tight text-[#80A8BD] mt-8">
            補單列表
          </h2>
          {GetVoidData.length > 0 ? (
            GetVoidData.map((d, index) => (
              <div
                key={index}
                className="bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
              >
                <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
                <p className="text-gray-900">價錢: {d.price ?? "無"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-900">無補單資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptListsPage;