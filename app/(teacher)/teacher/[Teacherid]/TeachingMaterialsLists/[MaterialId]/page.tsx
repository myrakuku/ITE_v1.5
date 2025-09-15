"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CourseModul {
  id: string;
  title: string;
  description: string;
  TeacherId: string;
  Teaching_Materials: string | null;
  originalFileName: string | null;
  createdAt: string;
  updatedAt: string;
}

const TeachingMaterialsPageById = () => {
  const params = useParams();
const router = useRouter();
  const MaterialId = params.MaterialId as string;
  const [GetCousrseModul, setGetCousrseModul] = useState<CourseModul | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const fetchCourseModul = async (materialId: string) => {
      try {
        const res = await fetch(`/api/Course/Get_CourseModul_lists_by_Id/${materialId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data: CourseModul = await res.json();

        if (!data.Teaching_Materials) {
          setGetCousrseModul(data);
          return;
        }

        const objectKey = data.Teaching_Materials.split(
          "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com/"
        )[1];
        console.log("ObjectKey:", objectKey);
        if (!objectKey) throw new Error("無效的 Teaching_Materials URL");

        const ossRes = await fetch("/api/oss/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectKey,
            fileName: data.originalFileName,
          }),
        });

        const text = await ossRes.text();
        console.log("Raw response from /api/oss/get-signed-url:", text);
        if (!ossRes.ok) throw new Error(`無法獲取簽名 URL: ${text}`);
        const ossData = JSON.parse(text);

        setGetCousrseModul({ ...data, Teaching_Materials: ossData.url });
      } catch (error) {
        console.error("Fetch error:", error, JSON.stringify(error, null, 2));
        setError(error instanceof Error ? error.message : "無法載入教材數據");
      }
    };

    fetchCourseModul(MaterialId);
  }, [MaterialId]);

  const handleDelete = async () => {
    if (!confirm("確定要刪除此教材和相關文件嗎？此操作無法撤銷。")) return;

    setDeleting(true);
    try {
      const response = await fetch("/api/delete/delete-teaching-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId: MaterialId }),
      });

      const text = await response.text();
      console.log("Raw response from /api/delete/delete-teaching-material:", text);
      if (!response.ok) throw new Error(`刪除失敗: ${text}`);
      const result = JSON.parse(text);
      console.log("API Response:", result);

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccessMessage("教材和相關文件已成功刪除！");
      setGetCousrseModul(null); // 清空當前教材數據
      if (GetCousrseModul?.TeacherId) {
        router.push(`/teacher/${GetCousrseModul.TeacherId}/TeachingMaterialsLists`);
      } else {
        console.error("TeacherId 不存在，無法導航");
        setError("無法導航至教材列表頁面：缺少 TeacherId");
      }
    } catch (error) {
      console.error("Delete error:", error, JSON.stringify(error, null, 2));
      setError(error instanceof Error ? error.message : "刪除教材失敗");
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetCousrseModul) {
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
          <h1 className="text-2xl font-bold mb-6">教材資料</h1>
          {successMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-4 bg-green-600 px-4 py-2 rounded-md text-center"
            >
              {successMessage}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <span className="font-medium">標題:</span> {GetCousrseModul.title}
            </div>
            <div>
              <span className="font-medium">描述:</span> {GetCousrseModul.description}
            </div>
            <div>
              <span className="font-medium">創建時間:</span>{" "}
              {new Date(GetCousrseModul.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">更新時間:</span>{" "}
              {new Date(GetCousrseModul.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">教材檔案:</span>{" "}
              {GetCousrseModul.Teaching_Materials ? (
                <a
                  href={GetCousrseModul.Teaching_Materials}
                  download={GetCousrseModul.originalFileName}
                  className="text-blue-400 hover:underline"
                >
                  下載 ({GetCousrseModul.originalFileName})
                </a>
              ) : (
                "無檔案"
              )}
            </div>
            <div className="mt-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded-md text-white ${
                  deleting ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting ? "刪除中..." : "刪除教材"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingMaterialsPageById;

// "use client";

// import { uploadTeachingMaterial } from "@/app/actions/Create/UploadTeachingMaterial";
// import { useParams } from "next/navigation";
// import { useEffect, useState, useRef } from "react";

// interface CourseModul {
//   id: string;
//   title: string;
//   description: string;
//   TeacherId: string;
//   Teaching_Materials: string | null;
//   originalFileName: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// const TeachingMaterialsPageById = () => {
//   const params = useParams();
//   const MaterialId = params.MaterialId as string;
//   const [GetCousrseModul, setGetCousrseModul] = useState<CourseModul | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   useEffect(() => {
//     const fetchCourseModul = async (materialId: string) => {
//       try {
//         const res = await fetch(`/api/Course/Get_CourseModul_lists_by_Id/${materialId}`);
//         if (!res.ok) {
//           throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         }
//         const data: CourseModul = await res.json();

//         if (!data.Teaching_Materials) {
//           setGetCousrseModul(data);
//           return;
//         }

//         const objectKey = data.Teaching_Materials.split(
//           "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com/"
//         )[1];
//         const ossRes = await fetch("/api/oss/get-signed-url", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             objectKey,
//             fileName: data.originalFileName,
//           }),
//         });
//         if (!ossRes.ok) throw new Error("無法獲取簽名 URL");
//         const ossData = await ossRes.json();

//         setGetCousrseModul({ ...data, Teaching_Materials: ossData.url });
//       } catch (error) {
//         setError(error instanceof Error ? error.message : "無法載入教材數據");
//       }
//     };

//     fetchCourseModul(MaterialId);
//   }, [MaterialId]);

// const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const file = event.target.files?.[0];
//   if (!file) return;

//   console.log("File size:", file.size, "bytes");

//   const maxSize = 30 * 1024 * 1024;
//   if (file.size > maxSize) {
//     setError("文件大小超過 30MB 限制");
//     return;
//   }

//   setUploading(true);
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("materialId", MaterialId);

//     console.log("Uploading file:", file.name);
//     const response = await fetch("/api/upload/upload-teaching-material", {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();
//     console.log("API Response:", result);

//     if (!result.success) {
//       throw new Error(result.message);
//     }

//     setGetCousrseModul((prev) =>
//       prev
//         ? {
//             ...prev,
//             Teaching_Materials: result.url ?? null,
//             originalFileName: file.name,
//           }
//         : prev
//     );
//     setSuccessMessage("檔案上傳並更新資料庫成功！");
//   } catch (error) {
//     console.error("Upload error:", error);
//     setError(error instanceof Error ? error.message : "檔案上傳失敗");
//   } finally {
//     setUploading(false);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   }
// };

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
//       </div>
//     );
//   }

//   if (!GetCousrseModul) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-lg">載入中...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-gray-800 shadow-lg rounded-md p-6">
//           <h1 className="text-2xl font-bold mb-6">教材資料</h1>
//           {successMessage && (
//             <div
//               role="alert"
//               aria-live="polite"
//               className="mb-4 bg-green-600 px-4 py-2 rounded-md text-center"
//             >
//               {successMessage}
//             </div>
//           )}
//           <div className="space-y-4">
//             <div>
//               <span className="font-medium">標題:</span> {GetCousrseModul.title}
//             </div>
//             <div>
//               <span className="font-medium">描述:</span> {GetCousrseModul.description}
//             </div>
//             <div>
//               <span className="font-medium">創建時間:</span>{" "}
//               {new Date(GetCousrseModul.createdAt).toLocaleString()}
//             </div>
//             <div>
//               <span className="font-medium">更新時間:</span>{" "}
//               {new Date(GetCousrseModul.updatedAt).toLocaleString()}
//             </div>
//             <div>
//               <span className="font-medium">教材檔案:</span>{" "}
//               {GetCousrseModul.Teaching_Materials ? (
//                 <a
//                   href={GetCousrseModul.Teaching_Materials}
//                   download={GetCousrseModul.originalFileName}
//                   className="text-blue-400 hover:underline"
//                 >
//                   下載 ({GetCousrseModul.originalFileName})
//                 </a>
//               ) : (
//                 "無檔案"
//               )}
//             </div>
//             <div className="mt-2">
//               <label className="font-medium">更新檔案:</label>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileUpload}
//                 className="ml-2"
//                 disabled={uploading}
//               />
//               {uploading && <span className="ml-2 text-gray-400">上傳中...</span>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeachingMaterialsPageById;