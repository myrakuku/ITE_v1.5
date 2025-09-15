// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";

// interface UserHoliday {
//   id: string;
//   teacherholidaysDateTime: string[];
// }

// const TeacherCalendarPage = () => {
//   const params = useParams();
//   console.log("params : ", params, "-- End --");
//   const TeacherId = params.Teacherid as string;

//   const [GetHolidaysData, setGetHolidaysData] = useState<UserHoliday | null>(null);
//   const [ GetTeacherCourses , setGetTeacherCourses ] = useState([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHolidays = async () => {
//       try {
//         const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
//         if (!res.ok) {
//           throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         }
//         const data = await res.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetHolidaysData({
//           id: data.id,
//           teacherholidaysDateTime: data.teacherholidaysDateTime || [],
//         });
//       } catch (error) {
//         console.error("fetchHolidays error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取假期數據");
//       }
//     };
 

//     const fetchTeacherCourse = async () => {
//       try { 
//         const res = await fetch(`/api/user/teacher/${TeacherId}/CourseLists`);
//         if (!res.ok) {
//           throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         }
//         const data = await res.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetTeacherCourses(data);

//       } catch (error) {
//         console.error("fetchTeacherCourse error:", error);
//         setError(error instanceof Error ? error.message : "無法獲取課程數據");
//       }

//     }
//    if (TeacherId) {
//       fetchHolidays();
//       fetchTeacherCourse();
//     }

//   }, [TeacherId]);

//   console.log("GetHolidaysData :", GetHolidaysData, "-- End --");
//   console.log("GetTeacherCourses :", GetTeacherCourses, "-- End --");

//   // 將日期轉為包含星期的格式
//   const formatDateWithDay = (dateString: string) => {
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     };
//     return date.toLocaleDateString("zh-TW", options);
//   };

//   // 將假期數據轉為 FullCalendar 事件格式
//   const calendarEvents = GetHolidaysData?.teacherholidaysDateTime.map((date) => ({
//     title: "假期",
//     date: date,
//     allDay: true,
//   })) || [];

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   if (!GetHolidaysData) {
//     return <div>載入中...</div>;
//   }

//   return (
//     <>
//       <Link href={`/teacher/${TeacherId}/calendar/AddHolidays`}>
//         加入假期
//       </Link>
//       <div>TeacherCalendarPage</div>

//       {GetHolidaysData.teacherholidaysDateTime.length > 0 ? (
//         GetHolidaysData.teacherholidaysDateTime.map((date, index) => (
//           <Link
//             key={`${GetHolidaysData.id}-${index}`}
//             href={`/teacher/${TeacherId}/calendar/${GetHolidaysData.id}/EditHolidays`}
//           >
//             <div>
//               <div>{formatDateWithDay(date)}</div>
//             </div>
//           </Link>
//         ))
//       ) : (
//         <div>無假期數據</div>
//       )}

//       <div style={{ height: "600px", marginTop: "20px" }}>
//         <FullCalendar
//           plugins={[dayGridPlugin]}
//           initialView="dayGridMonth"
//           events={calendarEvents}
//           locale="zh-tw"
//           height="100%"
//         />
//       </div>
//     </>
//   );
// };

// export default TeacherCalendarPage;


"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { DeleteHolidayAction } from "@/app/actions/Delete/Delete_Holiday";


interface UserHoliday {
  id: string;
  teacherholidaysDateTime: string[];
}

interface Course {
  id: string;
  title: string;
  Coursedates: string[];
  teacher: string[];
}

const TeacherCalendarPage = () => {
  const params = useParams();
  console.log("params : ", params, "-- End --");
  const TeacherId = params.Teacherid as string;

  const [GetHolidaysData, setGetHolidaysData] = useState<UserHoliday | null>(null);
  const [GetTeacherCourses, setGetTeacherCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetHolidaysData({
          id: data.id,
          teacherholidaysDateTime: data.teacherholidaysDateTime || [],
        });
      } catch (error) {
        console.error("fetchHolidays error:", error);
        setError(error instanceof Error ? error.message : "無法獲取假期數據");
      }
    };

    const fetchTeacherCourse = async () => {
      try {
        const res = await fetch(`/api/user/teacher/${TeacherId}/CourseLists`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetTeacherCourses(data);
      } catch (error) {
        console.error("fetchTeacherCourse error:", error);
        setError(error instanceof Error ? error.message : "無法獲取課程數據");
      }
    };

    if (TeacherId) {
      fetchHolidays();
      fetchTeacherCourse();
    }
  }, [TeacherId]);

  // 刪除假期日期的函數
  const handleDeleteHoliday = async (date: string) => {
    try {
      const result = await DeleteHolidayAction({
        teacherId: TeacherId,
        date,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // 更新本地狀態
      if (result.data) {
        setGetHolidaysData({
          id: result.data.id,
          teacherholidaysDateTime: result.data.teacherholidaysDateTime,
        });
        toast.success("假期日期已刪除");
      }
    } catch (error) {
      console.error("Delete holiday error:", error);
      toast.error(error instanceof Error ? error.message : "無法刪除假期日期");
    }
  };

  // 將日期轉為包含星期的格式
  const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("zh-TW", options);
  };

  // 將假期和課程數據轉為 FullCalendar 事件格式
  const calendarEvents = [
    // 假期事件
    ...(GetHolidaysData?.teacherholidaysDateTime.map((date) => ({
      title: "假期",
      date: date,
      allDay: true,
      backgroundColor: "red",
      borderColor: "red",
    })) || []),
    // 課程事件
    ...GetTeacherCourses.flatMap((course) =>
      course.Coursedates.map((date) => ({
        title: `課程名：${course.title} - 老師名：${course.teacher.join(", ")}`,
        date: date,
        allDay: true,
        backgroundColor: "blue",
        borderColor: "blue",
      }))
    ),
  ];

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!GetHolidaysData || !GetTeacherCourses) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Link href={`/teacher/${TeacherId}/calendar/AddHolidays`} className="text-blue-500 hover:underline">
        加入假期
      </Link>
      <h1 className="text-2xl font-bold my-4">教師日曆</h1>

      <div className="grid gap-2">
        {GetHolidaysData.teacherholidaysDateTime.length > 0 ? (
          GetHolidaysData.teacherholidaysDateTime.map((date, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <span>{formatDateWithDay(date)}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteHoliday(date)}
                className="ml-2"
              >
                刪除
              </Button>
            </div>
          ))
        ) : (
          <div className="text-gray-500">無假期數據</div>
        )}
      </div>

      <div className="mt-6" style={{ height: "600px" }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          locale="zh-tw"
          height="100%"
        />
      </div>
    </div>
  );
};

export default TeacherCalendarPage;