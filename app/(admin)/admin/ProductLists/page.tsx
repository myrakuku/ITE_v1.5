"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductLists {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
}

const ProductListsPage = () => {
  const [GetProductData, setGetProductData] = useState<ProductLists[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDataLists = async () => {
      try {
        const response = await fetch("/api/product/Get_Product_Lists");
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setGetProductData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "無法載入產品數據");
      }
    };

    fetchProductDataLists();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetProductData.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                    <Link
              href="/admin/ProductLists/CreateProduct"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              建立商品
            </Link>
        
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 shadow-lg rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">產品列表</h1>
            <Link
              href="/admin/ProductLists/CreateProduct"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              建立商品
            </Link>
          </div>
          <div className="space-y-4">
            {GetProductData.map((product) => (
              <Link
                key={product.id}
                href={`/admin/ProductLists/${product.id}`}
                className="block p-4 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">標題:</span> {product.title}
                  </div>
                  <div>
                    <span className="font-medium">描述:</span> {product.description}
                  </div>
                  <div>
                    <span className="font-medium">價格:</span> {product.price}
                  </div>
                  <div>
                    <span className="font-medium">實際價格:</span> {product.real_price}
                  </div>
                  <div>
                    <span className="font-medium">公開狀態:</span>{" "}
                    {product.IsPublic ? "公開" : "不公開"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListsPage;