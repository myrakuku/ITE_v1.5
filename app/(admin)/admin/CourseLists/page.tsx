"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface User {
  id: string;
  username: string;
  name: string | null;
  role: "USER" | "ADMIN" | "TEACHER";
  teacherholidaysDateTime: string[];
  createdAt: string;
  updatedAt: string;
  password: string;
  phone: string | null;
  phoneVerified: string | null;
}

interface SelectedCourseTimeRange {
  id: string;
  timeRange: string;
  starttime: string | null;
  endtime: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[];
  numberOfDays: number;
  timeHours: number;
  timeRange: string[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  Producted: boolean;
  type: string[];
  classroom: string | null;
  weekday: string | null;
  createdAt: string;
  updatedAt: string;
  CourseModul: {
    id: string;
    title: string;
    description: string;
    Teaching_Materials: string | null;
    createdAt: string;
    updatedAt: string;
    TeacherId: string;
  } | null;
  courseModulId: string | null;
  CourseTimeRanges: SelectedCourseTimeRange[];
  Students: string[];
  // 特殊課程的學生格式不同
  StudentsWithDetails?: Array<{ id: string; username: string; name: string }>;
}

interface GroupedCourse {
  course: Course;
  dates: string[];
}

const CourseListsPage = () => {
  const [getCourseLists, setGetCourseLists] = useState<Course[]>([]);
  const [getTeacherData, setGetTeacherData] = useState<User[]>([]);
  const [getSpecialCourseLists, setGetSpecialCourseLists] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const coursesPerPage = 10;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/Course/Get_Course_Lists`);
        if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetCourseLists(data);
      } catch (error) {
        console.error("fetchCourseData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取課程數據");
      }
    };

    const fetchSpecialCourseData = async () => {
      try {
        const response = await fetch(`/api/SpecialCourse/SpecialCourse_Lists`);
        if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetSpecialCourseLists(data);
      } catch (error) {
        console.error("fetchSpecialCourseData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取特殊課程數據");
      }
    };

    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`/api/user/Get_User_Lists`);
        if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetTeacherData(data);
      } catch (error) {
        console.error("fetchTeacherData error:", error);
        setError(error instanceof Error ? error.message : "無法獲取教師數據");
      }
    };

    fetchCourseData();
    fetchTeacherData();
    fetchSpecialCourseData();
  }, []);

  // 搜尋過濾
  const filteredCourses = getCourseLists.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      course.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 分組邏輯
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const key = `${course.courseCode}-${course.courseModulId || "no-module"}`;
    if (!acc[key]) {
      acc[key] = { course, dates: [] };
    }
    acc[key].dates.push(...course.Coursedates);
    return acc;
  }, {} as Record<string, GroupedCourse>);

  const groupedCoursesArray = Object.values(groupedCourses);
  const totalPages = Math.ceil(groupedCoursesArray.length / coursesPerPage);
  const paginatedGroupedCourses = groupedCoursesArray.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  // 建立 userId → name 的映射
  const userIdToName = new Map<string, string>();
  getTeacherData.forEach(user => {
    if (user.id) {
      userIdToName.set(user.id, user.name || user.username || "未知用戶");
    }
  });

  const getStudentNames = (studentIds: string[]): string[] => {
    const uniqueNames = new Set<string>();
    studentIds.forEach(id => {
      const name = userIdToName.get(id);
      if (name) uniqueNames.add(name);
    });
    return Array.from(uniqueNames);
  };

  // 取得該堂課的時間段文字（優先取第一筆 CourseTimeRanges）
  const getTimeRangeText = (course: Course): string => {
    if (!course.CourseTimeRanges || course.CourseTimeRanges.length === 0) {
      return "未設定時間";
    }
    const first = course.CourseTimeRanges[0];
    if (first.starttime && first.endtime) {
      return `${first.starttime} - ${first.endtime}`;
    }
    if (first.timeRange) {
      return first.timeRange; // 如 morning / afternoon
    }
    return "未設定時間";
  };

  // FullCalendar 事件
  const calendarEvents = [
    // 普通課程
    ...getCourseLists.flatMap((course) =>
      course.Coursedates.map((date) => ({
        title: `${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"}`,
        date,
        allDay: true,
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
        extendedProps: {
          courseType: "regular",
          courseData: course,
          students: course.Students,
          timeRangeText: getTimeRangeText(course),
        },
      }))
    ),

    // 特殊課程
    ...getSpecialCourseLists.flatMap((course) =>
      course.Coursedates.map((date) => ({
        title: `[特殊] ${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"}`,
        date,
        allDay: true,
        backgroundColor: "#dc2626",
        borderColor: "#dc2626",
        extendedProps: {
          courseType: "special",
          courseData: course,
          students: course.StudentsWithDetails || course.Students,
          timeRangeText: getTimeRangeText(course),
        },
      }))
    ),

    // 教師休假
    ...getTeacherData
      .filter((user) => user.role === "TEACHER")
      .flatMap((user) =>
        user.teacherholidaysDateTime.map((date) => ({
          title: `${user.name || user.username} 放假`,
          date,
          allDay: true,
          backgroundColor: "#f97316",
          borderColor: "#f97316",
          extendedProps: {
            courseType: "holiday",
            timeRangeText: "全日休假",
          },
        }))
      ),
  ];

  console.log("getCourseLists :",getCourseLists,"-- End --")


  console.log("getSpecialCourseLists :",getSpecialCourseLists,"-- End --")


  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">課程列表（排堂）</h1>
          <Link
            href="/admin/CourseLists/ArrangeCourse"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            新增課程
          </Link>
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋課程名稱、教師或學校..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 列表部分保持不變 */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
          {paginatedGroupedCourses.length === 0 ? (
            <p className="p-4 text-gray-400">無課程數據或正在加載...</p>
          ) : (
            <div className="divide-y divide-gray-700">
              {paginatedGroupedCourses.map(({ course, dates }) => (
                <Disclosure key={`${course.id}-${course.courseModulId || "no-module"}`} as="div">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full px-4 py-3 hover:bg-gray-700 transition justify-between items-center">
                        <span className="text-base font-medium">
                          {course.courseCode} - {course.title} - {course.startDate || "無開始日期"}
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 transform ${open ? "rotate-180" : ""}`} />
                      </Disclosure.Button>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Disclosure.Panel className="px-4 py-3 bg-gray-700 divide-y divide-gray-600">
                          {dates.map((date) => (
                            <div key={`${course.id}-${date}`} className="py-2 hover:bg-gray-600 transition">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{date}</span>
                                <div className="text-sm text-gray-400 text-right">
                                  <p>
                                    {course.teacher.join(", ")} - {course.classroom || "無教室"} - {course.schoolName}
                                  </p>
                                  <p className="text-xs text-yellow-400">
                                    時間：{getTimeRangeText(course)}
                                  </p>
                                  {course.Students && course.Students.length > 0 && (
                                    <p className="mt-1 text-xs text-green-400">
                                      學生: {getStudentNames(course.Students).join(", ")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          )}
        </div>

        {/* 分頁 */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              上一頁
            </button>
            <span className="px-3 py-2 text-gray-400">
              第 {currentPage} 頁 / 共 {totalPages} 頁
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              下一頁
            </button>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Link
            href="/admin/CourseLists/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            在這改課程
          </Link>
        </div>

        {/* FullCalendar + 點擊顯示時間 */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-8">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={calendarEvents}
            locale="zh-tw"
            height="650px"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            buttonText={{
              today: "今天",
              month: "月",
              week: "週",
            }}
            eventClick={(info) => {
              const props = info.event.extendedProps;
              const courseType = props.courseType as string;
              const timeRangeText = props.timeRangeText as string;

              let studentsText = "無學生";
              if (courseType === "regular") {
                const names = getStudentNames(props.students as string[]);
                studentsText = names.length > 0 ? names.join(", ") : "無學生";
              } else if (courseType === "special") {
                const arr = props.students as Array<{ id: string; username: string; name: string }>;
                if (arr && arr.length > 0) {
                  studentsText = arr.map(s => s.name || s.username || "未知學生").join(", ");
                }
              }

              const prefix = courseType === "special" ? "[特殊課程] " : courseType === "holiday" ? "[教師休假] " : "";

              alert(
                `${prefix}事件：${info.event.title}\n` +
                `日期：${info.event.startStr}\n` +
                `時間：${timeRangeText}\n` +
                `學生：${studentsText}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseListsPage;

// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { Disclosure, Transition } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";

// interface User {
//   id: string;
//   username: string;
//   name: string | null;
//   role: "USER" | "ADMIN" | "TEACHER";
//   teacherholidaysDateTime: string[];
//   createdAt: string;
//   updatedAt: string;
//   password: string;
//   phone: string | null;
//   phoneVerified: string | null;
// }

// interface SelectedCourseTimeRange {
//   id: string;
//   timeRange: string;
//   starttime: string | null;
//   endtime: string | null;
// }

// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   startDate: string | null;
//   endDate: string | null;
//   Coursedates: string[];
//   numberOfDays: number;
//   timeHours: number;
//   timeRange: string[];
//   teacher: string[];
//   teacherId: string;
//   isPublic: boolean;
//   isProduct: boolean;
//   Producted: boolean;
//   type: string[];
//   classroom: string | null;
//   weekday: string | null;
//   createdAt: string;
//   updatedAt: string;
//   CourseModul: {
//     id: string;
//     title: string;
//     description: string;
//     Teaching_Materials: string | null;
//     createdAt: string;
//     updatedAt: string;
//     TeacherId: string;
//   } | null;
//   courseModulId: string | null;
//   CourseTimeRanges: SelectedCourseTimeRange[];
//   Students: string[];
// }

// interface GroupedCourse {
//   course: Course;
//   dates: string[];
// }

// const CourseListsPage = () => {
//   const [getCourseLists, setGetCourseLists] = useState<Course[]>([]);
//   const [getTeacherData, setGetTeacherData] = useState<User[]>([]);
//   const [getSpecialCourseLists, setGetSpecialCourseLists] = useState<Course[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const coursesPerPage = 10;

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await fetch(`/api/Course/Get_Course_Lists`);
//         if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);
//         setGetCourseLists(data);
//       } catch (error) {
//         console.error("fetchCourseData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取課程數據");
//       }
//     };

//     const fetchSpecialCourseData = async () => {
//       try {
//         const response = await fetch(`/api/SpecialCourse/SpecialCourse_Lists`);
//         if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);
//         setGetSpecialCourseLists(data);
//       } catch (error) {
//         console.error("fetchSpecialCourseData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取課程數據");
//       }
//     };

//     const fetchTeacherData = async () => {
//       try {
//         const response = await fetch(`/api/user/Get_User_Lists`);
//         if (!response.ok) throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         const data = await response.json();
//         if (data.error) throw new Error(data.error);
//         setGetTeacherData(data);
//       } catch (error) {
//         console.error("fetchTeacherData error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取教師數據");
//       }
//     };

//     fetchCourseData();
//     fetchTeacherData();
//     fetchSpecialCourseData();
//   }, []);

//   // 搜尋過濾
//   const filteredCourses = getCourseLists.filter(
//     (course) =>
//       course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       course.teacher.some((teacher) => teacher.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       course.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // 分組邏輯
//   const groupedCourses = filteredCourses.reduce((acc, course) => {
//     const key = `${course.courseCode}-${course.courseModulId || "no-module"}`;
//     if (!acc[key]) {
//       acc[key] = { course, dates: [] };
//     }
//     acc[key].dates.push(...course.Coursedates);
//     return acc;
//   }, {} as Record<string, GroupedCourse>);

//   const groupedCoursesArray = Object.values(groupedCourses);
//   const totalPages = Math.ceil(groupedCoursesArray.length / coursesPerPage);
//   const paginatedGroupedCourses = groupedCoursesArray.slice(
//     (currentPage - 1) * coursesPerPage,
//     currentPage * coursesPerPage
//   );

// // FullCalendar 事件 - 修复特殊课程的学生数据提取
// const calendarEvents = [
//   // === 普通课程 ===
//   ...getCourseLists.flatMap((course) =>
//     course.Coursedates.map((date) => ({
//       title: `${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"} - ${course.schoolName}`,
//       date,
//       allDay: true,
//       backgroundColor: "#2563eb",
//       borderColor: "#2563eb",
//       extendedProps: {
//         students: course.Students, // string[] 学生ID
//         courseType: "regular",
//         courseData: course // 保存完整课程数据以备后用
//       },
//     }))
//   ),

//   // === 特殊课程 ===
//   ...getSpecialCourseLists.flatMap((course) =>
//     course.Coursedates.map((date) => ({
//       title: `[特殊] ${course.title} - ${course.teacher.join(", ")} - ${course.classroom || "無教室"} - ${course.schoolName}`,
//       date,
//       allDay: true,
//       backgroundColor: "#dc2626",
//       borderColor: "#dc2626",
//       extendedProps: {
//         students: course.Students, // Array<{id, username, name}>
//         courseType: "special",
//         courseData: course // 保存完整课程数据
//       },
//     }))
//   ),

//   // === 教师休假 ===
//   ...getTeacherData
//     .filter((user) => user.role === "TEACHER")
//     .flatMap((user) =>
//       user.teacherholidaysDateTime.map((date) => ({
//         title: `${user.name || user.username} 放假`,
//         date,
//         allDay: true,
//         backgroundColor: "#f97316",
//         borderColor: "#f97316",
//         extendedProps: {
//           students: [],
//           courseType: "holiday",
//         },
//       }))
//     ),
// ];

//   console.log("getCourseLists : ", getCourseLists, "-- End --");
//   // console.log("getSpecialCourseLists : ", getSpecialCourseLists, "-- End --");
//   // console.log("paginatedGroupedCourses : ", paginatedGroupedCourses, "-- End --");

//   // === 新增：userId → name 映射 + 去重轉換函數 ===
//   const userIdToName = new Map<string, string>();
//   getTeacherData.forEach(user => {
//     if (user.id) {
//       userIdToName.set(user.id, user.name || user.username || "未知用戶");
//     }
//   });

//   const getStudentNames = (studentIds: string[]): string[] => {
//     const uniqueNames = new Set<string>();
//     studentIds.forEach(id => {
//       const name = userIdToName.get(id);
//       if (name) uniqueNames.add(name);
//     });
//     return Array.from(uniqueNames);
//   };
//   // === 結束 ===

//   return (
//     <div className="bg-gray-900 min-h-screen text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">課程列表（排堂）</h1>
//           <Link
//             href="/admin/CourseLists/ArrangeCourse"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
//           >
//             新增課程
//           </Link>
//         </div>

//         {error && <div className="mb-4 text-red-500">{error}</div>}

//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="搜尋課程名稱、教師或學校..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//           />
//         </div>

//         <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
//           {paginatedGroupedCourses.length === 0 ? (
//             <p className="p-4 text-gray-400">無課程數據或正在加載...</p>
//           ) : (
//             <div className="divide-y divide-gray-700">
//               {paginatedGroupedCourses.map(({ course, dates }) => (
//                 <Disclosure key={`${course.id}-${course.courseModulId || "no-module"}`} as="div">
//                   {({ open }) => (
//                     <>
//                       <Disclosure.Button className="flex w-full px-4 py-3 hover:bg-gray-700 transition justify-between items-center">
//                         <span className="text-base font-medium">
//                           {course.courseCode} - {course.title} - {course.startDate || "無開始日期"}
//                         </span>
//                         <ChevronDownIcon
//                           className={`w-5 h-5 transform ${open ? "rotate-180" : ""}`}
//                         />
//                       </Disclosure.Button>
//                       <Transition
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Disclosure.Panel className="px-4 py-3 bg-gray-700 divide-y divide-gray-600">
//                           {dates.map((date) => (
//                             <div key={`${course.id}-${date}`} className="py-2 hover:bg-gray-600 transition">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium">{date}</span>
//                                 <div className="text-sm text-gray-400 text-right">
//                                   <p>
//                                     {course.teacher.join(", ")} - {course.classroom || "無教室"} - {course.schoolName}
//                                   </p>

//                                   {/* 顯示學生姓名 */}
//                                   {course.Students && course.Students.length > 0 && (
//                                     <p className="mt-1 text-xs text-green-400">
//                                       學生: {getStudentNames(course.Students).join(", ")}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </Disclosure.Panel>
//                       </Transition>
//                     </>
//                   )}
//                 </Disclosure>
//               ))}
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && (
//           <div className="flex justify-center space-x-2 mb-6">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
//             >
//               上一頁
//             </button>
//             <span className="px-3 py-2 text-gray-400">
//               第 {currentPage} 頁 / 共 {totalPages} 頁
//             </span>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
//             >
//               下一頁
//             </button>
//           </div>
//         )}

//         <div className="flex justify-center mt-4">
//           <Link
//             href="/admin/CourseLists/edit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
//           >
//             在這改課程
//           </Link>
//         </div>

// <div className="bg-gray-800 shadow-lg rounded-lg p-4">
//   <FullCalendar
//     plugins={[dayGridPlugin]}
//     initialView="dayGridMonth"
//     events={calendarEvents}
//     locale="zh-tw"
//     height="600px"
//     dayMaxEvents={false}   // ← 這行決定是否顯示全部
// // 修复 eventClick 处理函数
// eventClick={(info) => {
//   const courseType = info.event.extendedProps.courseType;
//   const students = info.event.extendedProps.students;
  
//   let studentsText = "無學生";
  
//   if (courseType === "regular") {
//     // 普通课程: students 是 string[] (学生ID)
//     const studentNames = getStudentNames(students as string[]);
//     studentsText = studentNames.length > 0 ? studentNames.join(", ") : "無學生";
//   } else if (courseType === "special") {
//     // 特殊课程: students 是 Array<{id, username, name}>
//     const studentArray = students as Array<{id: string, username: string, name: string}>;
//     if (studentArray && studentArray.length > 0) {
//       // 直接从学生对象中提取姓名
//       const names = studentArray.map(student => student.name || student.username || "未知學生");
//       studentsText = names.join(", ");
//     } else {
//       studentsText = "無學生";
//     }
//   }

//   const prefix = courseType === "special" ? "[特殊課程] " : courseType === "holiday" ? "[教師休假] " : "";

//   alert(
//     `${prefix}事件: ${info.event.title}\n日期: ${info.event.startStr}\n學生: ${studentsText}`
//   );
// }}
//     headerToolbar={{
//       left: "prev,next today",
//       center: "title",
//       right: "dayGridMonth,dayGridWeek",
//     }}
//     buttonText={{
//       today: "今天",
//       month: "月",
//       week: "週",
//     }}
//   />
// </div>
//       </div>
//     </div>
//   );
// };

// export default CourseListsPage;