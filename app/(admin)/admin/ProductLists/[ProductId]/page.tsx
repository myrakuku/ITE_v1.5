// app/components/ProductListsPagebyId.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProductImg {
  id: string;
  img_url: string;
}

interface ProductLists {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price?: number;
  IsPublic?: boolean;
  category?: string;
  created_at: string;
  updated_at: string;
  Product_Img: ProductImg[];
  referencedPosts?: string | null;  // ← 新增此欄位
}

const ProductListsPagebyId = () => {
  const params = useParams();
  const ProductId = params.ProductId as string;

  const [GetProductDatabyId, setGetProductDatabyId] = useState<ProductLists | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDataLists = async () => {
      try {
        const res = await fetch(`/api/product/Get_Product_Lists_by_ID/${ProductId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Product Data:", data); // 調試 API 響應
        setGetProductDatabyId(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "無法載入產品數據");
      }
    };
    fetchProductDataLists();
  }, [ProductId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetProductDatabyId) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-lg rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <Link
              href={`/admin/ProductLists`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              返回
            </Link>
            <h1 className="text-2xl font-bold">產品詳情</h1>
            <Link
              href={`/admin/ProductLists/${ProductId}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              編輯產品
            </Link>
          </div>

          <div className="space-y-6">
            {/* 基本資訊 */}
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="flex-1 space-y-4">
                <div>
                  <span className="font-medium text-gray-300">產品 ID:</span>{" "}
                  <span className="text-white">{GetProductDatabyId.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">標題:</span>{" "}
                  <span className="text-white font-semibold">{GetProductDatabyId.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">描述:</span>{" "}
                  <p className="mt-1 text-gray-300 whitespace-pre-wrap">{GetProductDatabyId.description}</p>
                </div>

                {/* 新增：參考文章區塊 */}
                <div>
                  <span className="font-medium text-gray-300 block mb-2">參考文章</span>
                  {GetProductDatabyId.referencedPosts?.trim() ? (
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 whitespace-pre-wrap text-gray-200 leading-relaxed">
                      {GetProductDatabyId.referencedPosts.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">
                          {line.trim().startsWith('http') ? (
                            <a
                              href={line.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline break-all"
                            >
                              {line.trim()}
                            </a>
                          ) : (
                            line
                          )}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">尚未提供參考文章</p>
                  )}
                </div>

                <div>
                  <span className="font-medium text-gray-300">價格:</span>{" "}
                  <span className="text-green-400 font-bold">HK${GetProductDatabyId.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">實際價格:</span>{" "}
                  {GetProductDatabyId.real_price ? (
                    <span className="text-yellow-400">HK${GetProductDatabyId.real_price.toFixed(2)}</span>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-300">公開狀態:</span>{" "}
                  <span className={GetProductDatabyId.IsPublic ? "text-green-400" : "text-red-400"}>
                    {GetProductDatabyId.IsPublic ? "公開" : "不公開"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-300">類別:</span>{" "}
                  {GetProductDatabyId.category ?? "未分類"}
                </div>
                <div>
                  <span className="font-medium text-gray-300">創建時間:</span>{" "}
                  {new Date(GetProductDatabyId.created_at).toLocaleString("zh-HK")}
                </div>
                <div>
                  <span className="font-medium text-gray-300">更新時間:</span>{" "}
                  {new Date(GetProductDatabyId.updated_at).toLocaleString("zh-HK")}
                </div>
              </div>

              {/* 圖片區塊 */}
              <div className="mt-6 md:mt-0 flex-shrink-0">
                <span className="font-medium text-gray-300 block mb-2">產品圖片</span>
                {GetProductDatabyId.Product_Img && GetProductDatabyId.Product_Img.length > 0 ? (
                  <Image
                    src={GetProductDatabyId.Product_Img[0].img_url}
                    alt={GetProductDatabyId.title}
                    width={400}
                    height={400}
                    className="w-full max-w-md rounded-md shadow-lg object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.jpg"
                    alt="無圖片"
                    width={400}
                    height={400}
                    className="w-full max-w-md rounded-md shadow-lg object-cover"
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListsPagebyId;