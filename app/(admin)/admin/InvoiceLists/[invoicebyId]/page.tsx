// "use client";

// import { startTransition, useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation"; // 新增 useRouter 導入
// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { IsPay_Change_Schema } from "@/app/actions/Change-IsPay/schema";
// import { IsPay_Change_Action } from "@/app/actions/Change-IsPay";


// interface InvoiceData {
//   id: string;
//   title: string;
//   studentname: string;
//   servetype: string;
//   price: number;
//   content: string[];
//   PaymentMethods: string[];
//   createdAt: string;
//   updatedAt: string;
//   isPayment: boolean;
//   student_id: string;
// }

// const InvoiceDetail = () => {
//   const param = useParams();
//   const invoiceId = param?.InvoicebyID as string;
//   const router = useRouter(); // 新增 router
//   const [GetInvoiceByIdData, setGetInvoiceByIdData] = useState<InvoiceData[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [success, setSuccess] = useState<string | undefined>("");

//   const form = useForm<z.infer<typeof IsPay_Change_Schema>>({
//     resolver: zodResolver(IsPay_Change_Schema),
//     defaultValues: {
//       invoiceId: invoiceId,
//       IsPay: true,
//     },
//   });

//   useEffect(() => {
//     const fetchInvoiceByIdData = async (id: string) => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/InvoiceLists_detail_data_by_id/${id}`);
//         if (!res.ok) {
//           throw new Error("無法獲取發票數據");
//         }
//         const result = await res.json();
//         setGetInvoiceByIdData(result);
//       } catch (error: any) {
//         console.error("獲取發票數據失敗:", error);
//         setError("無法載入發票數據");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (invoiceId) {
//       fetchInvoiceByIdData(invoiceId);
//     }
//   }, [invoiceId]);

// const onSubmit = async (values: z.infer<typeof IsPay_Change_Schema>) => {
//     console.log("-- change data -- : ", values, " -- End -- ");
//     setError("");
//     setSuccess("");

//     startTransition(async () => {
//       const result = await IsPay_Change_Action(values); // 等待 action 回傳
//       if (result.error) {
//         setError(result.error); // 顯示錯誤
//       } else {
//         setSuccess("操作成功"); // 可選：顯示成功訊息
//         router.push('/admin/InvoiceLists/'); // client-side 導航
//       }
//     });
//   };

//   if (loading) {
//     return (
//       <div className="pt-16 min-h-screen bg-gray-50 p-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <span className="text-[#80A8BD] animate-pulse">載入發票數據中...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="pt-16 min-h-screen bg-gray-50 p-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-red-500 font-medium">錯誤: {error}</h2>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (GetInvoiceByIdData.length === 0) {
//     return (
//       <div className="pt-16 min-h-screen bg-gray-50 p-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white p-6 rounded-lg shadow-md text-center">
//             <p className="text-gray-500">未找到發票數據</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-16 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="p-6">
//             <h1 className="text-2xl font-bold text-[#80A8BD] mb-6">發票詳情</h1>
            
//             {GetInvoiceByIdData.map((d) => (
//               <div key={d.id} className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* 基本信息 */}
//                   <div className="space-y-4">
//                     <div>
//                       <h2 className="text-xl font-semibold text-gray-800">{d.title}</h2>
//                     </div>
//                     <div className="space-y-2">
//                       <p className="text-gray-700"><span className="font-medium">學生姓名：</span>{d.studentname}</p>
//                       <p className="text-gray-700"><span className="font-medium">服務類型：</span>{d.servetype}</p>
//                       <p className="text-gray-700"><span className="font-medium">價格：</span>${d.price}</p>
//                     </div>
//                   </div>

//                   {/* 支付状态 */}
//                   <div className="space-y-4">
//                     <div className="flex items-center">
//                       <span className="font-medium text-gray-700 mr-2">支付狀態：</span>
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         d.isPayment ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                       }`}>
//                         {d.isPayment ? "已付款" : "未付款"}
//                       </span>
//                     </div>
//                     <div>
//                       <Form {...form}>
//                         <form onSubmit={form.handleSubmit(onSubmit)}>
//                           <Button 
//                             type="submit" 
//                             disabled={d.isPayment}
//                             className={`w-full md:w-auto ${
//                               d.isPayment 
//                                 ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
//                                 : "bg-[#80A8BD] hover:bg-[#d9824c] text-white"
//                             }`}
//                           >
//                             {d.isPayment ? "已付款" : "標記為已付款"}
//                           </Button>
//                         </form>
//                       </Form>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 内容详情 */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-[#80A8BD]">
//                   <h3 className="text-lg font-semibold text-[#80A8BD] mb-3">內容詳情</h3>
//                   <div className="space-y-2">
//                     {d.content.length > 0 ? (
//                       <ul className="list-disc pl-5 space-y-1">
//                         {d.content.map((item, index) => (
//                           <li key={index} className="text-gray-700">{item}</li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500">無內容</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 支付方式 */}
//                 <div className="bg-gray-50 p-4 rounded-lg border border-[#80A8BD]">
//                   <h3 className="text-lg font-semibold text-[#80A8BD] mb-3">支付方式</h3>
//                   <div className="space-y-2">
//                     {d.PaymentMethods.length > 0 ? (
//                       <ul className="list-disc pl-5 space-y-1">
//                         {d.PaymentMethods.map((pay, payIndex) => (
//                           <li key={payIndex} className="text-gray-700">{pay}</li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500">無支付方式</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* 时间信息 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
//                   <p><span className="font-medium">創建時間：</span>{new Date(d.createdAt).toLocaleString()}</p>
//                   <p><span className="font-medium">更新時間：</span>{new Date(d.updatedAt).toLocaleString()}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetail;

"use client";

import { startTransition, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IsPay_Change_Schema } from "@/app/actions/Change-IsPay/schema";
import { IsPay_Change_Action } from "@/app/actions/Change-IsPay";
import { toast } from "sonner"; // 新增 toast 導入

interface InvoiceData {
  id: string;
  title: string;
  studentname: string;
  servetype: string;
  price: number;
  content: string[];
  PaymentMethods: string[];
  createdAt: string;
  updatedAt: string;
  isPayment: boolean;
  student_id: string;
}

const InvoiceDetail = () => {
  const param = useParams();
  const invoiceId = param?.InvoicebyID as string;
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null); // 修改為單個物件
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm<z.infer<typeof IsPay_Change_Schema>>({
    resolver: zodResolver(IsPay_Change_Schema),
    defaultValues: {
      invoiceId: invoiceId,
      IsPay: true,
    },
  });

  useEffect(() => {
    const fetchInvoiceByIdData = async (id: string) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/InvoiceLists_detail_data_by_id/${id}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();
        if (result.error) {
          throw new Error(result.error);
        }
        setInvoiceData(result); // 假設 API 返回單個物件
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "無法載入發票數據";
        console.error("獲取發票數據失敗:", error);
        setError(errorMessage);
        toast.error(errorMessage); // 使用 toast 顯示錯誤
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceByIdData(invoiceId);
    }
  }, [invoiceId]);

  const onSubmit = async (values: z.infer<typeof IsPay_Change_Schema>) => {
    console.log("-- change data -- : ", values, " -- End -- ");
    setError(null);

    startTransition(async () => {
      const result = await IsPay_Change_Action(values);
      if (result.error) {
        setError(result.error);
        toast.error(result.error); // 使用 toast 顯示錯誤
      } else {
        toast.success("發票已標記為已付款"); // 使用 toast 顯示成功訊息
        router.push("/admin/InvoiceLists/");
      }
    });
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <span className="text-[#80A8BD] animate-pulse">載入發票數據中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-red-500 font-medium">錯誤: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">未找到發票數據</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#80A8BD] mb-6">發票詳情</h1>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{invoiceData.title}</h2>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-medium">學生姓名：</span>{invoiceData.studentname}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">服務類型：</span>{invoiceData.servetype}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">價格：</span>${invoiceData.price}
                    </p>
                  </div>
                </div>

                {/* 支付狀態 */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">支付狀態：</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        invoiceData.isPayment ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoiceData.isPayment ? "已付款" : "未付款"}
                    </span>
                  </div>
                  <div>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Button
                          type="submit"
                          disabled={invoiceData.isPayment}
                          className={`w-full md:w-auto ${
                            invoiceData.isPayment
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-[#80A8BD] hover:bg-[#d9824c] text-white"
                          }`}
                        >
                          {invoiceData.isPayment ? "已付款" : "標記為已付款"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>

              {/* 內容詳情 */}
              <div className="bg-gray-50 p-4 rounded-lg border border-[#80A8BD]">
                <h3 className="text-lg font-semibold text-[#80A8BD] mb-3">內容詳情</h3>
                <div className="space-y-2">
                  {invoiceData.content.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {invoiceData.content.map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">無內容</p>
                  )}
                </div>
              </div>

              {/* 支付方式 */}
              <div className="bg-gray-50 p-4 rounded-lg border border-[#80A8BD]">
                <h3 className="text-lg font-semibold text-[#80A8BD] mb-3">支付方式</h3>
                <div className="space-y-2">
                  {invoiceData.PaymentMethods.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {invoiceData.PaymentMethods.map((pay, payIndex) => (
                        <li key={payIndex} className="text-gray-700">{pay}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">無支付方式</p>
                  )}
                </div>
              </div>

              {/* 時間信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium">創建時間：</span>
                  {new Date(invoiceData.createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">更新時間：</span>
                  {new Date(invoiceData.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;