
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ReceiptByIdPageData {
  id: string;
  title: string;
  price: number;
  Invoice_id: string;
  total: number;
  servetype: string;
  studentname: string;
  PaymentMethods: string[];
  content: string[];
}

const ReceiptByIdPage = () => {
  const params = useParams();
  const ReceiptID = params?.ReceiptbyID as string;
  const [GetReceiptByIdData, setGetReceiptByIdData] = useState<
    ReceiptByIdPageData[]
  >([]);

  useEffect(() => {
    const fetchReceiptData = async (id: string) => {
      try {
        const response = await fetch(`/api/ReceiptLists_detail_data_by_id/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGetReceiptByIdData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setGetReceiptByIdData([]);
      }
    };
    fetchReceiptData(ReceiptID);
  }, [ReceiptID]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-釋放6 pt-16">
      <div className="bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-semibold text-[#80A8BD] mb-6">
          收據詳情
        </h1>
        {GetReceiptByIdData.length > 0 ? (
          GetReceiptByIdData.map((d) => (
            <div
              key={d.id}
              className="bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors duration-300 space-y-2"
            >
              <p className="text-[#80A8BD] font-medium">標題: {d.title}</p>
              <p className="text-gray-700">服務類型: {d.servetype}</p>
              <p className="text-gray-700">收據編號: {d.Invoice_id}</p>
              <p className="text-gray-700">學生姓名: {d.studentname}</p>
              <p className="text-gray-700">價錢: {d.price}</p>
              <p className="text-gray-700">
                付款方法:{" "}
                {d.PaymentMethods.length > 0
                  ? d.PaymentMethods.join(", ")
                  : "無"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">無收據資料</p>
        )}
      </div>
    </div>
  );
};

export default ReceiptByIdPage;