"use client"

import CreateTypeForm from "@/components/CreateForm/Create-Type_Form";
import Link from "next/link";
import { useParams } from "next/navigation";

const CreateTypespage = () => {

 const params = useParams();
  
    console.log("params : ", params);
  
    const TeacherId = params.Teacherid as string;

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">新增類型</h1>
          <Link
            href={`/teacher/${TeacherId}/TypesLists`}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
          >
            返回
          </Link>
        </div>
    <CreateTypeForm />
      </div>
    </div>







  )
}

export default CreateTypespage