"use client"

const OrderConfirmationPage = () => {

  return(
    <>
    OrderConfirmationPage
    </>

  )
}

export default OrderConfirmationPage




// import { db } from "@/lib/db";

// import { redirect } from "next/navigation";
// import type { NextPage } from "next";
// import { auth } from "@/auth";

// interface Props {
//   params: {
//     userId: string;
//     orderId: string;
//   };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

// const OrderConfirmation: NextPage<Props> = async ({ params }) => {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return redirect("/login");
//   }

//   const { userId, orderId } = params;
//   if (session.user.id !== userId) {
//     return <div>無權訪問此訂單</div>;
//   }

//   try {
//     const order = await db.order.findUnique({
//       where: { id: orderId },
//       include: { items: { include: { product: true } } },
//     });

//     if (!order) return <div>訂單未找到</div>;
//     if (order.userId !== userId) return <div>無權訪問此訂單</div>;

//     return (
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">訂單確認</h1>
//         <p>訂單編號: {order.id}</p>
//         <div className="mb-4">
//           {order.items.map((item) => (
//             <div key={item.id} className="flex justify-between mb-2">
//               <span>
//                 {item.product.title} (x{item.quantity})
//               </span>
//               <span>${(item.quantity * item.price).toFixed(2)}</span>
//             </div>
//           ))}
//           <div className="font-bold mt-2">總計: ${order.total.toFixed(2)}</div>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("查詢訂單失敗:", error);
//     return <div>載入訂單時發生錯誤</div>;
//   }
// };

// export default OrderConfirmation;

// import { db } from "@/lib/db";
// import type { Metadata } from 'next';

// interface PageProps {
//   params: { userId: string; orderId: string };
//   searchParams?: { [key: string]: string | string[] | undefined };
// }

// export default async function OrderConfirmation({ params }: PageProps) {
//   const { userId, orderId } = params;

//   try {
//     const order = await db.order.findUnique({
//       where: { id: orderId },
//       include: { items: { include: { product: true } } },
//     });

//     if (!order) return <div>訂單未找到</div>;
//     if (order.userId !== userId) return <div>無權訪問此訂單</div>;

//     return (
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">訂單確認</h1>
//         <p>訂單編號: {order.id}</p>
//         <div className="mb-4">
//           {order.items.map((item) => (
//             <div key={item.id} className="flex justify-between mb-2">
//               <span>
//                 {item.product.title} (x{item.quantity})
//               </span>
//               <span>${(item.quantity * item.price).toFixed(2)}</span>
//             </div>
//           ))}
//           <div className="font-bold mt-2">總計: ${order.total.toFixed(2)}</div>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error('查詢訂單失敗:', error);
//     return <div>載入訂單時發生錯誤</div>;
//   }
// }

// // 可選：如果需要生成動態 metadata
// export async function generateMetadata(
//   { params }: PageProps
// ): Promise<Metadata> {
//   return {
//     title: `訂單 ${params.orderId} 確認`,
//   };
// }



