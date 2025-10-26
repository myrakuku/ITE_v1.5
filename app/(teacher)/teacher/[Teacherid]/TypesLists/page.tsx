"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TypeData {
  id: string;
  typename: string;
  author: string;
}

const TypesListsPage = () => {
  const params = useParams();
  const teacherId = params.Teacherid as string;
  const [getTypeData, setGetTypeData] = useState<TypeData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Type/Get_Type_Lists");
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setGetTypeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取類型列表");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!getTypeData.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <Link
            href={`/teacher/${teacherId}/TypesLists/CreateTypes`}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            建立科目
          </Link>
        <div className="text-lg">無類型科目</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">科目列表</h1>
          <Link
            href={`/teacher/${teacherId}/TypesLists/CreateTypes`}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            建立科目
          </Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 font-medium text-sm">
            {/* <div className="text-gray-400">類型 ID</div> */}
            <div className="text-gray-400">科目名稱</div>
            {/* <div className="text-gray-400">作者</div> */}
          </div>
          {getTypeData.map((typeitem) => (
            <div
              key={typeitem.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-t border-gray-700 hover:bg-gray-700"
            >
              {/* <div>{typeitem.id}</div> */}
              <div>{typeitem.typename}</div>
              <div className="flex items-center space-x-2">
                {/* <span>{typeitem.author}</span> */}
                {/* <Link
                  href={`/teacher/${teacherId}/TypesLists/${typeitem.id}/edit`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  編輯
                </Link> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypesListsPage;