// export default function PayMeSuccessPage({
//   searchParams,
// }: {
//   searchParams: { orderId?: string };
// }) {
//   return (
//     <div className="container mx-auto p-8 text-center">
//       <h1 className="text-3xl font-bold text-green-600 mb-4">支付成功</h1>
//       <p className="text-lg mb-4">感謝您的購買！</p>
//       {searchParams.orderId && (
//         <p className="text-gray-600">訂單編號: {searchParams.orderId}</p>
//       )}
//     </div>
//   );
// }

export default async function PayMeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  // 等待 searchParams Promise 解析
  const resolvedSearchParams = await searchParams;

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">支付成功</h1>
      <p className="text-lg mb-4">感謝您的購買！</p>
      {resolvedSearchParams.orderId && (
        <p className="text-gray-600">訂單編號: {resolvedSearchParams.orderId}</p>
      )}
    </div>
  );
}