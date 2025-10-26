// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { z } from "zod";
// import Link from "next/link";
// import { updateSpecialCourse, uploadImageToOSS } from "@/app/actions/Update/updateSpecialCourseMedia";

// // 定義表單數據結構
// const UpdateSpecialCourseSchema = z.object({
//   imgUrl: z.string().url("請輸入有效的圖片 URL").optional().nullable(),
//   videoUrl: z.string().url("請輸入有效的影片 URL").optional().nullable(),
//   price: z.number().min(0, "價格必須大於或等於 0").optional().nullable(),
// });

// // 定義課程數據接口
// interface SpecialCourseData {
//   id: string;
//   IMG_URL: string | null;
//   Video_URL: string | null;
//   price: number | null;
// }

// const EditSpecialCourse = () => {
//   const params = useParams();
//   const router = useRouter();
//   const courseId = params.SpecialCourseId as string;
//   console.log("params:",params,"-- End --");
//   const [formData, setFormData] = useState<{
//     imgUrl: string | null;
//     videoUrl: string | null;
//     price: number | null;
//   }>({ imgUrl: null, videoUrl: null, price: null });
//   const [file, setFile] = useState<File | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [courseData, setCourseData] = useState<SpecialCourseData | null>(null);

//   // 獲取課程初始數據
//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/SpecialCourse/Get_SpecialCourse_by_ID/${courseId}`);
//         if (!response.ok) {
//           throw new Error(`請求失敗: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log("data:",data,"-- End --");
//         setCourseData(data);
//         setFormData({
//           imgUrl: data.IMG_URL || null,
//           videoUrl: data.Video_URL || null,
//           price: data.price || null,
//         });
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "無法獲取課程數據");
//         toast.error(err instanceof Error ? err.message : "無法獲取課程數據");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (courseId) {
//       fetchCourseData();
//     }
//   }, [courseId]);

//   // 處理圖片上傳
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       try {
//         const formData = new FormData();
//         formData.append("file", selectedFile);
//         formData.append("courseId", courseId);

//         const result = await uploadImageToOSS(formData);
//         if (result.error || !result.url) {
//           throw new Error(result.error || "圖片上傳失敗");
//         }
//         setFormData((prev) => ({ ...prev, imgUrl: result.url ?? null }));

//         toast.success("圖片上傳成功");
//       } catch (err) {
//         setError("圖片上傳失敗");
//         toast.error("圖片上傳失敗");
//       }
//     }
//   };

//   // 處理表單輸入變化
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value === "" ? null : name === "price" ? Number(value) : value,
//     }));
//   };

//   // 提交表單
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const validatedData = UpdateSpecialCourseSchema.parse(formData);
//       const result = await updateSpecialCourse(courseId, validatedData);

//       if (result.error) {
//         throw new Error(result.error);
//       }

//       toast.success("課程數據更新成功");
//       router.push("/admin/SpecialCourseLists");
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         setError("輸入資料無效：" + err.errors.map((e) => e.message).join(", "));
//         toast.error("輸入資料無效：" + err.errors.map((e) => e.message).join(", "));
//       } else {
//         setError(err instanceof Error ? err.message : "更新課程失敗");
//         toast.error(err instanceof Error ? err.message : "更新課程失敗");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">編輯特殊課程</h1>
//           <Link
//             href="/admin/SpecialCourseLists"
//             className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
//           >
//             返回課程列表
//           </Link>
//         </div>

//         {error && (
//           <div className="bg-red-600 text-white p-4 rounded-md mb-6">
//             {error}
//           </div>
//         )}

//         {isLoading && !courseData ? (
//           <div className="text-center py-10">載入中...</div>
//         ) : (
//           <form onSubmit={handleSubmit} className="bg-gray-700 rounded-md p-6 shadow-lg">
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">上傳圖片 (IMG_URL)</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
//               />
//               {formData.imgUrl && (
//                 <div className="mt-2">
//                   <img
//                     src={formData.imgUrl}
//                     alt="課程圖片"
//                     className="h-32 w-auto rounded-md"
//                   />
//                   <p className="text-sm text-gray-300 mt-1">{formData.imgUrl}</p>
//                 </div>
//               )}
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">影片網址 (Video_URL)</label>
//               <input
//                 type="url"
//                 name="videoUrl"
//                 value={formData.videoUrl || ""}
//                 onChange={handleInputChange}
//                 placeholder="輸入影片 URL"
//                 className="w-full p-2 rounded-md bg-gray-800 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-2">價格 (Price)</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price ?? ""}
//                 onChange={handleInputChange}
//                 placeholder="輸入價格"
//                 step="0.01"
//                 className="w-full p-2 rounded-md bg-gray-800 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isLoading ? "正在更新..." : "確定"}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditSpecialCourse;

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { updateSpecialCourse, uploadImageToOSS } from "@/app/actions/Update/updateSpecialCourseMedia";

// 定義表單數據結構
const UpdateSpecialCourseSchema = z.object({
  imgUrl: z.string().url("請輸入有效的圖片 URL").optional().nullable(),
  videoUrl: z.string().url("請輸入有效的影片 URL").optional().nullable(),
  price: z.number().min(0, "價格必須大於或等於 0").optional().nullable(),
});

// 定義課程數據接口
interface SpecialCourseData {
  id: string;
  IMG_URL: string | null;
  Video_URL: string | null;
  price: number | null;
}

const EditSpecialCourse = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.SpecialCourseId as string;
  console.log("params:", params, "-- End --");
  const [formData, setFormData] = useState<{
    imgUrl: string | null;
    videoUrl: string | null;
    price: number | null;
  }>({ imgUrl: null, videoUrl: null, price: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<SpecialCourseData | null>(null);

  // 獲取課程初始數據
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/SpecialCourse/Get_SpecialCourse_by_ID/${courseId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        console.log("data:", data, "-- End --");
        setCourseData(data);
        setFormData({
          imgUrl: data.IMG_URL || null,
          videoUrl: data.Video_URL || null,
          price: data.price || null,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "無法獲取課程數據";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // 處理圖片上傳
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("courseId", courseId);

        const result = await uploadImageToOSS(formData);
        if (result.error || !result.url) {
          throw new Error(result.error || "圖片上傳失敗");
        }
        setFormData((prev) => ({ ...prev, imgUrl: result.url ?? null }));
        toast.success("圖片上傳成功");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "圖片上傳失敗";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  // 處理表單輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : name === "price" ? Number(value) : value,
    }));
  };

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const validatedData = UpdateSpecialCourseSchema.parse(formData);
      const result = await updateSpecialCourse(courseId, validatedData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("課程數據更新成功");
      router.push("/admin/SpecialCourseLists");
    } catch (err) {
      const errorMessage = err instanceof z.ZodError
        ? "輸入資料無效：" + err.errors.map((e) => e.message).join(", ")
        : err instanceof Error
        ? err.message
        : "更新課程失敗";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">編輯特殊課程</h1>
          <Link
            href="/admin/SpecialCourseLists"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            返回課程列表
          </Link>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading && !courseData ? (
          <div className="text-center py-10">載入中...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-700 rounded-md p-6 shadow-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">上傳圖片 (IMG_URL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
              />
              {formData.imgUrl && (
                <div className="mt-2 relative h-32 w-48">
                  <Image
                    src={formData.imgUrl}
                    alt="課程圖片"
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <p className="text-sm text-gray-300 mt-1">{formData.imgUrl}</p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">影片網址 (Video_URL)</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl || ""}
                onChange={handleInputChange}
                placeholder="輸入影片 URL"
                className="w-full p-2 rounded-md bg-gray-800 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">價格 (Price)</label>
              <input
                type="number"
                name="price"
                value={formData.price ?? ""}
                onChange={handleInputChange}
                placeholder="輸入價格"
                step="0.01"
                className="w-full p-2 rounded-md bg-gray-800 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "正在更新..." : "確定"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSpecialCourse;