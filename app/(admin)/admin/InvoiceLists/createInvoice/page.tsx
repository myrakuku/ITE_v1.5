"use client";


import Invoice_Create_Form from "@/components/CreateForm/Create-Invoice-Form";
import Link from "next/link";

const Invoice_Create_Page = () => {
  return (
    <div className="min-h-screen bg-[#80A8BD] flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#80A8BD]">
            創建發票
          </h1>
          <Link
            href="/admin/InvoiceLists"
            className="inline-block px-3 py-2 text-[#80A8BD] hover:text-cyan-200 transition-colors duration-300 text-sm font-medium"
          >
            返回單據列表
          </Link>
        </div>
        <Invoice_Create_Form/>
      </div>
    </div>
  );
};

export default Invoice_Create_Page;