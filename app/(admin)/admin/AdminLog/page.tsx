// "use client";

// import { useEffect, useState } from "react";

// import { Download } from "lucide-react";
// import { utils, writeFile } from "xlsx";
// import { toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// // 定義數據類型（基於 Prisma Schema）
// interface User {
//   id: string;
//   username: string;
//   email?: string;
//   role: "USER" | "ADMIN" | "TEACHER";
//   name?: string;
//   createdAt: string;
//   // 其他欄位...
// }

// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   startDate?: string;
//   endDate?: string;
//   createdAt: string;
//   // 其他欄位...
// }

// interface Invoice {
//   id: string;
//   title: string;
//   studentname: string;
//   price: number;
//   Invoice_id: string;
//   servetype: string;
//   createdAt: string;
//   // 其他欄位...
// }

// const AdminLog = () => {
//   // 狀態管理
//   const [GetUserData, setGetUserData] = useState<User[]>([]);
//   const [GetCourseData, setGetCourseData] = useState<Course[]>([]);
//   const [GetInvoicData, setGetInvoicData] = useState<Invoice[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   // 搜索狀態
//   const [userSearch, setUserSearch] = useState("");
//   const [courseSearch, setCourseSearch] = useState("");
//   const [invoiceSearch, setInvoiceSearch] = useState("");

//   // 數據獲取
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await fetch("/api/user/Get_User_Lists");
//         if (!res.ok) throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         const data = await res.json();
//         if (data.error) throw new Error(data.error);
//         setGetUserData(data);
//       } catch (error) {
//         console.error("fetchUserData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取用戶數據");
//         toast.error(error instanceof Error ? error.message : "無法獲取用戶數據");
//       }
//     };

//     const fetchCourseData = async () => {
//       try {
//         const res = await fetch("/api/Course/Get_Course_Lists");
//         if (!res.ok) throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         const data = await res.json();
//         if (data.error) throw new Error(data.error);
//         setGetCourseData(data);
//       } catch (error) {
//         console.error("fetchCourseData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取課程數據");
//         toast.error(error instanceof Error ? error.message : "無法獲取課程數據");
//       }
//     };

//     const fetchInvoicData = async () => {
//       try {
//         const res = await fetch("/api/Invoice_Lists");
//         if (!res.ok) throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         const data = await res.json();
//         if (data.error) throw new Error(data.error);
//         setGetInvoicData(data);
//       } catch (error) {
//         console.error("fetchInvoicData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取發票數據");
//         toast.error(error instanceof Error ? error.message : "無法獲取發票數據");
//       }
//     };

//     fetchUserData();
//     fetchCourseData();
//     fetchInvoicData();
//   }, []);

//   // 搜索過濾
//   const filteredUsers = GetUserData.filter(
//     (user) =>
//       user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
//       user.email?.toLowerCase().includes(userSearch.toLowerCase())
//   );

//   const filteredCourses = GetCourseData.filter((course) =>
//     course.title.toLowerCase().includes(courseSearch.toLowerCase())
//   );

//   const filteredInvoices = GetInvoicData.filter((invoice) =>
//     invoice.title.toLowerCase().includes(invoiceSearch.toLowerCase())
//   );

//   // 分離 USER 和 TEACHER
//   const userList = filteredUsers.filter((user) => user.role === "USER");
//   const teacherList = filteredUsers.filter((user) => user.role === "TEACHER");

//   // 導出功能
//   const exportToCSV = (data: any[], filename: string) => {
//     const worksheet = utils.json_to_sheet(data);
//     const workbook = utils.book_new();
//     utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     writeFile(workbook, `${filename}.xlsx`);
//     toast.success(`已導出 ${filename}.xlsx`);
//   };

//   // 列表組件
//   const renderTable = (
//     title: string,
//     data: any[],
//     columns: { key: string; label: string }[],
//     search: string,
//     setSearch: (value: string) => void,
//     exportFilename: string
//   ) => (
//     <div className="mb-8">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">{title}</h2>
//         <div className="flex gap-2">
//           <Input
//             type="text"
//             placeholder={`搜索 ${title}...`}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded px-2 py-1"
//           />
//           <Button
//             onClick={() => exportToCSV(data, exportFilename)}
//             className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             <Download size={16} />
//             導出
//           </Button>
//         </div>
//       </div>
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-100">
//             {columns.map((col) => (
//               <th key={col.key} className="border p-2">{col.label}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.length > 0 ? (
//             data.map((item, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 {columns.map((col) => (
//                   <td key={col.key} className="border p-2">
//                     {item[col.key] || "-"}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={columns.length} className="text-center p-4">
//                 無數據
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Admin Log</h1>
//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       {/* 用戶列表 (USER) */}
//       {renderTable(
//         "用戶列表",
//         userList,
//         [
//           { key: "username", label: "用戶名" },
//           { key: "email", label: "電子郵件" },
//           { key: "createdAt", label: "創建時間" },
//         ],
//         userSearch,
//         setUserSearch,
//         "Users"
//       )}

//       {/* 教師列表 (TEACHER) */}
//       {renderTable(
//         "教師列表",
//         teacherList,
//         [
//           { key: "username", label: "用戶名" },
//           { key: "email", label: "電子郵件" },
//           { key: "createdAt", label: "創建時間" },
//         ],
//         userSearch,
//         setUserSearch,
//         "Teachers"
//       )}

//       {/* 課程列表 */}
//       {renderTable(
//         "課程列表",
//         filteredCourses,
//         [
//           { key: "title", label: "課程標題" },
//           { key: "courseCode", label: "課程代碼" },
//           { key: "schoolName", label: "學校" },
//           { key: "startDate", label: "開始日期" },
//         ],
//         courseSearch,
//         setCourseSearch,
//         "Courses"
//       )}

//       {/* 發票列表 */}
//       {renderTable(
//         "發票列表",
//         filteredInvoices,
//         [
//           { key: "title", label: "發票標題" },
//           { key: "Invoice_id", label: "發票編號" },
//           { key: "studentname", label: "學生姓名" },
//           { key: "price", label: "金額" },
//         ],
//         invoiceSearch,
//         setInvoiceSearch,
//         "Invoices"
//       )}
//     </div>
//   );
// };

// export default AdminLog;


"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 定義數據類型（基於 Prisma Schema）
interface User {
  id: string;
  username: string;
  email?: string;
  role: "USER" | "ADMIN" | "TEACHER";
  name?: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  title: string;
  studentname: string;
  price: number;
  Invoice_id: string;
  servetype: string;
  createdAt: string;
}

// 定義聯合類型
type TableData = User | Course | Invoice;

const AdminLog = () => {
  // 狀態管理
  const [GetUserData, setGetUserData] = useState<User[]>([]);
  const [GetCourseData, setGetCourseData] = useState<Course[]>([]);
  const [GetInvoicData, setGetInvoicData] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 搜索狀態
  const [userSearch, setUserSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");

  // 數據獲取
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/Get_User_Lists");
        if (!res.ok) throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setGetUserData(data);
      } catch (error) {
        console.error("fetchUserData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取用戶數據");
        toast.error(error instanceof Error ? error.message : "無法獲取用戶數據");
      }
    };

    const fetchCourseData = async () => {
      try {
        const res = await fetch("/api/Course/Get_Course_Lists");
        if (!res.ok) throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setGetCourseData(data);
      } catch (error) {
        console.error("fetchCourseData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取課程數據");
        toast.error(error instanceof Error ? error.message : "無法獲取課程數據");
      }
    };

    const fetchInvoicData = async () => {
      try {
        const res = await fetch("/api/Invoice_Lists");
        if (!res.ok) throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setGetInvoicData(data);
      } catch (error) {
        console.error("fetchInvoicData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取發票數據");
        toast.error(error instanceof Error ? error.message : "無法獲取發票數據");
      }
    };

    fetchUserData();
    fetchCourseData();
    fetchInvoicData();
  }, []);

  // 搜索過濾
  const filteredUsers = GetUserData.filter(
    (user) =>
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCourses = GetCourseData.filter((course) =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const filteredInvoices = GetInvoicData.filter((invoice) =>
    invoice.title.toLowerCase().includes(invoiceSearch.toLowerCase())
  );

  // 分離 USER 和 TEACHER
  const userList = filteredUsers.filter((user) => user.role === "USER");
  const teacherList = filteredUsers.filter((user) => user.role === "TEACHER");

  // 導出功能
  const exportToCSV = <T extends TableData>(data: T[], filename: string) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, `${filename}.xlsx`);
    toast.success(`已導出 ${filename}.xlsx`);
  };

  // 列表組件
  const renderTable = <T extends TableData>(
    title: string,
    data: T[],
    columns: { key: keyof T; label: string }[],
    search: string,
    setSearch: (value: string) => void,
    exportFilename: string
  ) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={`搜索 ${title}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <Button
            onClick={() => exportToCSV(data, exportFilename)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            <Download size={16} />
            導出
          </Button>
        </div>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th key={col.key as string} className="border p-2">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key as string} className="border p-2">
                     {String(item[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-4">
                無數據
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Log</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* 用戶列表 (USER) */}
      {renderTable<User>(
        "用戶列表",
        userList,
        [
          { key: "username", label: "用戶名" },
          { key: "email", label: "電子郵件" },
          { key: "createdAt", label: "創建時間" },
        ],
        userSearch,
        setUserSearch,
        "Users"
      )}

      {/* 教師列表 (TEACHER) */}
      {renderTable<User>(
        "教師列表",
        teacherList,
        [
          { key: "username", label: "用戶名" },
          { key: "email", label: "電子郵件" },
          { key: "createdAt", label: "創建時間" },
        ],
        userSearch,
        setUserSearch,
        "Teachers"
      )}

      {/* 課程列表 */}
      {renderTable<Course>(
        "課程列表",
        filteredCourses,
        [
          { key: "title", label: "課程標題" },
          { key: "courseCode", label: "課程代碼" },
          { key: "schoolName", label: "學校" },
          { key: "startDate", label: "開始日期" },
        ],
        courseSearch,
        setCourseSearch,
        "Courses"
      )}

      {/* 發票列表 */}
      {renderTable<Invoice>(
        "發票列表",
        filteredInvoices,
        [
          { key: "title", label: "發票標題" },
          { key: "Invoice_id", label: "發票編號" },
          { key: "studentname", label: "學生姓名" },
          { key: "price", label: "金額" },
        ],
        invoiceSearch,
        setInvoiceSearch,
        "Invoices"
      )}
    </div>
  );
};

export default AdminLog;