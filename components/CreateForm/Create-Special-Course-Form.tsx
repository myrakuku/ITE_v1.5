// "use client";

// import { useEffect, useState, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import { EventDropArg } from "@fullcalendar/core";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useForm, useFieldArray } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
// import { toast } from "sonner";
// import { Label } from "@/components/ui/label"; // 導入 Label 組件
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { SpecialCourse } from "@/types/Specialcourse";

// // === 時間段選項 ===
// const timeRangeOptions = {
//   morning: { label: "上午", start: "09:00", end: "13:00" },
//   afternoon: { label: "下午", start: "14:00", end: "18:00" },
//   evening: { label: "晚上", start: "19:00", end: "22:00" },
//   full_day: { label: "全天", start: "00:00", end: "23:59" },
// };

// // === Zod Schema ===
// const CourseDateSchema = z.object({
//   startDate: z.string().optional().nullable(),
//   endDate: z.string().optional().nullable(),
//   weekday: z.string().optional().nullable(),
//   classroom: z.string().optional().nullable(),
//   timeRanges: z.array(z.object({
//     timeRange: z.string(),
//     startTime: z.string().optional().nullable(),
//     endTime: z.string().optional().nullable(),
//   })).optional(),
//   maxStudents: z.number().int().min(1).optional().nullable(),

//   // === Product 欄位 ===
//   price: z.number().min(0, { message: "價格不能為負數" }), // 改為必填
//   real_price: z.number().min(0, { message: "實價不能為負數" }), // 改為必填
//   Target_Audience: z.string().optional().nullable(),
//   Course_Objective: z.string().optional().nullable(),
//   Applicable_Scenarios: z.string().optional().nullable(),
// }).refine(
//   (data) => {
//     if (data.startDate && data.endDate && data.startDate !== "" && data.endDate !== "") {
//       return parseISO(data.startDate) <= parseISO(data.endDate);
//     }
//     return true;
//   },
//   { message: "結束日期必須晚於或等於開始日期", path: ["endDate"] }
// );

// type CourseDateForm = z.infer<typeof CourseDateSchema>;

// // API 返回的課程類型
// interface ApiCourse {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   startDate: string | null;
//   endDate: string | null;
//   weekday: string | null;
//   classroom: string | null;
//   numberOfDays: number;
//   timeHours: number;
//   isPublic: boolean;
//   Producted: boolean;
//   Coursedates: string[];
//   CourseTimeRanges: { // 注意：這裡是大寫 C
//     id: string;
//     timeRange: string;
//     starttime: string | null;
//     endtime: string | null;
//   }[];
//   type: string[];
//   schoolName?: string;
//   teacher?: string[];
//   teacherId?: string;
//   numberOfStudents?: number | null;
//   maxStudents?: number | null;
//   courseModulId?: string | null;
//   createdAt?: string | Date;
//   updatedAt?: string | Date;
//   Students?: string[];
//   price?: number | null;
//   real_price?: number | null;
//   Target_Audience?: string | null;
//   Course_Objective?: string | null;
//   Applicable_Scenarios?: string | null;
// }

// const ArrangeSpecialCoursePage = () => {
//   const [courses, setCourses] = useState<SpecialCourse[]>([]);
//   const [specialCourses, setSpecialCourses] = useState<SpecialCourse[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState<SpecialCourse | null>(null);
//   const [calendarDates, setCalendarDates] = useState<string[]>([]);
//   const [dateRangeError, setDateRangeError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [videoFiles, setVideoFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
//   const calendarRef = useRef<FullCalendar>(null);
//   const router = useRouter();

// const { register, handleSubmit, reset, watch, control, formState: { errors }, setValue } = useForm<CourseDateForm>({
//   resolver: zodResolver(CourseDateSchema),
//   defaultValues: {
//     startDate: "",
//     endDate: "",
//     weekday: null,
//     classroom: null,
//     timeRanges: [],
//     maxStudents: null,
//     price: 0, // 改為必填，提供默認值
//     real_price: 0, // 改為必填，提供默認值
//     Target_Audience: null,
//     Course_Objective: null,
//     Applicable_Scenarios: null,
//   },
// });

//   const { fields, append, remove } = useFieldArray({ control, name: "timeRanges" });

//   const startDate = watch("startDate");
//   const endDate = watch("endDate");
//   const selectedWeekday = watch("weekday");
//   const formTimeRanges = watch("timeRanges");

//   const weekdays = [
//     { value: "0", label: "星期日" },
//     { value: "1", label: "星期一" },
//     { value: "2", label: "星期二" },
//     { value: "3", label: "星期三" },
//     { value: "4", label: "星期四" },
//     { value: "5", label: "星期五" },
//     { value: "6", label: "星期六" },
//   ];

// // === 載入課程 ===
// useEffect(() => {
//   const fetchData = async () => {
//     setIsLoading(true);
//     try {
//       const [courseRes, specialRes] = await Promise.all([
//         fetch("/api/Course/Get_Course_Lists"),
//         fetch("/api/SpecialCourse/SpecialCourse_Lists"),
//       ]);

//       const coursesData = await courseRes.json();
//       const specialCoursesData = await specialRes.json();

//       // 正確映射數據：將 API 的 CourseTimeRanges 映射到 client 的 courseTimeRanges
//       const mappedCourses: SpecialCourse[] = Array.isArray(coursesData) 
//         ? coursesData.map((course: ApiCourse) => ({
//             ...course,
//             courseTimeRanges: course.CourseTimeRanges || [],
//             courseDates: course.Coursedates || [],
//             isProduct: course.Producted ?? false,
//             Students: course.Students || [],
//             schoolName: course.schoolName || "未命名學校",
//             teacher: course.teacher || [],
//             teacherId: course.teacherId || "",
//             price: course.price || 0, // 提供默認值
//             real_price: course.real_price || 0, // 提供默認值
//             Target_Audience: course.Target_Audience || null,
//             Course_Objective: course.Course_Objective || null,
//             Applicable_Scenarios: course.Applicable_Scenarios || null,
//             numberOfStudents: course.numberOfStudents || null,
//             maxStudents: course.maxStudents || null,
//             courseModulId: course.courseModulId || null,
//             createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
//             updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
//           }))
//         : [];

//       const mappedSpecialCourses: SpecialCourse[] = Array.isArray(specialCoursesData)
//         ? specialCoursesData.map((course: any) => ({
//             ...course,
//             courseTimeRanges: course.SpecialCourseTimeRanges || course.CourseTimeRanges || [],
//             courseDates: course.Coursedates || [],
//             isProduct: course.Producted ?? false,
//             Students: course.Students || [],
//             schoolName: course.schoolName || "未命名學校",
//             teacher: course.teacher || [],
//             teacherId: course.teacherId || "",
//             price: course.price || 0, // 提供默認值
//             real_price: course.real_price || 0, // 提供默認值
//             Target_Audience: course.Target_Audience || null,
//             Course_Objective: course.Course_Objective || null,
//             Applicable_Scenarios: course.Applicable_Scenarios || null,
//             numberOfStudents: course.numberOfStudents || null,
//             maxStudents: course.maxStudents || null,
//             courseModulId: course.courseModulId || null,
//             createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
//             updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
//           }))
//         : [];

//       setCourses(mappedCourses);
//       setSpecialCourses(mappedSpecialCourses);

//       if (mappedCourses.length > 0) {
//         setSelectedCourse(mappedCourses[0]);
//         setCalendarDates(mappedCourses[0].courseDates || []);
//       }
//     } catch (error) {
//       console.error("載入失敗:", error);
//       toast.error("載入失敗");
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   fetchData();
// }, [reset]);

// // === 同步選課 ===
// useEffect(() => {
//   if (selectedCourse) {
//     console.log("選中課程的時間段:", selectedCourse.courseTimeRanges);
    
//     reset({
//       startDate: selectedCourse.startDate || "",
//       endDate: selectedCourse.endDate || "",
//       weekday: selectedCourse.weekday || null,
//       classroom: selectedCourse.classroom || "",
//       timeRanges: selectedCourse.courseTimeRanges?.map((range: any) => ({
//         timeRange: range.timeRange,
//         startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || "",
//         endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || "",
//       })) || [],
//       maxStudents: selectedCourse.maxStudents || null,
//       price: selectedCourse.price || 0, // 提供默認值
//       real_price: selectedCourse.real_price || 0, // 提供默認值
//       Target_Audience: selectedCourse.Target_Audience || null,
//       Course_Objective: selectedCourse.Course_Objective || null,
//       Applicable_Scenarios: selectedCourse.Applicable_Scenarios || null,
//     });
//     setCalendarDates(selectedCourse.courseDates || []);
//   }
// }, [selectedCourse, reset]);

//   // === 日期邏輯 ===
//   useEffect(() => {
//     if (selectedCourse && startDate && startDate !== "") {
//       const start = parseISO(startDate);
//       const newDates: string[] = [];

//       if (selectedWeekday && selectedWeekday !== "") {
//         const targetWeekday = parseInt(selectedWeekday);
//         let currentDate = start;
//         while (getDay(currentDate) !== targetWeekday) {
//           currentDate = addDays(currentDate, 1);
//         }
//         let count = 0;
//         while (count < selectedCourse.numberOfDays) {
//           newDates.push(format(currentDate, "yyyy-MM-dd"));
//           currentDate = addWeeks(currentDate, 1);
//           count++;
//         }
//       } else {
//         for (let i = 0; i < selectedCourse.numberOfDays; i++) {
//           newDates.push(format(addDays(start, i), "yyyy-MM-dd"));
//         }
//       }
//       setCalendarDates(newDates);
//     } else {
//       setCalendarDates([]);
//     }
//   }, [startDate, selectedWeekday, selectedCourse]);

//   useEffect(() => {
//     if (selectedCourse && startDate && endDate && startDate !== "" && endDate !== "") {
//       const daysDifference = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
//       if (daysDifference < selectedCourse.numberOfDays) {
//         setDateRangeError(`日期範圍（${daysDifference} 天）少於課程天數（${selectedCourse.numberOfDays} 天）`);
//       } else {
//         setDateRangeError(null);
//       }
//     } else {
//       setDateRangeError(null);
//     }
//   }, [startDate, endDate, selectedCourse]);

//   // === 時間段切換 ===
//   const handleTimeRangeToggle = (timeRange: string) => {
//     const index = formTimeRanges?.findIndex((tr) => tr.timeRange === timeRange) ?? -1;
//     if (index >= 0) {
//       remove(index);
//     } else {
//       const { start, end } = timeRangeOptions[timeRange as keyof typeof timeRangeOptions];
//       append({ timeRange, startTime: start, endTime: end });
//     }
//   };

//   const isCourseFull = (course: SpecialCourse) => {
//     if (!course.maxStudents) return false;
//     return (course.Students?.length || 0) >= course.maxStudents;
//   };

//   // === 圖片/影片處理 ===
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
//     setImageFiles(files);
//     const previews = files.map(f => URL.createObjectURL(f));
//     setImagePreviews(previews);
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("video/"));
//     setVideoFiles(files);
//     const previews = files.map(f => URL.createObjectURL(f));
//     setVideoPreviews(previews);
//   };

// // === 建立特殊課程 ===
// const handleCreateCourse = async (data: CourseDateForm) => {
//   if (!selectedCourse || dateRangeError) {
//     toast.error(dateRangeError || "請選擇課程");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("title", selectedCourse.title);
//   formData.append("description", selectedCourse.description);
//   formData.append("courseCode", selectedCourse.courseCode);
//   formData.append("schoolName", selectedCourse.schoolName);
//   formData.append("numberOfDays", String(selectedCourse.numberOfDays));
//   formData.append("timeHours", String(selectedCourse.timeHours));
//   formData.append("teacher", JSON.stringify(selectedCourse.teacher));
//   formData.append("teacherId", selectedCourse.teacherId);
//   formData.append("isPublic", String(selectedCourse.isPublic));
//   formData.append("isProduct", String(selectedCourse.isProduct));
//   formData.append("type", JSON.stringify(selectedCourse.type));
//   formData.append("courseModulId", selectedCourse.courseModulId || "");
//   formData.append("startDate", data.startDate || "");
//   formData.append("endDate", data.endDate || "");
//   formData.append("Coursedates", JSON.stringify(calendarDates));
//   formData.append("weekday", data.weekday || "");
//   formData.append("classroom", data.classroom || "");
//   formData.append("maxStudents", data.maxStudents?.toString() || "");

//   // Product 欄位
//   formData.append("price", data.price.toString());
//   formData.append("real_price", data.real_price.toString());
//   if (data.Target_Audience) formData.append("Target_Audience", data.Target_Audience);
//   if (data.Course_Objective) formData.append("Course_Objective", data.Course_Objective);
//   if (data.Applicable_Scenarios) formData.append("Applicable_Scenarios", data.Applicable_Scenarios);

//   // === 修正：時間段數據發送方式 ===
//   // 方法1：直接發送 JSON 數組
//   const timeRangesData = data.timeRanges?.map((tr) => ({
//     timeRange: tr.timeRange,
//     starttime: tr.startTime,
//     endtime: tr.endTime,
//   })) || [];
  
//   formData.append("SpecialCourseTimeRanges", JSON.stringify(timeRangesData));

//   // 檔案
//   imageFiles.forEach(f => formData.append("images", f));
//   videoFiles.forEach(f => formData.append("videos", f));

//   try {
//     const res = await fetch("/api/SpecialCourse/Create_SpecialCourse", {
//       method: "POST",
//       body: formData,
//     });
//     if (!res.ok) throw new Error("創建失敗");
//     toast.success("特殊課程創建成功");
//     router.push("/admin/SpecialCourseLists");
//   } catch (error) {
//     toast.error("創建失敗");
//   }
// };

//   // === 月曆事件 ===
//   const handleDateClick = (arg: { dateStr: string }) => {
//     if (!selectedCourse) return toast.info("請選擇課程");
//     const clickedDate = arg.dateStr;
//     let updatedDates = calendarDates.includes(clickedDate)
//       ? calendarDates.filter(d => d !== clickedDate)
//       : [...calendarDates, clickedDate];

//     if (updatedDates.length > selectedCourse.numberOfDays) {
//       toast.info(`最多 ${selectedCourse.numberOfDays} 天`);
//       return;
//     }
//     setCalendarDates(updatedDates);
//   };

//   const handleEventDrop = (info: EventDropArg) => {
//     if (!selectedCourse) {
//       toast.info("請選擇課程");
//       info.revert();
//       return;
//     }

//     const newDate = format(info.event.start!, "yyyy-MM-dd");
//     const oldDate = info.oldEvent.start ? format(info.oldEvent.start, "yyyy-MM-dd") : null;

//     if (startDate && endDate && startDate !== "" && endDate !== "") {
//       const start = parseISO(startDate);
//       const end = parseISO(endDate);
//       const newDateParsed = parseISO(newDate);
//       if (newDateParsed < start || newDateParsed > end) {
//         toast.info("只能在開始日期和結束日期之間拖放日期");
//         info.revert();
//         return;
//       }
//     }

//     if (selectedWeekday && selectedWeekday !== "") {
//       const newDateParsed = parseISO(newDate);
//       if (getDay(newDateParsed) !== parseInt(selectedWeekday)) {
//         toast.info(`只能拖放到${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
//         info.revert();
//         return;
//       }
//     }

//     let updatedDates = [...calendarDates];
//     if (oldDate && calendarDates.includes(oldDate)) {
//       updatedDates = updatedDates.filter((date) => date !== oldDate);
//     }
//     if (!updatedDates.includes(newDate)) {
//       updatedDates.push(newDate);
//     }

//     if (updatedDates.length > selectedCourse.numberOfDays) {
//       toast.info(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
//       info.revert();
//       return;
//     }

//     setCalendarDates(updatedDates);
//   };

//   const calendarEvents = calendarDates.map(date => ({
//     title: selectedCourse?.title || "課程",
//     date,
//     allDay: true,
//     backgroundColor: "#2563eb",
//     borderColor: "#2563eb",
//     textColor: "#ffffff",
//   }));

//   if (isLoading) return <div className="text-center py-10 text-white">載入中...</div>;

//   console.log("courses : ", courses , "-- End --");
//   console.log("selectedCourse timeRanges:", selectedCourse?.courseTimeRanges);

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Link href="/admin/SpecialCourseLists" className="text-blue-400 hover:underline mb-4 inline-block">返回</Link>
//         <h1 className="text-2xl font-bold mb-6">安排特別課程</h1>

//         {dateRangeError && <div className="bg-red-600 text-white p-4 rounded-md mb-6">{dateRangeError}</div>}

//         <div className="flex flex-col md:flex-row gap-6">
//           {/* 左側：課程選擇 + 表單 */}
//           <div className="md:w-1/2 flex flex-col gap-6">
//             <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//               <h2 className="text-lg font-semibold mb-4">課程列表</h2>
//               <div className="flex gap-4">
//                 <div className="w-1/2 space-y-2 max-h-96 overflow-y-auto">
//                   <h3 className="text-md font-medium">普通課程</h3>
//                   {courses.map(course => (
//                     <div
//                       key={course.id}
//                       onClick={() => setSelectedCourse(course)}
//                       className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${selectedCourse?.id === course.id ? "bg-gray-600" : ""}`}
//                     >
//                       <p className="font-medium">{course.title}</p>
//                       <p className="text-sm text-gray-300">{course.courseCode}</p>
//                       <p className="text-sm text-gray-300">學生: {(course.Students?.length || 0)} / {course.maxStudents ?? "無上限"}</p>
//                       <p className="text-xs text-gray-400">時間段: {course.courseTimeRanges?.length || 0} 個</p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="w-1/2 space-y-2 max-h-96 overflow-y-auto">
//                   <h3 className="text-md font-medium">特殊課程</h3>
//                   {specialCourses.map(course => (
//                     <div
//                       key={course.id}
//                       onClick={() => setSelectedCourse(course)}
//                       className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${selectedCourse?.id === course.id ? "bg-gray-600" : ""}`}
//                     >
//                       <p className="font-medium">{course.title}</p>
//                       <p className="text-sm text-gray-300">{course.courseCode}</p>
//                       <p className="text-xs text-gray-400">時間段: {course.courseTimeRanges?.length || 0} 個</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {selectedCourse && (
//               <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//                 <h2 className="text-lg font-semibold mb-4">課程詳情 - {selectedCourse.title}</h2>
//                 <form onSubmit={handleSubmit(handleCreateCourse)} className="space-y-4">
//                   <Input type="date" {...register("startDate")} placeholder="開始日期" />
//                   <Input type="date" {...register("endDate")} placeholder="結束日期" />
// <Input 
//   type="number" 
//   {...register("maxStudents", { valueAsNumber: true })} 
// />
// <Label htmlFor="maxStudents" className="text-sm font-medium text-gray-300">
//   人數上限
// </Label>

// {/* Product 欄位 */}
// <div className="grid grid-cols-2 gap-4">
//   <div className="space-y-2">
//     <Input 
//       type="number" 
//       {...register("price", { valueAsNumber: true })} 
//     />
//     <Label htmlFor="price" className="text-sm font-medium text-gray-300">
//       原價
//     </Label>
//   </div>
//   <div className="space-y-2">
//     <Input 
//       type="number" 
//       {...register("real_price", { valueAsNumber: true })} 
//     />
//     <Label htmlFor="real_price" className="text-sm font-medium text-gray-300">
//       實價
//     </Label>
//   </div>
// </div>
//                   <Textarea {...register("Target_Audience")} placeholder="目標觀眾" />
//                   <Textarea {...register("Course_Objective")} placeholder="課程目標" />
//                   <Textarea {...register("Applicable_Scenarios")} placeholder="適用場景" />

//                   {/* === 時間段 === */}
//                   <div>
//                     <label className="block text-sm font-medium mb-2">時間段</label>
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {selectedCourse.courseTimeRanges && selectedCourse.courseTimeRanges.length > 0 ? (
//                         selectedCourse.courseTimeRanges.map((range) => (
//                           <Button
//                             key={range.id}
//                             type="button"
//                             onClick={() => handleTimeRangeToggle(range.timeRange)}
//                             className={`px-4 py-2 rounded-md transition-colors ${
//                               formTimeRanges?.some((tr) => tr.timeRange === range.timeRange)
//                                 ? "bg-blue-600 hover:bg-blue-700"
//                                 : "bg-gray-600 hover:bg-gray-500"
//                             }`}
//                           >
//                             {timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.label || range.timeRange}
//                           </Button>
//                         ))
//                       ) : (
//                         <p className="text-gray-400 text-sm">此課程未定義可用時間段</p>
//                       )}
//                     </div>

//                     {fields.map((field, index) => {
//                       const timeRangeKey = field.timeRange as keyof typeof timeRangeOptions;
//                       const defaultRange = timeRangeOptions[timeRangeKey];

//                       return (
//                         <div
//                           key={field.id}
//                           className="space-y-3 border border-gray-600 rounded-md p-4 mb-4 bg-gray-750"
//                         >
//                           <div className="flex justify-between items-center">
//                             <h4 className="text-sm font-medium text-blue-400">
//                               {defaultRange?.label || field.timeRange}
//                             </h4>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => remove(index)}
//                               className="text-red-400 hover:text-red-300"
//                             >
//                               移除
//                             </Button>
//                           </div>

//                           <div className="grid grid-cols-2 gap-3">
//                             <div>
//                               <label className="block text-xs font-medium text-gray-300">開始時間</label>
//                               <Input
//                                 type="time"
//                                 {...register(`timeRanges.${index}.startTime`)}
//                                 min={defaultRange?.start}
//                                 max={defaultRange?.end}
//                                 className="mt-1 bg-gray-800 border-gray-600 text-white text-sm"
//                                 placeholder={defaultRange?.start}
//                               />
//                             </div>

//                             <div>
//                               <label className="block text-xs font-medium text-gray-300">結束時間</label>
//                               <Input
//                                 type="time"
//                                 {...register(`timeRanges.${index}.endTime`)}
//                                 min={watch(`timeRanges.${index}.startTime`) || defaultRange?.start}
//                                 max={defaultRange?.end}
//                                 className="mt-1 bg-gray-800 border-gray-600 text-white text-sm"
//                                 placeholder={defaultRange?.end}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* 圖片上傳 */}
//                   <div>
//                     <label className="block text-sm font-medium mb-1">課程圖片</label>
//                     <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
//                     {imagePreviews.length > 0 && (
//                       <div className="grid grid-cols-3 gap-2 mt-2">
//                         {imagePreviews.map((src, i) => (
//                           <Image key={i} src={src} alt="" width={100} height={100} className="rounded object-cover" />
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   {/* 影片上傳 */}
//                   <div>
//                     <label className="block text-sm font-medium mb-1">課程影片</label>
//                     <Input type="file" multiple accept="video/*" onChange={handleVideoChange} />
//                     {videoPreviews.length > 0 && (
//                       <div className="grid grid-cols-3 gap-2 mt-2">
//                         {videoPreviews.map((src, i) => (
//                           <video key={i} src={src} controls className="w-full h-24 rounded object-cover" />
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
//                     建立課程
//                   </Button>
//                 </form>
//               </div>
//             )}
//           </div>

//           {/* 右側：月曆 */}
//           <div className="md:w-1/2">
//             <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//               <h2 className="text-lg font-semibold mb-4">課程月曆</h2>
//               <FullCalendar
//                 ref={calendarRef}
//                 plugins={[dayGridPlugin, interactionPlugin]}
//                 initialView="dayGridMonth"
//                 events={calendarEvents}
//                 dateClick={handleDateClick}
//                 editable={true}
//                 selectable={true}
//                 headerToolbar={{
//                   left: "prev,next today",
//                   center: "title",
//                   right: "dayGridMonth,dayGridWeek,dayGridDay",
//                 }}
//                 height="auto"
//                 eventDrop={handleEventDrop}
//                 validRange={
//                   startDate && endDate && startDate !== "" && endDate !== ""
//                     ? { start: parseISO(startDate), end: addDays(parseISO(endDate), 1) }
//                     : undefined
//                 }
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArrangeSpecialCoursePage;



"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventDropArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SpecialCourse } from "@/types/Specialcourse";

// === 時間段選項 ===
const timeRangeOptions = {
  morning: { label: "上午", start: "09:00", end: "13:00" },
  afternoon: { label: "下午", start: "14:00", end: "18:00" },
  evening: { label: "晚上", start: "19:00", end: "22:00" },
  full_day: { label: "全天", start: "00:00", end: "23:59" },
};

// === Zod Schema ===
const CourseDateSchema = z.object({
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
  timeRanges: z.array(z.object({
    timeRange: z.string(),
    startTime: z.string().optional().nullable(),
    endTime: z.string().optional().nullable(),
  })).optional(),
  maxStudents: z.number().int().min(1).optional().nullable(),
  price: z.number().min(0, { message: "價格不能為負數" }),
  real_price: z.number().min(0, { message: "實價不能為負數" }),
  Target_Audience: z.string().optional().nullable(),
  Course_Objective: z.string().optional().nullable(),
  Applicable_Scenarios: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate && data.startDate !== "" && data.endDate !== "") {
      return parseISO(data.startDate) <= parseISO(data.endDate);
    }
    return true;
  },
  { message: "結束日期必須晚於或等於開始日期", path: ["endDate"] }
);

type CourseDateForm = z.infer<typeof CourseDateSchema>;

// API 返回的課程類型
interface ApiCourse {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  startDate: string | null;
  endDate: string | null;
  weekday: string | null;
  classroom: string | null;
  numberOfDays: number;
  timeHours: number;
  isPublic: boolean;
  Producted: boolean;
  Coursedates: string[];
  CourseTimeRanges: {
    id: string;
    timeRange: string;
    starttime: string | null;
    endtime: string | null;
  }[];
  type: string[];
  schoolName?: string;
  teacher?: string[];
  teacherId?: string;
  numberOfStudents?: number | null;
  maxStudents?: number | null;
  courseModulId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  Students?: string[];
  price?: number | null;
  real_price?: number | null;
  Target_Audience?: string | null;
  Course_Objective?: string | null;
  Applicable_Scenarios?: string | null;
}

const ArrangeSpecialCoursePage = () => {
  const [courses, setCourses] = useState<SpecialCourse[]>([]);
  const [specialCourses, setSpecialCourses] = useState<SpecialCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<SpecialCourse | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  // 修復：添加下劃線前綴表示未使用
  const { register, handleSubmit, reset, watch, control, formState: { errors: _errors }, setValue: _setValue } = useForm<CourseDateForm>({
    resolver: zodResolver(CourseDateSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      weekday: null,
      classroom: null,
      timeRanges: [],
      maxStudents: null,
      price: 0,
      real_price: 0,
      Target_Audience: null,
      Course_Objective: null,
      Applicable_Scenarios: null,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "timeRanges" });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const selectedWeekday = watch("weekday");
  const formTimeRanges = watch("timeRanges");

  const weekdays = [
    { value: "0", label: "星期日" },
    { value: "1", label: "星期一" },
    { value: "2", label: "星期二" },
    { value: "3", label: "星期三" },
    { value: "4", label: "星期四" },
    { value: "5", label: "星期五" },
    { value: "6", label: "星期六" },
  ];

  // === 載入課程 ===
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseRes, specialRes] = await Promise.all([
          fetch("/api/Course/Get_Course_Lists"),
          fetch("/api/SpecialCourse/SpecialCourse_Lists"),
        ]);

        const coursesData = await courseRes.json();
        const specialCoursesData = await specialRes.json();

        const mappedCourses: SpecialCourse[] = Array.isArray(coursesData) 
          ? coursesData.map((course: ApiCourse) => ({
              ...course,
              courseTimeRanges: course.CourseTimeRanges || [],
              courseDates: course.Coursedates || [],
              isProduct: course.Producted ?? false,
              Students: course.Students || [],
              schoolName: course.schoolName || "未命名學校",
              teacher: course.teacher || [],
              teacherId: course.teacherId || "",
              price: course.price || 0,
              real_price: course.real_price || 0,
              Target_Audience: course.Target_Audience || null,
              Course_Objective: course.Course_Objective || null,
              Applicable_Scenarios: course.Applicable_Scenarios || null,
              numberOfStudents: course.numberOfStudents || null,
              maxStudents: course.maxStudents || null,
              courseModulId: course.courseModulId || null,
              createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
              updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
            }))
          : [];

        const mappedSpecialCourses: SpecialCourse[] = Array.isArray(specialCoursesData)
          ? specialCoursesData.map((course: any) => ({
              ...course,
              courseTimeRanges: course.SpecialCourseTimeRanges || course.CourseTimeRanges || [],
              courseDates: course.Coursedates || [],
              isProduct: course.Producted ?? false,
              Students: course.Students || [],
              schoolName: course.schoolName || "未命名學校",
              teacher: course.teacher || [],
              teacherId: course.teacherId || "",
              price: course.price || 0,
              real_price: course.real_price || 0,
              Target_Audience: course.Target_Audience || null,
              Course_Objective: course.Course_Objective || null,
              Applicable_Scenarios: course.Applicable_Scenarios || null,
              numberOfStudents: course.numberOfStudents || null,
              maxStudents: course.maxStudents || null,
              courseModulId: course.courseModulId || null,
              createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
              updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
            }))
          : [];

        setCourses(mappedCourses);
        setSpecialCourses(mappedSpecialCourses);

        if (mappedCourses.length > 0) {
          setSelectedCourse(mappedCourses[0]);
          setCalendarDates(mappedCourses[0].courseDates || []);
        }
      } catch (error) {
        console.error("載入失敗:", error);
        toast.error("載入失敗");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  // === 同步選課 ===
  useEffect(() => {
    if (selectedCourse) {
      console.log("選中課程的時間段:", selectedCourse.courseTimeRanges);
      
      reset({
        startDate: selectedCourse.startDate || "",
        endDate: selectedCourse.endDate || "",
        weekday: selectedCourse.weekday || null,
        classroom: selectedCourse.classroom || "",
        timeRanges: selectedCourse.courseTimeRanges?.map((range: any) => ({
          timeRange: range.timeRange,
          startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || "",
          endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || "",
        })) || [],
        maxStudents: selectedCourse.maxStudents || null,
        price: selectedCourse.price || 0,
        real_price: selectedCourse.real_price || 0,
        Target_Audience: selectedCourse.Target_Audience || null,
        Course_Objective: selectedCourse.Course_Objective || null,
        Applicable_Scenarios: selectedCourse.Applicable_Scenarios || null,
      });
      setCalendarDates(selectedCourse.courseDates || []);
    }
  }, [selectedCourse, reset]);

  // === 日期邏輯 ===
  useEffect(() => {
    if (selectedCourse && startDate && startDate !== "") {
      const start = parseISO(startDate);
      const newDates: string[] = [];

      if (selectedWeekday && selectedWeekday !== "") {
        const targetWeekday = parseInt(selectedWeekday);
        let currentDate = start;
        while (getDay(currentDate) !== targetWeekday) {
          currentDate = addDays(currentDate, 1);
        }
        let count = 0;
        while (count < selectedCourse.numberOfDays) {
          newDates.push(format(currentDate, "yyyy-MM-dd"));
          currentDate = addWeeks(currentDate, 1);
          count++;
        }
      } else {
        for (let i = 0; i < selectedCourse.numberOfDays; i++) {
          newDates.push(format(addDays(start, i), "yyyy-MM-dd"));
        }
      }
      setCalendarDates(newDates);
    } else {
      setCalendarDates([]);
    }
  }, [startDate, selectedWeekday, selectedCourse]);

  useEffect(() => {
    if (selectedCourse && startDate && endDate && startDate !== "" && endDate !== "") {
      const daysDifference = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
      if (daysDifference < selectedCourse.numberOfDays) {
        setDateRangeError(`日期範圍（${daysDifference} 天）少於課程天數（${selectedCourse.numberOfDays} 天）`);
      } else {
        setDateRangeError(null);
      }
    } else {
      setDateRangeError(null);
    }
  }, [startDate, endDate, selectedCourse]);

  // === 時間段切換 ===
  const handleTimeRangeToggle = (timeRange: string) => {
    const index = formTimeRanges?.findIndex((tr) => tr.timeRange === timeRange) ?? -1;
    if (index >= 0) {
      remove(index);
    } else {
      const { start, end } = timeRangeOptions[timeRange as keyof typeof timeRangeOptions];
      append({ timeRange, startTime: start, endTime: end });
    }
  };

  // 修復：添加下劃線前綴表示未使用
  const _isCourseFull = (course: SpecialCourse) => {
    if (!course.maxStudents) return false;
    return (course.Students?.length || 0) >= course.maxStudents;
  };

  // === 圖片/影片處理 ===
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
    setImageFiles(files);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("video/"));
    setVideoFiles(files);
    const previews = files.map(f => URL.createObjectURL(f));
    setVideoPreviews(previews);
  };

  // === 建立特殊課程 ===
  const handleCreateCourse = async (data: CourseDateForm) => {
    if (!selectedCourse || dateRangeError) {
      toast.error(dateRangeError || "請選擇課程");
      return;
    }

    const formData = new FormData();
    formData.append("title", selectedCourse.title);
    formData.append("description", selectedCourse.description);
    formData.append("courseCode", selectedCourse.courseCode);
    formData.append("schoolName", selectedCourse.schoolName);
    formData.append("numberOfDays", String(selectedCourse.numberOfDays));
    formData.append("timeHours", String(selectedCourse.timeHours));
    formData.append("teacher", JSON.stringify(selectedCourse.teacher));
    formData.append("teacherId", selectedCourse.teacherId);
    formData.append("isPublic", String(selectedCourse.isPublic));
    formData.append("isProduct", String(selectedCourse.isProduct));
    formData.append("type", JSON.stringify(selectedCourse.type));
    formData.append("courseModulId", selectedCourse.courseModulId || "");
    formData.append("startDate", data.startDate || "");
    formData.append("endDate", data.endDate || "");
    formData.append("Coursedates", JSON.stringify(calendarDates));
    formData.append("weekday", data.weekday || "");
    formData.append("classroom", data.classroom || "");
    formData.append("maxStudents", data.maxStudents?.toString() || "");

    // Product 欄位
    formData.append("price", data.price.toString());
    formData.append("real_price", data.real_price.toString());
    if (data.Target_Audience) formData.append("Target_Audience", data.Target_Audience);
    if (data.Course_Objective) formData.append("Course_Objective", data.Course_Objective);
    if (data.Applicable_Scenarios) formData.append("Applicable_Scenarios", data.Applicable_Scenarios);

    // 時間段數據
    const timeRangesData = data.timeRanges?.map((tr) => ({
      timeRange: tr.timeRange,
      starttime: tr.startTime,
      endtime: tr.endTime,
    })) || [];
    
    formData.append("SpecialCourseTimeRanges", JSON.stringify(timeRangesData));

    // 檔案
    imageFiles.forEach(f => formData.append("images", f));
    videoFiles.forEach(f => formData.append("videos", f));

    try {
      const res = await fetch("/api/SpecialCourse/Create_SpecialCourse", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("創建失敗");
      toast.success("特殊課程創建成功");
      router.push("/admin/SpecialCourseLists");
    } catch {
      toast.error("創建失敗");
    }
  };

  // === 月曆事件 ===
  const handleDateClick = (arg: { dateStr: string }) => {
    if (!selectedCourse) return toast.info("請選擇課程");
    const clickedDate = arg.dateStr;
    
    // 修復：使用 const 而不是 let
    const updatedDates = calendarDates.includes(clickedDate)
      ? calendarDates.filter(d => d !== clickedDate)
      : [...calendarDates, clickedDate];

    if (updatedDates.length > selectedCourse.numberOfDays) {
      toast.info(`最多 ${selectedCourse.numberOfDays} 天`);
      return;
    }
    setCalendarDates(updatedDates);
  };

  const handleEventDrop = (info: EventDropArg) => {
    if (!selectedCourse) {
      toast.info("請選擇課程");
      info.revert();
      return;
    }

    const newDate = format(info.event.start!, "yyyy-MM-dd");
    const oldDate = info.oldEvent.start ? format(info.oldEvent.start, "yyyy-MM-dd") : null;

    if (startDate && endDate && startDate !== "" && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const newDateParsed = parseISO(newDate);
      if (newDateParsed < start || newDateParsed > end) {
        toast.info("只能在開始日期和結束日期之間拖放日期");
        info.revert();
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== "") {
      const newDateParsed = parseISO(newDate);
      if (getDay(newDateParsed) !== parseInt(selectedWeekday)) {
        toast.info(`只能拖放到${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
        info.revert();
        return;
      }
    }

    // 修復：使用 const 而不是 let
    const updatedDates = [...calendarDates];
    if (oldDate && calendarDates.includes(oldDate)) {
      updatedDates.splice(updatedDates.indexOf(oldDate), 1);
    }
    if (!updatedDates.includes(newDate)) {
      updatedDates.push(newDate);
    }

    if (updatedDates.length > selectedCourse.numberOfDays) {
      toast.info(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
      info.revert();
      return;
    }

    setCalendarDates(updatedDates);
  };

  const calendarEvents = calendarDates.map(date => ({
    title: selectedCourse?.title || "課程",
    date,
    allDay: true,
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    textColor: "#ffffff",
  }));

  if (isLoading) return <div className="text-center py-10 text-white">載入中...</div>;

  console.log("courses : ", courses , "-- End --");
  console.log("selectedCourse timeRanges:", selectedCourse?.courseTimeRanges);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/SpecialCourseLists" className="text-blue-400 hover:underline mb-4 inline-block">返回</Link>
        <h1 className="text-2xl font-bold mb-6">安排特別課程</h1>

        {dateRangeError && <div className="bg-red-600 text-white p-4 rounded-md mb-6">{dateRangeError}</div>}

        <div className="flex flex-col md:flex-row gap-6">
          {/* 左側：課程選擇 + 表單 */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <div className="bg-gray-700 rounded-md p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">課程列表</h2>
              <div className="flex gap-4">
                <div className="w-1/2 space-y-2 max-h-96 overflow-y-auto">
                  <h3 className="text-md font-medium">普通課程</h3>
                  {courses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${selectedCourse?.id === course.id ? "bg-gray-600" : ""}`}
                    >
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-300">{course.courseCode}</p>
                      <p className="text-sm text-gray-300">學生: {(course.Students?.length || 0)} / {course.maxStudents ?? "無上限"}</p>
                      <p className="text-xs text-gray-400">時間段: {course.courseTimeRanges?.length || 0} 個</p>
                    </div>
                  ))}
                </div>
                <div className="w-1/2 space-y-2 max-h-96 overflow-y-auto">
                  <h3 className="text-md font-medium">特殊課程</h3>
                  {specialCourses.map(course => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${selectedCourse?.id === course.id ? "bg-gray-600" : ""}`}
                    >
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-300">{course.courseCode}</p>
                      <p className="text-xs text-gray-400">時間段: {course.courseTimeRanges?.length || 0} 個</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedCourse && (
              <div className="bg-gray-700 rounded-md p-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">課程詳情 - {selectedCourse.title}</h2>
                <form onSubmit={handleSubmit(handleCreateCourse)} className="space-y-4">
                  <Input type="date" {...register("startDate")} placeholder="開始日期" />
                  <Input type="date" {...register("endDate")} placeholder="結束日期" />
                  <Input 
                    type="number" 
                    {...register("maxStudents", { valueAsNumber: true })} 
                  />
                  <Label htmlFor="maxStudents" className="text-sm font-medium text-gray-300">
                    人數上限
                  </Label>

                  {/* Product 欄位 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input 
                        type="number" 
                        {...register("price", { valueAsNumber: true })} 
                      />
                      <Label htmlFor="price" className="text-sm font-medium text-gray-300">
                        原價
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="number" 
                        {...register("real_price", { valueAsNumber: true })} 
                      />
                      <Label htmlFor="real_price" className="text-sm font-medium text-gray-300">
                        實價
                      </Label>
                    </div>
                  </div>
                  <Textarea {...register("Target_Audience")} placeholder="目標觀眾" />
                  <Textarea {...register("Course_Objective")} placeholder="課程目標" />
                  <Textarea {...register("Applicable_Scenarios")} placeholder="適用場景" />

                  {/* === 時間段 === */}
                  <div>
                    <label className="block text-sm font-medium mb-2">時間段</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCourse.courseTimeRanges && selectedCourse.courseTimeRanges.length > 0 ? (
                        selectedCourse.courseTimeRanges.map((range) => (
                          <Button
                            key={range.id}
                            type="button"
                            onClick={() => handleTimeRangeToggle(range.timeRange)}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              formTimeRanges?.some((tr) => tr.timeRange === range.timeRange)
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-600 hover:bg-gray-500"
                            }`}
                          >
                            {timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.label || range.timeRange}
                          </Button>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">此課程未定義可用時間段</p>
                      )}
                    </div>

                    {fields.map((field, index) => {
                      const timeRangeKey = field.timeRange as keyof typeof timeRangeOptions;
                      const defaultRange = timeRangeOptions[timeRangeKey];

                      return (
                        <div
                          key={field.id}
                          className="space-y-3 border border-gray-600 rounded-md p-4 mb-4 bg-gray-750"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium text-blue-400">
                              {defaultRange?.label || field.timeRange}
                            </h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-red-400 hover:text-red-300"
                            >
                              移除
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-300">開始時間</label>
                              <Input
                                type="time"
                                {...register(`timeRanges.${index}.startTime`)}
                                min={defaultRange?.start}
                                max={defaultRange?.end}
                                className="mt-1 bg-gray-800 border-gray-600 text-white text-sm"
                                placeholder={defaultRange?.start}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-300">結束時間</label>
                              <Input
                                type="time"
                                {...register(`timeRanges.${index}.endTime`)}
                                min={watch(`timeRanges.${index}.startTime`) || defaultRange?.start}
                                max={defaultRange?.end}
                                className="mt-1 bg-gray-800 border-gray-600 text-white text-sm"
                                placeholder={defaultRange?.end}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 圖片上傳 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">課程圖片</label>
                    <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {imagePreviews.map((src, i) => (
                          <Image key={i} src={src} alt="" width={100} height={100} className="rounded object-cover" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 影片上傳 */}
                  <div>
                    <label className="block text-sm font-medium mb-1">課程影片</label>
                    <Input type="file" multiple accept="video/*" onChange={handleVideoChange} />
                    {videoPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {videoPreviews.map((src, i) => (
                          <video key={i} src={src} controls className="w-full h-24 rounded object-cover" />
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    建立課程
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* 右側：月曆 */}
          <div className="md:w-1/2">
            <div className="bg-gray-700 rounded-md p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">課程月曆</h2>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                dateClick={handleDateClick}
                editable={true}
                selectable={true}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                height="auto"
                eventDrop={handleEventDrop}
                validRange={
                  startDate && endDate && startDate !== "" && endDate !== ""
                    ? { start: parseISO(startDate), end: addDays(parseISO(endDate), 1) }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrangeSpecialCoursePage;