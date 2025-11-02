'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Archive, AlertCircle } from "lucide-react";

interface ProductImg {
  id: string;
  img_url: string;
}

interface Course {
  maxStudents: number | null;
  Students: string[];
  Producted?: boolean;
  isProduct?: boolean;
}

interface ProductLists {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  Product_Img: ProductImg[];
  Course?: Course;
  isTrash?: boolean;
}

const ProductListsPage = () => {
  const [products, setProducts] = useState<ProductLists[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product/Get_Product_Lists");
      if (!res.ok) throw new Error("載入失敗");
      const data = await res.json();
      // setProducts(data.map((p: any) => ({ ...p, isTrash: false })));
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  };

  const moveToTrash = async (id: string) => {
    try {
      const res = await fetch(`/api/product/move-to-trash/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("操作失敗");
      // setProducts(prev => prev.map(p => p.id === id ? { ...p, isTrash: true } : p));
      // 直接重新 fetch，確保前端與 DB 同步
    await fetchProducts();
      toast.success("已移至垃圾桶");
    } catch {
      toast.error("移至垃圾桶失敗");
    }
  };

  const confirmDelete = async () => {
    const id = deleteDialog.id;
    if (!id) return;

    try {
      const res = await fetch(`/api/product/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("刪除失敗");
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("已永久刪除");
    } catch {
      toast.error("刪除失敗");
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const canDelete = (product: ProductLists) => {
    return !product.Course?.Students.length;
  };

  const normalProducts = products.filter(p => !p.isTrash && p.Course?.Producted !== true);
  const specialProducts = products.filter(p => !p.isTrash && p.Course?.Producted === true);
  const trashProducts = products.filter(p => p.isTrash);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;


  console.log("products : ", products , "-- End --")
  // 修正：加入 key 給 ProductCard
  const ProductCard = (product: ProductLists) => (
    <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <Link href={`/admin/ProductLists/${product.id}`} className="block">
        <div className="relative aspect-video bg-gray-700">
          {product.Product_Img[0]?.img_url ? (
            <Image
              src={product.Product_Img[0].img_url}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-500">無圖片</span>
            </div>
          )}
          {product.Course && product.Course.Students.length >= (product.Course.maxStudents ?? 0) && product.Course.maxStudents && (
            <Badge className="absolute top-2 right-2 bg-red-600">已滿</Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xl font-bold text-green-400">HK${product.real_price}</span>
              {product.price !== product.real_price && (
                <span className="text-sm text-gray-500 line-through ml-2">HK${product.price}</span>
              )}
            </div>
            <Badge variant={product.IsPublic ? "default" : "secondary"}>
              {product.IsPublic ? "公開" : "不公開"}
            </Badge>
          </div>
          {product.Course && (
            <p className="text-xs text-gray-400">
              學生：{product.Course.Students.length} / {product.Course.maxStudents ?? "無上限"}
            </p>
          )}
        </div>
      </Link>

      <div className="p-3 border-t border-gray-700 flex gap-2">
        {!product.isTrash ? (
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveToTrash(product.id);
            }}
          >
            <Archive className="w-4 h-4 mr-1" /> 設為廢品
          </Button>
        ) : (
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            disabled={!canDelete(product)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (canDelete(product)) {
                setDeleteDialog({ open: true, id: product.id });
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {canDelete(product) ? "永久刪除" : "有學生，不可刪"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">產品管理</h1>
          <p className="text-gray-400">點擊卡片可編輯詳細內容</p>
        </div>

        <Tabs defaultValue="normal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="normal">產品 ({normalProducts.length})</TabsTrigger>
            <TabsTrigger value="special">特別產品 ({specialProducts.length})</TabsTrigger>
            <TabsTrigger value="trash">垃圾桶 ({trashProducts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="normal" className="mt-0">
            {normalProducts.length === 0 ? <EmptyState type="normal" /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {normalProducts.map(product => <ProductCard key={product.id} {...product} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="special" className="mt-0">
            {specialProducts.length === 0 ? <EmptyState type="special" /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialProducts.map(product => <ProductCard key={product.id} {...product} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trash" className="mt-0">
            {trashProducts.length === 0 ? <EmptyState type="trash" /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trashProducts.map(product => <ProductCard key={product.id} {...product} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              確認永久刪除？
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。產品將被永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              確認刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// === 輔助組件 ===
const LoadingState = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-xl">載入中...</div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="bg-red-600 text-white px-6 py-3 rounded-lg">{message}</div>
  </div>
);

const EmptyState = ({ type }: { type: "normal" | "special" | "trash" }) => {
  const messages = {
    normal: "尚無產品",
    special: "尚無特別產品",
    trash: "垃圾桶為空"
  };
  return (
    <div className="text-center py-12">
      <div className="text-6xl text-gray-700 mb-4">郵件</div>
      <p className="text-gray-400">{messages[type]}</p>
    </div>
  );
};

export default ProductListsPage;
// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface ProductImg {
//   id: string;
//   img_url: string;
// }

// interface Course {
//   maxStudents: number | null;
//   Students: string[];
// }

// interface ProductLists {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   IsPublic: boolean;
//   Product_Img: ProductImg[];
//   Course?: Course;
// }

// const ProductListsPage = () => {
//   const [GetProductData, setGetProductData] = useState<ProductLists[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProductDataLists = async () => {
//       try {
//         const response = await fetch("/api/product/Get_Product_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetProductData(data);
//       } catch (error) {
//         setError(error instanceof Error ? error.message : "無法載入產品數據");
//       }
//     };

//     fetchProductDataLists();
//   }, []);

//   // 檢查課程是否已滿
//   const isCourseFull = (course?: Course) => {
//     if (!course || course.maxStudents === null || course.maxStudents === undefined) {
//       return false; // 無課程或無上限，視為未滿
//     }
//     return course.Students.length >= course.maxStudents;
//   };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
//       </div>
//     );
//   }

//   if (!GetProductData.length) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center gap-4">
//         <div className="text-lg">載入中...</div>
//       </div>
//     );
//   }

//   console.log("GetProductData : ", GetProductData, "-- End --");

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-gray-800 shadow-lg rounded-md p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">產品列表</h1>
//           </div>
//           <div className="space-y-4">
//             {GetProductData.map((product) => (
//               <Link
//                 key={product.id}
//                 href={`/admin/ProductLists/${product.id}`}
//                 className="block p-4 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-lg font-semibold">{product.title}</h2>
//                   {isCourseFull(product.Course) && (
//                     <span className="text-sm text-red-400 font-medium bg-red-900 px-2 py-1 rounded">
//                       已滿
//                     </span>
//                   )}
//                 </div>
//                 <div className="mb-4">
//                   {product.Product_Img && product.Product_Img.length > 0 ? (
//                     <Image
//                       src={product.Product_Img[0].img_url}
//                       alt={product.title}
//                       width={300}
//                       height={200}
//                       className="w-full h-48 object-cover rounded-md"
//                       priority={false}
//                       placeholder="blur"
//                       blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+5PzM7gAAAABJRU5ErkJggg=="
//                       onError={() => (
//                         <Image
//                           src="/placeholder-image.jpg"
//                           alt="圖片加載失敗"
//                           width={300}
//                           height={200}
//                           className="w-full h-48 object-cover rounded-md"
//                           priority={false}
//                         />
//                       )}
//                     />
//                   ) : (
//                     <Image
//                       src="/placeholder-image.jpg"
//                       alt="無圖片"
//                       width={300}
//                       height={200}
//                       className="w-full h-48 object-cover rounded-md"
//                       priority={false}
//                       placeholder="blur"
//                       blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+5PzM7gAAAABJRU5ErkJggg=="
//                     />
//                   )}
//                 </div>
//                 <div className="space-y-2">
//                   <div>
//                     <span className="font-medium">標題:</span> {product.title}
//                   </div>
//                   <div>
//                     <span className="font-medium">描述:</span> {product.description}
//                   </div>
//                   <div>
//                     <span className="font-medium">價格:</span> {product.price}
//                   </div>
//                   <div>
//                     <span className="font-medium">實際價格:</span> {product.real_price}
//                   </div>
//                   <div>
//                     <span className="font-medium">公開狀態:</span>{" "}
//                     {product.IsPublic ? "公開" : "不公開"}
//                   </div>
//                   <div>
//                     <span className="font-medium">學生數:</span>{" "}
//                     {product.Course?.Students.length ?? 0} /{" "}
//                     {product.Course?.maxStudents ?? "無上限"}
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductListsPage;