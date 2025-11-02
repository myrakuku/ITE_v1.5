

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

interface CourseTimeRange {
  id: string;
  starttime: string | null;
  endtime: string | null;
}

interface Course {
  startDate: string | null;
  CourseTimeRanges: CourseTimeRange[];
}

interface ProductImg {
  id: string;
  img_url: string;
}

interface CourseProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  CourseProductTypeArray: string[];
  CourseProductStatusArray: string[];
  IsPublic: boolean;
  courseId: string | null;
  Course?: Course;
  Product_Img: ProductImg[];
}

interface CourseProductType {
  id: string;
  typename: string;
  author: string;
}

interface CourseProductStatus {
  id: string;
  statuename: string;
}

interface HeaderType {
  id: string;
  HeaderTypeName: string;
}

interface ShopPageProps {
  headerTypes?: HeaderType[];
}

const formatDate = (date: string | null | undefined): string => {
  if (date == null) return "未設置";
  try {
    return new Intl.DateTimeFormat("zh-HK", { dateStyle: "medium" }).format(new Date(date));
  } catch {
    return "無效日期";
  }
};

const formatTime = (time: string | null | undefined): string => {
  if (time == null) return "未設置";
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time)) return "無效時間";
  return time;
};

const ShopPage: React.FC<ShopPageProps> = ({ headerTypes = [] }) => {
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [productLists, setProductLists] = useState<CourseProduct[]>([]);
  const [courseProductTypes, setCourseProductTypes] = useState<CourseProductType[]>([]);
  const [courseProductStatuses, setCourseProductStatuses] = useState<CourseProductStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProductLists = async () => {
    try {
      const response = await fetch("/api/product/Get_Product_Lists");
      if (!response.ok) {
        throw new Error(`無法獲取商品數據: ${response.status}`);
      }
      const data = await response.json();
      console.log("API 返回的商品數據:", data);
      setProductLists(data);
      setError(null);
    } catch (error: unknown) {
      console.error("獲取商品數據失敗:", error);
      setError(error instanceof Error ? error.message : "無法獲取商品數據");
    }
  };

  const fetchCourseProductStatuses = async () => {
    try {
      const response = await fetch("/api/Status/Get_Status_Lists");
      if (!response.ok) {
        throw new Error(`無法獲取狀態數據: ${response.status}`);
      }
      const data = await response.json();
      setCourseProductStatuses(data);
      setError(null);
    } catch (error: unknown) {
      console.error("獲取狀態數據失敗:", error);
      setError(error instanceof Error ? error.message : "無法獲取狀態數據");
    }
  };

  const fetchCourseProductTypes = async () => {
    try {
      const response = await fetch("/api/Type/Get_Type_Lists");
      if (!response.ok) {
        throw new Error(`無法獲取類型數據: ${response.status}`);
      }
      const data = await response.json();
      setCourseProductTypes(data);
      setError(null);
    } catch (error: unknown) {
      console.error("獲取類型數據失敗:", error);
      setError(error instanceof Error ? error.message : "無法獲取類型數據");
    }
  };

  useEffect(() => {
    fetchProductLists();
    fetchCourseProductStatuses();
    fetchCourseProductTypes();
  }, []);

const filteredProducts = useMemo(() => {
  if (!productLists.length) return [];

  let filtered = productLists.filter((product) => product.IsPublic === true);

  // === 類型篩選：支援 ID 或 typename ===
  if (selectedTypes.length > 0) {
    filtered = filtered.filter((product) => {
      if (!Array.isArray(product.CourseProductTypeArray)) return false;

      return selectedTypes.some((selectedId) => {
        const type = courseProductTypes.find(t => t.id === selectedId);
        if (!type) return false;

        return (
          product.CourseProductTypeArray.includes(selectedId) ||     // 比對 ID
          product.CourseProductTypeArray.includes(type.typename)     // 比對 typename（舊資料）
        );
      });
    });
  }

  // === 狀態篩選：支援 ID 或 statuename ===
  if (selectedStatuses.length > 0) {
    filtered = filtered.filter((product) => {
      if (!Array.isArray(product.CourseProductStatusArray)) return false;

      return selectedStatuses.some((selectedId) => {
        const status = courseProductStatuses.find(s => s.id === selectedId);
        if (!status) return false;

        return (
          product.CourseProductStatusArray.includes(selectedId) ||   // 比對 ID
          product.CourseProductStatusArray.includes(status.statuename) // 比對 statuename
        );
      });
    });
  }

  // === 搜尋 ===
  if (searchQuery) {
    filtered = filtered.filter(
      (product) =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
}, [productLists, selectedTypes, selectedStatuses, searchQuery, courseProductTypes, courseProductStatuses]);

const handleTypeChange = (typeId: string) => {
  setSelectedTypes((prev) =>
    prev.includes(typeId)
      ? prev.filter((t) => t !== typeId)
      : [...prev, typeId]
  );
};

const handleStatusChange = (statusId: string) => {
  setSelectedStatuses((prev) =>
    prev.includes(statusId)
      ? prev.filter((s) => s !== statusId)
      : [...prev, statusId]
  );
};

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (status === "loading") {
    return <div className="text-center py-10">載入中...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-10 bg-red-100 rounded-md">
          錯誤: {error}
        </div>
        <button
          onClick={() => {
            fetchProductLists();
            fetchCourseProductStatuses();
            fetchCourseProductTypes();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          重試
        </button>
      </div>
    );
  }

  console.log("headerTypesDate : ", headerTypes, " -- End -- ");
    console.log("courseProductTypes : ", courseProductTypes, " -- End -- ");
      console.log("selectedTypes : ", selectedTypes, " -- End -- ");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">接受報名中：</h1>

      <div className="hidden">
        {headerTypes.length > 0 ? (
          headerTypes.map((headertype) => (
            <div key={headertype.id}>
              <h1 className="text-4xl font-bold hidden md:flex lg:text-5xl">{headertype.HeaderTypeName}</h1>
            </div>
          ))
        ) : (
          <div className="hidden">
            <h1 className="text-4xl font-bold hidden md:flex lg:text-5xl">無關鍵字</h1>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索課程</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="輸入課程名稱或描述..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">類型篩選</label>
            <div className="flex flex-wrap gap-2">
{courseProductTypes.map((type) => (
  <label key={type.id} className="inline-flex items-center">
    <input
      type="checkbox"
      checked={selectedTypes.includes(type.id)}
      onChange={() => handleTypeChange(type.id)}
      className="form-checkbox h-5 w-5 text-blue-600"
    />
    <span className="ml-2 text-sm">{type.typename}</span>
  </label>
))}
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">狀態篩選</label>
            <div className="flex flex-wrap gap-2">
{courseProductStatuses.map((status) => (
  <label key={status.id} className="inline-flex items-center">
    <input
      type="checkbox"
      checked={selectedStatuses.includes(status.id)}
      onChange={() => handleStatusChange(status.id)}
      className="form-checkbox h-5 w-5 text-blue-600"
    />
    <span className="ml-2 text-sm">{status.statuename}</span>
  </label>
))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            <Link href={`/shop/${product.id}`}>
              <div className="mb-4">
                {product.Product_Img && product.Product_Img.length > 0 ? (
                  <Image
                    src={product.Product_Img[0].img_url}
                    alt={product.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md"
                    priority={false}
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                  />
                ) : (
                  <Image
                    src="/placeholder-image.jpg"
                    alt="無圖片"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-md"
                    priority={false}
                    placeholder="blur"
                    blurDataURL="/placeholder-image.jpg"
                  />
                )}
              </div>
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-gray-600">{product.description}</p>
              <div className="mt-2">
                {product.price !== 0 && (
                  <p className="text-gray-500 font-bold line-through">
                    HK${product.price.toFixed(2)}
                  </p>
                )}
                <p className="text-blue-600 font-bold">HK${product.real_price.toFixed(2)}</p>
                <p className="text-gray-600 text-sm mt-1">
                  開課日期: {formatDate(product.Course?.startDate)}
                </p>
                {product.Course && Array.isArray(product.Course.CourseTimeRanges) && product.Course.CourseTimeRanges.length > 0 ? (
                  product.Course.CourseTimeRanges.map((timeRange) => (
                    <p key={timeRange.id} className="text-gray-600 text-sm">
                      時間: {formatTime(timeRange.starttime)} - {formatTime(timeRange.endtime)}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">時間: 未設置</p>
                )}
              </div>
            </Link>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <p className="text-center col-span-full text-gray-500">未找到符合條件的課程</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;