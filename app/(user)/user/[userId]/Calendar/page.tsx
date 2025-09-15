// "use client";

// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import Link from "next/link";

// interface Course {
//   id: string;
//   title: string;
//   start_date: string;
//   end_date: string;
//   start_time: string;
//   end_time: string;
// }

// export default function UserCalendarPage() {
//   const { data: session, status } = useSession();
//   const params = useParams();
//   const router = useRouter();
//   const userId = params.userId as string;
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.id !== userId) {
//       router.push("/login");
//     } else if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, session, userId, router]);

//   useEffect(() => {
//     async function fetchCourses() {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/user/Get_User_Courses/${userId}`);
//         if (!response.ok) {
//           throw new Error(`請求失敗: ${response.status}`);
//         }
//         const data = await response.json();
//         setCourses(data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//         setError("無法獲取課程數據");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     if (status === "authenticated") {
//       fetchCourses();
//     }
//   }, [status, userId]);

//   // 將課程數據轉換為 FullCalendar 事件格式
//   const events = courses.map((course) => {
//     const startDateTime = course.start_date && course.start_time 
//       ? `${course.start_date}T${course.start_time}`
//       : course.start_date;
//     const endDateTime = course.end_date && course.end_time 
//       ? `${course.end_date}T${course.end_time}`
//       : course.end_date;

//     return {
//       id: course.id,
//       title: course.title,
//       start: startDateTime,
//       end: endDateTime,
//       url: `/user/${userId}/courses/${course.id}`, // 點擊事件導航到課程詳情
//     };
//   });

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
//           <div className="text-red-500">{error}</div>
//         </div>
//       </div>
//     );
//   }

//   if (!session || session.user.role !== "USER") {
//     return null;
//   }

//   console.log("courses:", courses, " -- End -- ");

//   return (
//     <div className="bg-gray-900 min-h-screen text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* 標題與返回按鈕 */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">我的日曆</h1>
//           <Link
//             href={`/user/${userId}/CourseLists`}
//             className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
//           >
//             返回課程列表
//           </Link>
//         </div>

//         {/* FullCalendar */}
//         <div className="bg-gray-800 shadow-lg rounded-lg p-6">
//           <FullCalendar
//             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             events={events}
//             headerToolbar={{
//               left: "prev,next today",
//               center: "title",
//               right: "dayGridMonth",
//             }}
//             eventClick={(info) => {
//               info.jsEvent.preventDefault(); // 防止瀏覽器默認行為
//               if (info.event.url) {
//                 router.push(info.event.url); // 導航到課程詳情
//               }
//             }}
//             height="auto"
//             locale="zh-tw"
//             buttonText={{
//               today: "今天",
//               month: "月",
//               week: "週",
//               day: "日",
//             }}
//             eventBackgroundColor="#2563eb" // blue-600
//             eventBorderColor="#2563eb" // blue-600
//             eventTextColor="#ffffff"
//             dayMaxEvents={true}
//             moreLinkContent={(arg) => `+${arg.num} 更多`}
//           />
//           {courses.length === 0 && (
//             <p className="text-gray-400 text-center mt-4">無課程數據</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";

interface CourseTimeRange {
  id: string;
  courseId: string;
  starttime: string;
  endtime: string;
  timeRange: string;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[] | null;
  CourseTimeRanges: CourseTimeRange[] | null;
  timeHours: number;
}

export default function UserCalendarPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/user/Get_User_Courses/${userId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("無法獲取課程數據");
      } finally {
        setIsLoading(false);
      }
    }
    if (status === "authenticated") {
      fetchCourses();
    }
  }, [status, userId]);

  // 將課程數據轉換為 FullCalendar 事件格式
  const events = courses.flatMap((course) => {
    if (course.Coursedates && Array.isArray(course.Coursedates)) {
      return course.Coursedates.map((date, index) => {
        const timeRange = course.CourseTimeRanges?.[0] || { starttime: "", endtime: "", timeRange: "" };
        let startTime = timeRange.starttime;
        let endTime = timeRange.endtime;
        if (!startTime || !endTime) {
          if (timeRange.timeRange === "evening") {
            startTime = "18:00:00";
            endTime = "21:00:00";
          } else {
            startTime = "09:00:00";
            endTime = "17:00:00";
          }
        }
        const startDateTime = `${date}T${startTime}`;
        const endDateTime = `${date}T${endTime}`;
        return {
          id: `${course.id}-${index}`,
          title: course.title,
          start: startDateTime,
          end: endDateTime,
          url: `/user/${userId}/courses/${course.id}`,
        };
      });
    }
    if (course.startDate) {
      const timeRange = course.CourseTimeRanges?.[0] || { starttime: "", endtime: "", timeRange: "" };
      let startTime = timeRange.starttime;
      let endTime = timeRange.endtime;
      if (!startTime || !endTime) {
        if (timeRange.timeRange === "evening") {
          startTime = "18:00:00";
          endTime = "21:00:00";
        } else {
          startTime = "09:00:00";
          endTime = "17:00:00";
        }
      }
      const startDateTime = `${course.startDate}T${startTime}`;
      const endDateTime = course.endDate ? `${course.endDate}T${endTime}` : `${course.startDate}T${endTime}`;
      return [{
        id: course.id,
        title: course.title,
        start: startDateTime,
        end: endDateTime,
        url: `/user/${userId}/courses/${course.id}`,
      }];
    }
    return [];
  });

  console.log("events:", events, " -- End -- ");

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
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "USER") {
    return null;
  }

  console.log("courses:", courses, " -- End -- ");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">我的日曆</h1>
          <Link
            href={`/user/${userId}/CourseLists`}
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            返回課程列表
          </Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              if (info.event.url) {
                router.push(info.event.url);
              }
            }}
            height="auto"
            locale="zh-tw"
            buttonText={{
              today: "今天",
              month: "月",
              week: "週",
              day: "日",
            }}
            eventBackgroundColor="#2563eb"
            eventBorderColor="#2563eb"
            eventTextColor="#ffffff"
            dayMaxEvents={true}
            moreLinkContent={(arg) => `+${arg.num} 更多`}
          />
          {courses.length === 0 && (
            <p className="text-gray-400 text-center mt-4">無課程數據</p>
          )}
        </div>
      </div>
    </div>
  );
}