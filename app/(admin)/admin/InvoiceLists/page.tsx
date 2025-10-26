

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface InvoiceData {
//   id: string;
//   title: string;
//   content: string;
//   price: number;
//   servetype: string;
// }

// const InvoiceListsPage = () => {
//   const [GetInvoiceData, setGetInvoiceData] = useState<InvoiceData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | undefined>("");

//   useEffect(() => {
//     const fetchInvoiceData = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("/api/Invoice_Lists");
//         if (!res.ok) {
//           throw new Error("無法載入單據資料");
//         }
//         const result = await res.json();
//         setGetInvoiceData(Array.isArray(result) ? result : []);
//       } catch (error: any) {
//         console.error("Error fetching invoice data:", error);
//         setError("無法載入單據資料");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInvoiceData();
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
//             單據列表
//           </h1>
//           <Link
//             href="/admin/InvoiceLists/createInvoice"
//             className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
//           >
//             建立單據
//           </Link>
//         </div>
//         <div className="space-y-6">
//           {GetInvoiceData.length > 0 ? (
//             GetInvoiceData.map((d) => (
//               <Link
//                 key={d.id}
//                 href={`/admin/InvoiceLists/${d.id}`}
//                 className="block bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
//               >
//                 <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
//                 <p className="text-gray-900">服務類型: {d.servetype || "無"}</p>
//               </Link>
//             ))
//           ) : (
//             <p className="text-gray-900">無單據資料</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceListsPage;

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface InvoiceData {
  id: string;
  title: string;
  content: string[]; // 更新為 string[] 以匹配 Prisma 模式
  price: number;
  servetype: string;
  studentname: string; // 新增，與 Prisma 模式對齊
  Invoice_id: string; // 新增，與 Prisma 模式對齊
  isPayment: boolean; // 新增，與 Prisma 模式對齊
  PaymentMethods: string[]; // 新增，與 Prisma 模式對齊
  createdAt: string; // 新增，與 Prisma 模式對齊
  updatedAt: string; // 新增，與 Prisma 模式對齊
  student_id: string; // 新增，與 Prisma 模式對齊
}

const InvoiceListsPage = () => {
  const [GetInvoiceData, setGetInvoiceData] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>("");

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/Invoice_Lists");
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setGetInvoiceData(Array.isArray(result) ? result : []);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "無法載入單據資料";
        console.error("Error fetching invoice data:", error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceData();
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
            單據列表
          </h1>
          <Link
            href="/admin/InvoiceLists/createInvoice"
            className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            建立單據
          </Link>
        </div>
        <div className="space-y-6">
          {GetInvoiceData.length > 0 ? (
            GetInvoiceData.map((d) => (
              <Link
                key={d.id}
                href={`/admin/InvoiceLists/${d.id}`}
                className="block bg-white border border-[#80A8BD]/20 p-4 rounded-md hover:bg-[#80A8BD]/10 transition-colors duration-300"
              >
                <p className="text-[#80A8BD] font-medium">{d.title || "無標題"}</p>
                <p className="text-gray-900">服務類型: {d.servetype || "無"}</p>
                <p className="text-gray-900">學生姓名: {d.studentname || "無"}</p> {/* 新增顯示學生姓名 */}
                <p className="text-gray-900">
                  支付狀態: {d.isPayment ? "已付款" : "未付款"} {/* 新增顯示支付狀態 */}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-900">無單據資料</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceListsPage;