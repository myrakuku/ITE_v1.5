// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface TeacherDatabyId {
//   id: string;
//   username: string;
//   password: string;
//   phone: string;
//   phoneVerified: boolean | null;
//   name: string;
//   role: string;
//   teacherholidaysDateTime: string[];
//   CourseModul:string[];
//   createdAt: string;
//   updatedAt: string;
// }

// const TeacherDatabyIdPage = () => {
//   const params = useParams();
//   const TeacherId = params.TeacherId as string;

//   const [GetTeacherData, setGetTeacherData] = useState<TeacherDatabyId | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTeacherData = async () => {
//       try {
//         const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
//         if (!res.ok) {
//           throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         }
//         const data = await res.json();
//         setGetTeacherData(data);
//       } catch (error) {
//         setError(error instanceof Error ? error.message : "無法載入老師數據");
//       }
//     };
//     fetchTeacherData();
//   }, [TeacherId]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
//       </div>
//     );
//   }

//   if (!GetTeacherData) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
//         <div className="text-lg">載入中...</div>
//       </div>
//     );
//   }

//   console.log("GetTeacherData : ",GetTeacherData)

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-gray-800 shadow-lg rounded-md p-6">
//           <h1 className="text-2xl font-bold mb-6">教師資料</h1>
//           <div className="space-y-4">
//             <div>
//               <span className="font-medium">教師 ID:</span> {GetTeacherData.id}
//             </div>
//             <div>
//               <span className="font-medium">用戶名:</span> {GetTeacherData.username}
//             </div>
//             <div>
//               <span className="font-medium">姓名:</span> {GetTeacherData.name}
//             </div>
//             <div>
//               <span className="font-medium">電話:</span> {GetTeacherData.phone}
//             </div>
//             <div>
//               <span className="font-medium">角色:</span> {GetTeacherData.role}
//             </div>
//             <div>
//               <span className="font-medium">創建時間:</span>{" "}
//               {new Date(GetTeacherData.createdAt).toLocaleString()}
//             </div>
//             <div>
//               <span className="font-medium">更新時間:</span>{" "}
//               {new Date(GetTeacherData.updatedAt).toLocaleString()}
//             </div>
//             <div>
//               <span className="font-medium">假期:</span>{" "}
//               {GetTeacherData.teacherholidaysDateTime.length > 0
//                 ? GetTeacherData.teacherholidaysDateTime.join(", ")
//                 : "無假期"}
//             </div>

//                         <div>
//               <span className="font-medium">教材:</span>{" "}
//               {GetTeacherData.CourseModul.length > 0
//                 ? GetTeacherData.CourseModul.join(", ")
//                 : "無教材"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherDatabyIdPage;



"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  Teaching_Materials: string;
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
  TeacherId: string;
}

interface TeacherDatabyId {
  id: string;
  username: string;
  password: string;
  phone: string;
  phoneVerified: boolean | null;
  name: string;
  role: string;
  teacherholidaysDateTime: string[];
  CourseModul: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

const TeacherDatabyIdPage = () => {
  const params = useParams();
  const TeacherId = params.TeacherId as string;

  const [GetTeacherData, setGetTeacherData] = useState<TeacherDatabyId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setGetTeacherData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "無法載入老師數據");
      }
    };
    fetchTeacherData();
  }, [TeacherId]);


// useEffect(() => {
//   const fetchTeacherData = async () => {
//     try {
//       const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
//       if (!res.ok) {
//         throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//       }
//       const data = await res.json();

//       // 為每個 CourseModule 的 Teaching_Materials 生成簽名 URL
//       const updatedCourseModules = await Promise.all(
//         data.CourseModul.map(async (module: CourseModule) => {
//           if (!module.Teaching_Materials) return module;
//           const objectKey = module.Teaching_Materials.split(
//             "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com/"
//           )[1];
//           const ossRes = await fetch("/api/oss/get-signed-url", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               objectKey,
//               fileName: module.originalFileName,
//             }),
//           });
//           if (!ossRes.ok) throw new Error("無法獲取簽名 URL");
//           const ossData = await ossRes.json();
//           return { ...module, Teaching_Materials: ossData.url };
//         })
//       );

//       setGetTeacherData({ ...data, CourseModul: updatedCourseModules });
//     } catch (error) {
//       setError(error instanceof Error ? error.message : "無法載入老師數據");
//     }
//   };
//   fetchTeacherData();
// }, [TeacherId]);


  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!GetTeacherData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/TeacherLists">
          返回
        </Link>
        <div className="bg-gray-800 shadow-lg rounded-md p-6">
          <h1 className="text-2xl font-bold mb-6">教師資料</h1>
          <div className="space-y-4">
            <div>
              <span className="font-medium">教師 ID:</span> {GetTeacherData.id}
            </div>
            <div>
              <span className="font-medium">用戶名:</span> {GetTeacherData.username}
            </div>
            <div>
              <span className="font-medium">姓名:</span> {GetTeacherData.name}
            </div>
            <div>
              <span className="font-medium">電話:</span> {GetTeacherData.phone}
            </div>
            <div>
              <span className="font-medium">角色:</span> {GetTeacherData.role}
            </div>
            <div>
              <span className="font-medium">創建時間:</span>{" "}
              {new Date(GetTeacherData.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">更新時間:</span>{" "}
              {new Date(GetTeacherData.updatedAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">假期:</span>{" "}
              {GetTeacherData.teacherholidaysDateTime.length > 0
                ? GetTeacherData.teacherholidaysDateTime.join(", ")
                : "無假期"}
            </div>
            <div>
              <span className="font-medium">教材:</span>{" "}
              {GetTeacherData.CourseModul.length > 0 ? (
                <ul className="list-disc pl-5">
                  {GetTeacherData.CourseModul.map((module) => (
                    <li key={module.id}>
                      {module.title} -{" "}
                      <a
                        href={module.Teaching_Materials}
                        download={module.originalFileName}
                        className="text-blue-400 hover:underline"
                      >
                        下載 ({module.originalFileName})
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                "無教材"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDatabyIdPage;