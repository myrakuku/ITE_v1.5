// "use client";

// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface CourseTimeRange {
//   id: string;
//   starttime: string | null;
//   endtime: string | null;
// }

// interface Course {
//   startDate: string | null;
//   CourseTimeRanges: CourseTimeRange[];
// }

// interface CourseProduct {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   CourseProductTypeArray: string[];
//   CourseProductStatusArray: string[];
//   IsPublic: boolean;
//   courseId: string | null;
//   Course?: Course;
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

// interface HeaderType {
//   id: string;
//   HeaderTypeName: string;
// }

// const formatDate = (date: string | null | undefined): string => {
//   if (date == null) return "未設置";
//   try {
//     return new Intl.DateTimeFormat("zh-HK", {
//       dateStyle: "medium",
//     }).format(new Date(date));
//   } catch {
//     return "無效日期";
//   }
// };

// const formatTime = (time: string | null | undefined): string => {
//   if (time == null) return "未設置";
//   try {
//     return new Intl.DateTimeFormat("zh-HK", {
//       timeStyle: "short",
//     }).format(new Date(time));
//   } catch {
//     return "無效時間";
//   }
// };

// const ShopPage = () => {
//   const { data: session, status } = useSession();
//   const params = useParams();
//   const userId = params.userId as string;
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [productLists, setProductLists] = useState<CourseProduct[]>([]);
//   const [courseProductTypes, setCourseProductTypes] = useState<CourseProductType[]>([]);
//   const [courseProductStatuses, setCourseProductStatuses] = useState<CourseProductStatus[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [filteredProducts, setFilteredProducts] = useState<CourseProduct[]>([]);
//   const [GetHeaderType, setGetHeaderType] = useState<HeaderType[]>([]);

//   const fetchHeaderType = async () => {
//     try {
//       const response = await fetch("/api/Type/Get_HeaderType_Lists");
//       if (!response.ok) {
//         throw new Error(`無法獲取關鍵字數據: ${response.status}`);
//       }
//       const data = await response.json();
//       setGetHeaderType(data);
//       setError(null);
//     } catch (error: unknown) {
//       console.error("獲取關鍵字數據失敗:", error);
//       setError(error instanceof Error ? error.message : "無法獲取關鍵字數據");
//     }
//   };

//   const fetchProductLists = async () => {
//     try {
//       const response = await fetch("/api/product/Get_Product_Lists");
//       if (!response.ok) {
//         throw new Error(`無法獲取商品數據: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("API 返回的商品數據:", data);
//       setProductLists(data);
//       setFilteredProducts(data);
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
//     fetchProductLists();
//     fetchCourseProductStatuses();
//     fetchCourseProductTypes();
//     fetchHeaderType();
//   }, []);

//   useEffect(() => {
//     const filterProducts = () => {
//       if (!productLists.length) {
//         console.log("產品列表為空，設置 filteredProducts 為空");
//         setFilteredProducts([]);
//         return;
//       }

//       let filtered = productLists;

//       filtered = filtered.filter((product) => {
//         const isPublicMatch = product.IsPublic === true;
//         console.log(`產品 ${product.title} 的 IsPublic: ${product.IsPublic}, 是否匹配: ${isPublicMatch}`);
//         return isPublicMatch;
//       });

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
//       setFilteredProducts(filtered);
//     };

//     filterProducts();
//   }, [selectedTypes, selectedStatuses, searchQuery, productLists]);

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

//   if (status === "loading") {
//     return <div className="text-center py-10">載入中...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-red-500 text-center py-10">錯誤: {error}</div>
//         <button
//           onClick={() => {
//             fetchProductLists();
//             fetchCourseProductStatuses();
//             fetchCourseProductTypes();
//             fetchHeaderType();
//           }}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           重試
//         </button>
//       </div>
//     );
//   }

//   console.log("filteredProducts : ", filteredProducts, " -- End -- ");
//   console.log("courseProductTypes : ", courseProductTypes, " -- End -- ");
//   console.log("courseProductStatuses : ", courseProductStatuses, " -- End -- ");

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">接受報名中：</h1>

//       <div className="hidden">
//         {GetHeaderType.map((headertype) => (
//           <div key={headertype.id}>
//             <h1 className="text-4xl font-bold hidden md:flex lg:text-5xl">{headertype.HeaderTypeName}</h1>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">搜索課程</label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder="輸入課程名稱或描述..."
//               className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">類型篩選</label>
//             <div className="flex flex-wrap gap-2">
//               {courseProductTypes.map((type) => (
//                 <label key={type.id} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedTypes.includes(type.typename)}
//                     onChange={() => handleTypeChange(type.typename)}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <span className="ml-2 text-sm">{type.typename}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">狀態篩選</label>
//             <div className="flex flex-wrap gap-2">
//               {courseProductStatuses.map((status) => (
//                 <label key={status.id} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={selectedStatuses.includes(status.statuename)}
//                     onChange={() => handleStatusChange(status.statuename)}
//                     className="form-checkbox h-5 w-5 text-blue-600"
//                   />
//                   <span className="ml-2 text-sm">{status.statuename}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredProducts.map((product) => (
//           <div key={product.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
//             <Link href={`/user/${userId}/shop/${product.id}`} onClick={handleProductClick}>
//               <h2 className="text-lg font-semibold">{product.title}</h2>
//               <p className="text-gray-600">{product.description}</p>
//               <div className="mt-2">
//                 {product.price !== 0 && (
//                   <p className="text-gray-500 font-bold line-through">
//                     HK${product.price.toFixed(2)}
//                   </p>
//                 )}
//                 <p className="text-blue-600 font-bold">HK${product.real_price.toFixed(2)}</p>
//                 <p className="text-gray-600 text-sm mt-1">
//                   開課日期: {formatDate(product.Course?.startDate)}
//                 </p>
//                 {product.Course && Array.isArray(product.Course.CourseTimeRanges) && product.Course.CourseTimeRanges.length > 0 ? (
//                   product.Course.CourseTimeRanges.map((timeRange) => (
//                     <p key={timeRange.id} className="text-gray-600 text-sm">
//                       時間: {formatTime(timeRange.starttime)} - {formatTime(timeRange.endtime)}
//                     </p>
//                   ))
//                 ) : (
//                   <p className="text-gray-600 text-sm">時間: 未設置</p>
//                 )}
//               </div>
//             </Link>
//           </div>
//         ))}
//         {filteredProducts.length === 0 && (
//           <p className="text-center col-span-full text-gray-500">未找到符合條件的課程</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShopPage;

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

interface HeaderType {
  id: string;
  HeaderTypeName: string;
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
  const { data: session, status } = useSession();
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [productLists, setProductLists] = useState<CourseProduct[]>([]);
  const [courseProductTypes, setCourseProductTypes] = useState<CourseProductType[]>([]);
  const [courseProductStatuses, setCourseProductStatuses] = useState<CourseProductStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<CourseProduct[]>([]);
  const [GetHeaderType, setGetHeaderType] = useState<HeaderType[]>([]);

  const fetchHeaderType = async () => {
    try {
      const response = await fetch("/api/Type/Get_HeaderType_Lists");
      if (!response.ok) {
        throw new Error(`無法獲取關鍵字數據: ${response.status}`);
      }
      const data = await response.json();
      setGetHeaderType(data);
      setError(null);
    } catch (error: unknown) {
      console.error("獲取關鍵字數據失敗:", error);
      setError(error instanceof Error ? error.message : "無法獲取關鍵字數據");
    }
  };

  const fetchProductLists = async () => {
    try {
      const response = await fetch("/api/product/Get_Product_Lists");
      if (!response.ok) {
        throw new Error(`無法獲取商品數據: ${response.status}`);
      }
      const data = await response.json();
      console.log("API 返回的商品數據:", data);
      setProductLists(data);
      setFilteredProducts(data);
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
    fetchHeaderType();
  }, []);

  useEffect(() => {
    const filterProducts = () => {
      if (!productLists.length) {
        console.log("產品列表為空，設置 filteredProducts 為空");
        setFilteredProducts([]);
        return;
      }

      let filtered = productLists;

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
      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [selectedTypes, selectedStatuses, searchQuery, productLists]);

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

  if (status === "loading") {
    return <div className="text-center py-10">載入中...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center py-10">錯誤: {error}</div>
        <button
          onClick={() => {
            fetchProductLists();
            fetchCourseProductStatuses();
            fetchCourseProductTypes();
            fetchHeaderType();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          重試
        </button>
      </div>
    );
  }

  console.log("filteredProducts : ", filteredProducts, " -- End -- ");
  console.log("courseProductTypes : ", courseProductTypes, " -- End -- ");
  console.log("courseProductStatuses : ", courseProductStatuses, " -- End -- ");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">接受報名中：</h1>

      <div className="hidden">
        {GetHeaderType.map((headertype) => (
          <div key={headertype.id}>
            <h1 className="text-4xl font-bold hidden md:flex lg:text-5xl">{headertype.HeaderTypeName}</h1>
          </div>
        ))}
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
                    checked={selectedTypes.includes(type.typename)}
                    onChange={() => handleTypeChange(type.typename)}
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
                    checked={selectedStatuses.includes(status.statuename)}
                    onChange={() => handleStatusChange(status.statuename)}
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
            <Link href={`/user/${userId}/shop/${product.id}`} onClick={handleProductClick}>
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