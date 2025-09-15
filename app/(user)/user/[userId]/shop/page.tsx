"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CourseTimeRange {
  id: string;
  starttime: string | null;
  endtime: string | null;
}

interface Course {
  startDate: string | null;
  CourseTimeRanges: CourseTimeRange[];
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

const formatDate = (date: string | null | undefined): string => {
  if (date == null) return "未設置";
  try {
    return new Intl.DateTimeFormat("zh-HK", {
      dateStyle: "medium",
    }).format(new Date(date));
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

const ShopPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [originalProductLists, setOriginalProductLists] = useState<CourseProduct[]>([]);
  const [filteredProductLists, setFilteredProductLists] = useState<CourseProduct[]>([]);
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
      setOriginalProductLists(data);
      setFilteredProductLists(data);
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
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProductLists(),
        fetchCourseProductStatuses(),
        fetchCourseProductTypes(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      if (!originalProductLists.length) {
        console.log("產品列表為空，設置 filteredProductLists 為空");
        setFilteredProductLists([]);
        return;
      }

      let filtered = originalProductLists;

      filtered = filtered.filter((product) => {
        const isPublicMatch = product.IsPublic === true;
        console.log(`產品 ${product.title} 的 IsPublic: ${product.IsPublic}, 是否匹配: ${isPublicMatch}`);
        return isPublicMatch;
      });

      if (selectedTypes.length > 0) {
        filtered = filtered.filter((product) => {
          const isTypeMatch =
            Array.isArray(product.CourseProductTypeArray) &&
            selectedTypes.some((type) => {
              const match = product.CourseProductTypeArray.includes(type);
              console.log(
                `產品 ${product.title} 的 CourseProductTypeArray: ${product.CourseProductTypeArray}, 檢查類型 ${type}, 是否匹配: ${match}`
              );
              return match;
            });
          return isTypeMatch;
        });
      }

      if (selectedStatuses.length > 0) {
        filtered = filtered.filter((product) => {
          const isStatusMatch =
            Array.isArray(product.CourseProductStatusArray) &&
            selectedStatuses.some((status) => {
              const match = product.CourseProductStatusArray.includes(status);
              console.log(
                `產品 ${product.title} 的 CourseProductStatusArray: ${product.CourseProductStatusArray}, 檢查狀態 ${status}, 是否匹配: ${match}`
              );
              return match;
            });
          return isStatusMatch;
        });
      }

      if (searchQuery) {
        filtered = filtered.filter((product) => {
          const titleMatch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
          const descriptionMatch = product.description?.toLowerCase().includes(searchQuery.toLowerCase());
          console.log(
            `產品 ${product.title} 的標題匹配: ${titleMatch}, 描述匹配: ${descriptionMatch}, 搜索詞: ${searchQuery}`
          );
          return titleMatch || descriptionMatch;
        });
      }

      console.log("最終篩選結果:", filtered);
      setFilteredProductLists(filtered);
    };

    filterProducts();
  }, [selectedTypes, selectedStatuses, searchQuery, originalProductLists]);

  const handleTypeChange = (typename: string) => {
    const normalizedType = typename.trim();
    setSelectedTypes((prev) =>
      prev.includes(normalizedType)
        ? prev.filter((t) => t !== normalizedType)
        : [...prev, normalizedType]
    );
  };

  const handleStatusChange = (statuename: string) => {
    const normalizedStatus = statuename.trim();
    setSelectedStatuses((prev) =>
      prev.includes(normalizedStatus)
        ? prev.filter((s) => s !== normalizedStatus)
        : [...prev, normalizedStatus]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!session) {
      e.preventDefault();
      alert("請先登入以查看商品詳情！");
      router.push("/auth/signin");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          載入中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => {
              fetchProductLists();
              fetchCourseProductStatuses();
              fetchCourseProductTypes();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  console.log("courseProductStatuses:", courseProductStatuses, "-- End --");
  console.log("courseProductTypes:", courseProductTypes, "-- End --");
  console.log("filteredProductLists:", filteredProductLists, "-- End --");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">接受報名中：</h1>

        {/* 篩選和搜尋 */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">搜尋課程</label>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="輸入課程名稱或描述..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">類型篩選</label>
              <div className="flex flex-wrap gap-2">
                {courseProductTypes.map((type) => (
                  <label key={type.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.typename)}
                      onChange={() => handleTypeChange(type.typename)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-white">{type.typename}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">狀態篩選</label>
              <div className="flex flex-wrap gap-2">
                {courseProductStatuses.map((status) => (
                  <label key={status.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status.statuename)}
                      onChange={() => handleStatusChange(status.statuename)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-white">{status.statuename}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProductLists.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 shadow-lg rounded-lg p-4 hover:bg-gray-700 transition"
            >
              <Link href={`/user/${userId}/shop/${product.id}`} onClick={handleProductClick}>
                <h2 className="text-lg font-semibold text-white">{product.title}</h2>
                <p className="text-gray-400 text-sm">{product.description}</p>
                <div className="mt-2">
                  <p className="text-red-500 font-bold text-lg">
                    HK${product.real_price.toFixed(2)}
                  </p>
                  {product.price !== 0 && (
                    <p className="text-gray-400 text-sm line-through">
                      原價: HK${product.price.toFixed(2)}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm mt-1">
                    開課日期: {formatDate(product.Course?.startDate)}
                  </p>
                  {product.Course && Array.isArray(product.Course.CourseTimeRanges) && product.Course.CourseTimeRanges.length > 0 ? (
                    product.Course.CourseTimeRanges.map((timeRange) => (
                      <p key={timeRange.id} className="text-gray-400 text-sm">
                        時間: {formatTime(timeRange.starttime)} - {formatTime(timeRange.endtime)}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">時間: 未設置</p>
                  )}
                </div>
              </Link>
            </div>
          ))}
          {filteredProductLists.length === 0 && (
            <p className="text-center col-span-full text-gray-400">未找到符合條件的課程</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;

// "use client";

// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface CourseProduct {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   CourseProductTypeArray: string[];
//   CourseProductStatusArray: string[]; // 修正拼寫
//   IsPublic: boolean;
// }

// interface CourseProductType {
//   id: string;
//   typename: string;
//   author: string;
// }

// interface CourseProductStatus {
//   id: string;
//   statuename: string;
// }

// const ShopPage = () => {
//   const { data: session } = useSession();
//   const params = useParams();
//   const userId = params.userId as string;
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [originalProductLists, setOriginalProductLists] = useState<CourseProduct[]>([]); // 儲存原始數據
//   const [filteredProductLists, setFilteredProductLists] = useState<CourseProduct[]>([]); // 儲存過濾後的數據
//   const [courseProductTypes, setCourseProductTypes] = useState<CourseProductType[]>([]);
//   const [courseProductStatuses, setCourseProductStatuses] = useState<CourseProductStatus[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   const fetchProductLists = async () => {
//     try {
//       const response = await fetch("/api/product/Get_Product_Lists");
//       if (!response.ok) {
//         throw new Error(`無法獲取商品數據: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("API 返回的商品數據:", data);
//       setOriginalProductLists(data); // 設置原始數據
//       setFilteredProductLists(data); // 初始化過濾數據
//       setError(null);
//     } catch (error: unknown) {
//       console.error("獲取商品數據失敗:", error);
//       setError(error instanceof Error ? error.message : "無法獲取商品數據");
//     }
//   };

//   const fetchCourseProductStatuses = async () => {
//     try {
//       const response = await fetch("/api/Status/Get_Status_Lists");
//       if (!response.ok) {
//         throw new Error(`無法獲取狀態數據: ${response.status}`);
//       }
//       const data = await response.json();
//       setCourseProductStatuses(data);
//       setError(null);
//     } catch (error: unknown) {
//       console.error("獲取狀態數據失敗:", error);
//       setError(error instanceof Error ? error.message : "無法獲取狀態數據");
//     }
//   };

//   const fetchCourseProductTypes = async () => {
//     try {
//       const response = await fetch("/api/Type/Get_Type_Lists");
//       if (!response.ok) {
//         throw new Error(`無法獲取類型數據: ${response.status}`);
//       }
//       const data = await response.json();
//       setCourseProductTypes(data);
//       setError(null);
//     } catch (error: unknown) {
//       console.error("獲取類型數據失敗:", error);
//       setError(error instanceof Error ? error.message : "無法獲取類型數據");
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       await Promise.all([
//         fetchProductLists(),
//         fetchCourseProductStatuses(),
//         fetchCourseProductTypes(),
//       ]);
//       setIsLoading(false);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const filterProducts = () => {
//       if (!originalProductLists.length) {
//         console.log("產品列表為空，設置 filteredProducts 為空");
//         setFilteredProductLists([]);
//         return;
//       }

//       let filtered = originalProductLists;

//       // 篩選 IsPublic 為 true 的產品
//       filtered = filtered.filter((product) => {
//         const isPublicMatch = product.IsPublic === true;
//         console.log(`產品 ${product.title} 的 IsPublic: ${product.IsPublic}, 是否匹配: ${isPublicMatch}`);
//         return isPublicMatch;
//       });

//       // 篩選類型
//       if (selectedTypes.length > 0) {
//         filtered = filtered.filter((product) => {
//           const isTypeMatch =
//             Array.isArray(product.CourseProductTypeArray) &&
//             selectedTypes.some((type) => {
//               const match = product.CourseProductTypeArray.includes(type);
//               console.log(
//                 `產品 ${product.title} 的 CourseProductTypeArray: ${product.CourseProductTypeArray}, 檢查類型 ${type}, 是否匹配: ${match}`
//               );
//               return match;
//             });
//           return isTypeMatch;
//         });
//       }

//       // 篩選狀態
//       if (selectedStatuses.length > 0) {
//         filtered = filtered.filter((product) => {
//           const isStatusMatch =
//             Array.isArray(product.CourseProductStatusArray) &&
//             selectedStatuses.some((status) => {
//               const match = product.CourseProductStatusArray.includes(status);
//               console.log(
//                 `產品 ${product.title} 的 CourseProductStatusArray: ${product.CourseProductStatusArray}, 檢查狀態 ${status}, 是否匹配: ${match}`
//               );
//               return match;
//             });
//           return isStatusMatch;
//         });
//       }

//       // 篩選搜索詞
//       if (searchQuery) {
//         filtered = filtered.filter((product) => {
//           const titleMatch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
//           const descriptionMatch = product.description?.toLowerCase().includes(searchQuery.toLowerCase());
//           console.log(
//             `產品 ${product.title} 的標題匹配: ${titleMatch}, 描述匹配: ${descriptionMatch}, 搜索詞: ${searchQuery}`
//           );
//           return titleMatch || descriptionMatch;
//         });
//       }

//       console.log("最終篩選結果:", filtered);
//       setFilteredProductLists(filtered);
//     };

//     filterProducts();
//   }, [selectedTypes, selectedStatuses, searchQuery, originalProductLists]);

//   const handleTypeChange = (typename: string) => {
//     const normalizedType = typename.trim();
//     setSelectedTypes((prev) =>
//       prev.includes(normalizedType)
//         ? prev.filter((t) => t !== normalizedType)
//         : [...prev, normalizedType]
//     );
//   };

//   const handleStatusChange = (statuename: string) => {
//     const normalizedStatus = statuename.trim();
//     setSelectedStatuses((prev) =>
//       prev.includes(normalizedStatus)
//         ? prev.filter((s) => s !== normalizedStatus)
//         : [...prev, normalizedStatus]
//     );
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleProductClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     if (!session) {
//       e.preventDefault();
//       alert("請先登入以查看商品詳情！");
//       router.push("/auth/signin");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
//         <div className="flex items-center">
//           <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
//           </svg>
//           載入中...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-gray-900 min-h-screen text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="text-red-500 mb-4">{error}</div>
//           <button
//             onClick={() => {
//               fetchProductLists();
//               fetchCourseProductStatuses();
//               fetchCourseProductTypes();
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
//           >
//             重試
//           </button>
//         </div>
//       </div>
//     );
//   }

//   console.log("courseProductStatuses:", courseProductStatuses, "-- End --");
//   console.log("courseProductTypes:", courseProductTypes, "-- End --");
//   console.log("filteredProductLists:", filteredProductLists, "-- End --");

//   return (
//     <div className="bg-gray-900 min-h-screen text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <h1 className="text-2xl font-bold mb-6">商店</h1>

//         {/* 篩選和搜尋 */}
//         <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">搜尋課程</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 placeholder="輸入課程名稱或描述..."
//                 className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">類型篩選</label>
//               <div className="flex flex-wrap gap-2">
//                 {courseProductTypes.map((type) => (
//                   <label key={type.id} className="inline-flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedTypes.includes(type.id)}
//                       onChange={() => handleTypeChange(type.id)}
//                       className="form-checkbox h-5 w-5 text-blue-600 rounded"
//                     />
//                     <span className="ml-2 text-sm text-white">{type.typename}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-400 mb-2">狀態篩選</label>
//               <div className="flex flex-wrap gap-2">
//                 {courseProductStatuses.map((status) => (
//                   <label key={status.id} className="inline-flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={selectedStatuses.includes(status.id)}
//                       onChange={() => handleStatusChange(status.id)}
//                       className="form-checkbox h-5 w-5 text-blue-600 rounded"
//                     />
//                     <span className="ml-2 text-sm text-white">{status.statuename}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 商品列表 */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {filteredProductLists.map((product) => (
//             <div
//               key={product.id}
//               className="bg-gray-800 shadow-lg rounded-lg p-4 hover:bg-gray-700 transition"
//             >
//               <Link href={`/user/${userId}/shop/${product.id}`} onClick={handleProductClick}>
//                 <h2 className="text-lg font-semibold text-white">{product.title}</h2>
//                 <p className="text-gray-400 text-sm">{product.description}</p>
//                 <div className="mt-2">
//                   <p className="text-red-500 font-bold text-lg">
//                     砍手價！！HK${product.real_price.toFixed(2)}
//                   </p>
//                   <p className="text-gray-400 text-sm line-through">
//                     原價: HK${product.price.toFixed(2)}
//                   </p>
//                 </div>
//               </Link>
//             </div>
//           ))}
//           {filteredProductLists.length === 0 && (
//             <p className="text-center col-span-full text-gray-400">未找到符合條件的課程</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopPage;