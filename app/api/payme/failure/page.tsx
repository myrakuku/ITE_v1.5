import { NextPage } from "next";

interface PayMeFailurePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const PayMeFailurePage: NextPage<PayMeFailurePageProps> = async ({ searchParams }) => {
  // 等待 searchParams Promise 解析
  const resolvedSearchParams = await searchParams;

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">支付失敗</h1>
      <p className="text-lg mb-4">抱歉，支付過程中出現問題。</p>
      {resolvedSearchParams.orderId && (
        <p className="text-gray-600">訂單編號: {resolvedSearchParams.orderId}</p>
      )}
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        onClick={() => window.history.back()}
      >
        返回重試
      </button>
    </div>
  );
};

export default PayMeFailurePage;

// import { NextPage } from "next";

// interface PayMeFailurePageProps {
//   searchParams: Record<string, string | string[] | undefined>;
// }

// const PayMeFailurePage: NextPage<PayMeFailurePageProps> = ({ searchParams }) => {
//   return (
//     <div className="container mx-auto p-8 text-center">
//       <h1 className="text-3xl font-bold text-red-600 mb-4">支付失敗</h1>
//       <p className="text-lg mb-4">抱歉，支付過程中出現問題。</p>
//       {searchParams.orderId && (
//         <p className="text-gray-600">訂單編號: {searchParams.orderId}</p>
//       )}
//       <button
//         className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
//         onClick={() => window.history.back()}
//       >
//         返回重試
//       </button>
//     </div>
//   );
// };

// export default PayMeFailurePage;