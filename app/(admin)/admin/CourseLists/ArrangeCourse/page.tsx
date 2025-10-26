
// "use client";

// import { useEffect, useState, useRef } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useForm, useFieldArray } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
// import { useRouter } from "next/navigation";
// import { EventDropArg } from "@fullcalendar/core";
// import Link from "next/link";
// import { toast } from "sonner";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import Create_Product_Form from "@/components/CreateForm/Create-Product-Form";
// import { Course } from "@/types/course"; // Import the shared Course type

// const TimeRangeSchema = z.object({
//   timeRange: z.string(),
//   startTime: z.string().optional().nullable(),
//   endTime: z.string().optional().nullable(),
// });

// const CourseDateSchema = z.object({
//   startDate: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
//     message: "無效的開始日期",
//   }).optional().nullable(),
//   endDate: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
//     message: "無效的結束日期",
//   }).optional().nullable(),
//   weekday: z.string().optional().nullable(),
//   classroom: z.string().optional().nullable(),
//   timeRanges: z.array(TimeRangeSchema).optional(),
// }).refine(
//   (data) => {
//     if (data.startDate && data.endDate && data.startDate !== "" && data.endDate !== "") {
//       return parseISO(data.startDate) <= parseISO(data.endDate);
//     }
//     return true;
//   },
//   {
//     message: "結束日期必須晚於或等於開始日期",
//     path: ["endDate"],
//   }
// );

// type CourseDateForm = z.infer<typeof CourseDateSchema>;

// const timeRangeOptions = {
//   morning: { label: "上午", start: "09:00", end: "13:00" },
//   afternoon: { label: "下午", start: "14:00", end: "18:00" },
//   evening: { label: "晚上", start: "19:00", end: "22:00" },
//   full_day: { label: "全天", start: "00:00", end: "23:59" },
// };

// const ArrangeCoursePage = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [calendarDates, setCalendarDates] = useState<string[]>([]);
//   const [dateRangeError, setDateRangeError] = useState<string | null>(null);
//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//   const calendarRef = useRef<FullCalendar>(null);
//   const router = useRouter();

//   const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<CourseDateForm>({
//     resolver: zodResolver(CourseDateSchema),
//     defaultValues: {
//       startDate: "",
//       endDate: "",
//       weekday: null,
//       classroom: null,
//       timeRanges: [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "timeRanges",
//   });

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

//   useEffect(() => {
//     const fetchCourseData = async () => {
//       try {
//         const response = await fetch("/api/Course/Get_Course_Lists");
//         if (!response.ok) {
//           throw new Error(`請求失敗: ${response.status}`);
//         }
//         const data = await response.json();
//         const courseData = Array.isArray(data)
//           ? data.map((course: any) => ({
//               ...course,
//               isProduct: course.Producted ?? false, // Map Producted to isProduct
//               courseDates: course.Coursedates || [], // Map Coursedates to courseDates
//               courseTimeRanges: course.CourseTimeRanges || [], // Map CourseTimeRanges to courseTimeRanges
//             }))
//           : [];
//         setCourses(courseData);
//         if (courseData.length > 0) {
//           setSelectedCourse(courseData[0]);
//           setCalendarDates(courseData[0].courseDates || []); // Use courseDates
//           reset({
//             startDate: courseData[0].startDate || "",
//             endDate: courseData[0].endDate || "",
//             weekday: courseData[0].weekday || null,
//             classroom: courseData[0].classroom || "",
//             timeRanges: courseData[0].courseTimeRanges.map((range: { id: string; timeRange: string; starttime: string | null; endtime: string | null }) => ({
//               timeRange: range.timeRange,
//               startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || "",
//               endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || "",
//             })),
//           });
//         } else {
//           setSelectedCourse(null);
//           setCalendarDates([]);
//           reset({
//             startDate: "",
//             endDate: "",
//             weekday: null,
//             classroom: "",
//             timeRanges: [],
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error(error instanceof Error ? error.message : "無法載入課程數據");
//         setCourses([]);
//         setSelectedCourse(null);
//         setCalendarDates([]);
//       }
//     };
//     fetchCourseData();
//   }, [reset]);

//   useEffect(() => {
//     if (selectedCourse) {
//       reset({
//         startDate: selectedCourse.startDate || "",
//         endDate: selectedCourse.endDate || "",
//         weekday: selectedCourse.weekday || null,
//         classroom: selectedCourse.classroom || "",
//         timeRanges: selectedCourse.courseTimeRanges.map((range) => ({
//           timeRange: range.timeRange,
//           startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || "",
//           endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || "",
//         })),
//       });
//       setCalendarDates(selectedCourse.courseDates || []);
//     }
//   }, [selectedCourse, reset]);

//   useEffect(() => {
//     if (selectedCourse && startDate && startDate !== "") {
//       const start = parseISO(startDate);
//       const newDates: string[] = [];

//       if (selectedWeekday && selectedWeekday !== "") {
//         const targetWeekday = parseInt(selectedWeekday);
//         let currentDate = start;
//         let count = 0;

//         while (getDay(currentDate) !== targetWeekday) {
//           currentDate = addDays(currentDate, 1);
//         }

//         while (count < selectedCourse.numberOfDays) {
//           newDates.push(format(currentDate, "yyyy-MM-dd"));
//           currentDate = addWeeks(currentDate, 1);
//           count++;
//         }
//       } else {
//         for (let i = 0; i < selectedCourse.numberOfDays; i++) {
//           const date = addDays(start, i);
//           newDates.push(format(date, "yyyy-MM-dd"));
//         }
//       }

//       setCalendarDates(newDates);
//     } else {
//       setCalendarDates([]);
//     }
//   }, [startDate, selectedWeekday, selectedCourse]);

//   useEffect(() => {
//     if (selectedCourse && startDate && startDate !== "" && endDate && endDate !== "") {
//       const start = parseISO(startDate);
//       const end = parseISO(endDate);
//       const daysDifference = differenceInDays(end, start) + 1;
//       if (daysDifference < selectedCourse.numberOfDays) {
//         setDateRangeError(
//           `日期範圍（${daysDifference} 天）少於課程持續天數（${selectedCourse.numberOfDays} 天）`
//         );
//       } else {
//         setDateRangeError(null);
//       }
//     } else {
//       setDateRangeError(null);
//     }
//   }, [startDate, endDate, selectedCourse]);

//   useEffect(() => {
//     const handleProductCreated = () => {
//       setIsProductModalOpen(false);
//       toast.success("產品已成功創建，modal 已關閉");
//     };
//     window.addEventListener("productCreated", handleProductCreated);
//     return () => {
//       window.removeEventListener("productCreated", handleProductCreated);
//     };
//   }, []);

//   const handleTimeRangeToggle = (timeRange: string) => {
//     const index = formTimeRanges?.findIndex((tr) => tr.timeRange === timeRange) ?? -1;
//     if (index >= 0) {
//       remove(index);
//     } else {
//       const { start, end } = timeRangeOptions[timeRange as keyof typeof timeRangeOptions];
//       append({ timeRange, startTime: start, endTime: end });
//     }
//   };

//   const onSubmit = async (data: CourseDateForm) => {
//     if (!selectedCourse) {
//       toast.info("請選擇課程");
//       return;
//     }

//     if (dateRangeError) {
//       toast.error(dateRangeError);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/Course/Update_Course/${selectedCourse.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...data,
//           courseDates: calendarDates, // Use courseDates
//           courseTimeRanges: data.timeRanges?.map((tr) => ({
//             timeRange: tr.timeRange,
//             starttime: tr.startTime,
//             endtime: tr.endTime,
//           })) || [],
//         }),
//       });
//       if (!response.ok) {
//         throw new Error(`更新失敗: ${response.status}`);
//       }
//       const updatedCourse = await response.json();
//       setCourses(courses.map((course) =>
//         course.id === updatedCourse.id ? { ...updatedCourse, isProduct: updatedCourse.Producted ?? false, courseDates: updatedCourse.Coursedates, courseTimeRanges: updatedCourse.CourseTimeRanges } : course
//       ));
//       setSelectedCourse({ ...updatedCourse, isProduct: updatedCourse.Producted ?? false, courseDates: updatedCourse.Coursedates, courseTimeRanges: updatedCourse.CourseTimeRanges });
//       toast.success("課程更新成功");
//       router.push("/admin/CourseLists");
//     } catch (error) {
//       console.error("Error updating course:", error);
//       toast.error(error instanceof Error ? error.message : "更新課程失敗，請稍後重試");
//     }
//   };

// const handleCreateProduct = async (data: CourseDateForm) => {
//     if (!selectedCourse) {
//       toast.info("請選擇課程");
//       return;
//     }

//     if (dateRangeError) {
//       toast.error(dateRangeError);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/Product/Create_Product`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title: selectedCourse.title,
//           description: selectedCourse.description,
//           price: selectedCourse.numberOfDays * selectedCourse.timeHours * 100,
//           real_price: Math.round(selectedCourse.numberOfDays * selectedCourse.timeHours * 100 * 0.9),
//           IsPublic: selectedCourse.isPublic,
//           CourseProductTypeArray: selectedCourse.type,
//           CourseProductStatusArray: [],
//           courseId: selectedCourse.id,
//           courseDates: calendarDates,
//           courseTimeRanges: data.timeRanges?.map((tr) => ({
//             timeRange: tr.timeRange,
//             startTime: tr.startTime || timeRangeOptions[tr.timeRange as keyof typeof timeRangeOptions]?.start || null,
//             endTime: tr.endTime || timeRangeOptions[tr.timeRange as keyof typeof timeRangeOptions]?.end || null,
//           })) || [],
//         }),
//       });
//       if (!response.ok) {
//         throw new Error(`創建商品失敗: ${response.status}`);
//       }
//       const newProduct = await response.json();
//       setCourses(courses.map((course) =>
//         course.id === selectedCourse.id ? { ...course, isProduct: true } : course
//       ));
//       setSelectedCourse({ ...selectedCourse, isProduct: true });
//       toast.success("商品創建成功");
//       setIsProductModalOpen(false);
//       window.dispatchEvent(new Event("productCreated"));
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "創建商品失敗，請稍後重試");
//     }
//   };

//   const handleDateClick = (arg: { dateStr: string }) => {
//     if (!selectedCourse) {
//       toast.info("請選擇課程");
//       return;
//     }

//     const clickedDate = arg.dateStr;
//     if (startDate && startDate !== "" && endDate && endDate !== "") {
//       const start = parseISO(startDate);
//       const end = parseISO(endDate);
//       const clicked = parseISO(clickedDate);
//       if (clicked < start || clicked > end) {
//         toast.info("只能在開始日期和結束日期之間選擇日期");
//         return;
//       }
//     }

//     if (selectedWeekday && selectedWeekday !== "") {
//       const clicked = parseISO(clickedDate);
//       if (getDay(clicked) !== parseInt(selectedWeekday)) {
//         toast.info(`只能選擇${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
//         return;
//       }
//     }

//     let updatedDates: string[];
//     if (calendarDates.includes(clickedDate)) {
//       updatedDates = calendarDates.filter((date) => date !== clickedDate);
//     } else {
//       updatedDates = [...calendarDates, clickedDate];
//     }

//     if (updatedDates.length > selectedCourse.numberOfDays) {
//       toast.info(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
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

//     if (startDate && startDate !== "" && endDate && endDate !== "") {
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

//   const calendarEvents = calendarDates.map((date) => ({
//     title: selectedCourse?.title || "課程",
//     date,
//     allDay: true,
//     backgroundColor: "#2563eb",
//     borderColor: "#2563eb",
//     textColor: "#ffffff",
//   }));


// console.log("selectedCourse : ",selectedCourse , "-- End --")

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Link href="/admin/CourseLists" className="text-blue-400 hover:underline mb-4 inline-block">
//           返回
//         </Link>
//         <h1 className="text-2xl font-bold mb-6">安排課程</h1>
//         {dateRangeError && (
//           <div className="bg-red-600 text-white p-4 rounded-md mb-6">
//             {dateRangeError}
//           </div>
//         )}
//         <div className="flex flex-col md:flex-row gap-6">
//           <div className="md:w-1/2 flex flex-col gap-6">
//             <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//               <h2 className="text-lg font-semibold mb-4">課程列表</h2>
//               <div className="space-y-2 max-h-96 overflow-y-auto">
//                 {Array.isArray(courses) && courses.length > 0 ? (
//                   courses.map((course) => (
//                     <div
//                       key={course.id}
//                       onClick={() => setSelectedCourse(course)}
//                       className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${
//                         selectedCourse?.id === course.id ? "bg-gray-600" : ""
//                       }`}
//                     >
//                       <p className="font-medium">{course.title}</p>
//                       <p className="text-sm text-gray-300">{course.courseCode}</p>
//                       <p className="text-sm text-gray-300">
//                         狀態: {course.isProduct ? "已成為產品" : "未成為產品"}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400">沒有可用的課程</p>
//                 )}
//               </div>
//             </div>

//             {selectedCourse && (
//               <div className="bg-gray-700 rounded-md p-4 shadow-lg">
//                 <h2 className="text-lg font-semibold mb-4">課程詳情</h2>
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium">開始日期</label>
//                     <input
//                       type="date"
//                       {...register("startDate")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     />
//                     {errors.startDate && (
//                       <p className="text-red-500 text-sm">{errors.startDate.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">結束日期</label>
//                     <input
//                       type="date"
//                       {...register("endDate")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     />
//                     {errors.endDate && (
//                       <p className="text-red-500 text-sm">{errors.endDate.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">時間段</label>
//                     <div className="mt-1 flex flex-wrap gap-2">
//                       {selectedCourse && Array.isArray(selectedCourse.courseTimeRanges) && selectedCourse.courseTimeRanges.length > 0 ? (
//                         selectedCourse.courseTimeRanges.map((range) => (
//                           <button
//                             key={range.id}
//                             type="button"
//                             onClick={() => handleTimeRangeToggle(range.timeRange)}
//                             className={`px-4 py-2 rounded-md ${
//                               formTimeRanges?.some((tr) => tr.timeRange === range.timeRange)
//                                 ? "bg-blue-600"
//                                 : "bg-gray-600 hover:bg-gray-500"
//                             }`}
//                           >
//                             {timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.label || range.timeRange}
//                           </button>
//                         ))
//                       ) : (
//                         <p className="text-gray-400">無可用時間段</p>
//                       )}
//                     </div>
//                   </div>
//                   {fields.map((field, index) => (
//                     <div key={field.id} className="space-y-2 border-b border-gray-600 pb-4">
//                       <h3 className="text-sm font-medium">
//                         {timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions]?.label || field.timeRange}
//                       </h3>
//                       <div>
//                         <label className="block text-sm font-medium">開始時間</label>
//                         <input
//                           type="time"
//                           {...register(`timeRanges.${index}.startTime`)}
//                           min={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].start}
//                           max={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].end}
//                           className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                         />
//                         {errors.timeRanges?.[index]?.startTime && (
//                           <p className="text-red-500 text-sm">{errors.timeRanges[index]?.startTime?.message}</p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium">結束時間</label>
//                         <input
//                           type="time"
//                           {...register(`timeRanges.${index}.endTime`)}
//                           min={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].start}
//                           max={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].end}
//                           className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                         />
//                         {errors.timeRanges?.[index]?.endTime && (
//                           <p className="text-red-500 text-sm">{errors.timeRanges[index]?.endTime?.message}</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   <div>
//                     <label className="block text-sm font-medium">週份</label>
//                     <select
//                       {...register("weekday")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                     >
//                       <option value="">選擇星期</option>
//                       {weekdays.map((weekday) => (
//                         <option key={weekday.value} value={weekday.value}>
//                           {weekday.label}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.weekday && (
//                       <p className="text-red-500 text-sm">{errors.weekday.message}</p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">課室</label>
//                     <input
//                       type="text"
//                       {...register("classroom")}
//                       className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
//                       placeholder="輸入課室名稱（可選）"
//                     />
//                     {errors.classroom && (
//                       <p className="text-red-500 text-sm">{errors.classroom.message}</p>
//                     )}
//                   </div>
//                   <div className="flex gap-4">
//                     <button
//                       type="submit"
//                       className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
//                     >
//                       更新課程
//                     </button>

//                   </div>
//                 </form>
//               </div>
//             )}
//           </div>

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
//                 eventBackgroundColor="#2563eb"
//                 eventBorderColor="#2563eb"
//                 eventTextColor="#ffffff"
//                 headerToolbar={{
//                   left: "prev,next today",
//                   center: "title",
//                   right: "dayGridMonth,dayGridWeek,dayGridDay",
//                 }}
//                 height="auto"
//                 eventDrop={handleEventDrop}
//                 validRange={
//                   startDate && startDate !== "" && endDate && endDate !== ""
//                     ? {
//                         start: parseISO(startDate),
//                         end: addDays(parseISO(endDate), 1),
//                       }
//                     : undefined
//                 }
//               />
//             </div>
//             {selectedCourse && (
//           <div className="mt-4">
//             <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   onClick={() => setIsProductModalOpen(true)}
//                   className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
//                 >
//                   建立商品
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-4xl">
//                 <DialogHeader>
//                   <DialogTitle>基於課程建立商品</DialogTitle>
//                 </DialogHeader>
//                 <Create_Product_Form
//                   initialCourse={selectedCourse}
//                   initialCourseDates={calendarDates}
//                   initialTimeRanges={formTimeRanges}
//                 />
//               </DialogContent>
//             </Dialog>
//           </div>
//         )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArrangeCoursePage;



"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
import { useRouter } from "next/navigation";
import { EventDropArg } from "@fullcalendar/core";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 新增
import Create_Product_Form from "@/components/CreateForm/Create-Product-Form";
import { Course } from "@/types/course";

// app/(admin)/admin/CourseLists/ArrangeCourse/page.tsx
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
  teacher?: string;
  teacherId?: string;
  numberOfStudents?: number | null;
  maxStudents?: number | null; // 新增
  courseModulId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  Students?: string[]; // 新增
}
const TimeRangeSchema = z.object({
  timeRange: z.string(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
});

const CourseDateSchema = z.object({
  startDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "無效的開始日期",
    })
    .optional()
    .nullable(),
  endDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "無效的結束日期",
    })
    .optional()
    .nullable(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
  timeRanges: z.array(TimeRangeSchema).optional(),
  maxStudents: z.number().int().min(1, { message: "人數上限必須為正整數" }).optional().nullable(), // 新增
}).refine(
  (data) => {
    if (data.startDate && data.endDate && data.startDate !== "" && data.endDate !== "") {
      return parseISO(data.startDate) <= parseISO(data.endDate);
    }
    return true;
  },
  {
    message: "結束日期必須晚於或等於開始日期",
    path: ["endDate"],
  }
);

type CourseDateForm = z.infer<typeof CourseDateSchema>;

const timeRangeOptions = {
  morning: { label: "上午", start: "09:00", end: "13:00" },
  afternoon: { label: "下午", start: "14:00", end: "18:00" },
  evening: { label: "晚上", start: "19:00", end: "22:00" },
  full_day: { label: "全天", start: "00:00", end: "23:59" },
};

const ArrangeCoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const router = useRouter();

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<CourseDateForm>({
    resolver: zodResolver(CourseDateSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      weekday: null,
      classroom: null,
      timeRanges: [],
      maxStudents: null, // 新增
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeRanges",
  });

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

  // 檢查課程是否已滿
  const isCourseFull = (course: Course) => {
    if (course.maxStudents === null || course.maxStudents === undefined) {
      return false; // 無上限，視為未滿
    }
    return course.Students.length >= course.maxStudents;
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch("/api/Course/Get_Course_Lists");
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        
        const courseData: Course[] = Array.isArray(data)
          ? data.map((course: ApiCourse) => ({
              id: course.id,
              title: course.title,
              description: course.description,
              courseCode: course.courseCode,
              schoolName: course.schoolName || "",
              startDate: course.startDate,
              endDate: course.endDate,
              weekday: course.weekday,
              classroom: course.classroom,
              numberOfDays: course.numberOfDays,
              timeHours: course.timeHours,
              isPublic: course.isPublic,
              isProduct: course.Producted,
              courseDates: course.Coursedates || [],
              courseTimeRanges: course.CourseTimeRanges || [],
              type: course.type || [],
              numberOfStudents: course.numberOfStudents ?? null,
              maxStudents: course.maxStudents ?? null, // 新增
              Producted: course.Producted,
              teacher: course.teacher ? [course.teacher] : [],
              teacherId: course.teacherId || "",
              courseModulId: course.courseModulId ?? null,
              createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
              updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
              Students: course.Students ?? [], // 新增
            }))
          : [];
        
        setCourses(courseData);
        if (courseData.length > 0) {
          setSelectedCourse(courseData[0]);
          setCalendarDates(courseData[0].courseDates || []);
          reset({
            startDate: courseData[0].startDate || "",
            endDate: courseData[0].endDate || "",
            weekday: courseData[0].weekday || null,
            classroom: courseData[0].classroom || "",
            timeRanges: courseData[0].courseTimeRanges.map((range) => ({
              timeRange: range.timeRange,
              startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || "",
              endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || "",
            })),
            maxStudents: courseData[0].maxStudents || null, // 新增
          });
        } else {
          setSelectedCourse(null);
          setCalendarDates([]);
          reset({
            startDate: "",
            endDate: "",
            weekday: null,
            classroom: "",
            timeRanges: [],
            maxStudents: null, // 新增
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error instanceof Error ? error.message : "無法載入課程數據");
        setCourses([]);
        setSelectedCourse(null);
        setCalendarDates([]);
      }
    };
    fetchCourseData();
  }, [reset]);

  useEffect(() => {
    if (selectedCourse) {
      reset({
        startDate: selectedCourse.startDate || "",
        endDate: selectedCourse.endDate || "",
        weekday: selectedCourse.weekday || null,
        classroom: selectedCourse.classroom || "",
        timeRanges: selectedCourse.courseTimeRanges.map((range) => ({
          timeRange: range.timeRange,
          startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || "",
          endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || "",
        })),
        maxStudents: selectedCourse.maxStudents || null, // 新增
      });
      setCalendarDates(selectedCourse.courseDates || []);
    }
  }, [selectedCourse, reset]);

  useEffect(() => {
    if (selectedCourse && startDate && startDate !== "") {
      const start = parseISO(startDate);
      const newDates: string[] = [];

      if (selectedWeekday && selectedWeekday !== "") {
        const targetWeekday = parseInt(selectedWeekday);
        let currentDate = start;
        let count = 0;

        while (getDay(currentDate) !== targetWeekday) {
          currentDate = addDays(currentDate, 1);
        }

        while (count < selectedCourse.numberOfDays) {
          newDates.push(format(currentDate, "yyyy-MM-dd"));
          currentDate = addWeeks(currentDate, 1);
          count++;
        }
      } else {
        for (let i = 0; i < selectedCourse.numberOfDays; i++) {
          const date = addDays(start, i);
          newDates.push(format(date, "yyyy-MM-dd"));
        }
      }

      setCalendarDates(newDates);
    } else {
      setCalendarDates([]);
    }
  }, [startDate, selectedWeekday, selectedCourse]);

  useEffect(() => {
    if (selectedCourse && startDate && startDate !== "" && endDate && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const daysDifference = differenceInDays(end, start) + 1;
      if (daysDifference < selectedCourse.numberOfDays) {
        setDateRangeError(
          `日期範圍（${daysDifference} 天）少於課程持續天數（${selectedCourse.numberOfDays} 天）`
        );
      } else {
        setDateRangeError(null);
      }
    } else {
      setDateRangeError(null);
    }
  }, [startDate, endDate, selectedCourse]);

  useEffect(() => {
    const handleProductCreated = () => {
      setIsProductModalOpen(false);
      toast.success("產品已成功創建，modal 已關閉");
    };
    window.addEventListener("productCreated", handleProductCreated);
    return () => {
      window.removeEventListener("productCreated", handleProductCreated);
    };
  }, []);

  const handleTimeRangeToggle = (timeRange: string) => {
    const index = formTimeRanges?.findIndex((tr) => tr.timeRange === timeRange) ?? -1;
    if (index >= 0) {
      remove(index);
    } else {
      const { start, end } = timeRangeOptions[timeRange as keyof typeof timeRangeOptions];
      append({ timeRange, startTime: start, endTime: end });
    }
  };

  const onSubmit = async (data: CourseDateForm) => {
    if (!selectedCourse) {
      toast.info("請選擇課程");
      return;
    }

    if (dateRangeError) {
      toast.error(dateRangeError);
      return;
    }

    try {
      const response = await fetch(`/api/Course/Update_Course/${selectedCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          courseDates: calendarDates,
          courseTimeRanges: data.timeRanges?.map((tr) => ({
            timeRange: tr.timeRange,
            starttime: tr.startTime,
            endtime: tr.endTime,
          })) || [],
          maxStudents: data.maxStudents, // 新增
        }),
      });
      if (!response.ok) {
        throw new Error(`更新失敗: ${response.status}`);
      }
      const updatedCourse = await response.json();
      setCourses(courses.map((course) =>
        course.id === updatedCourse.id
          ? {
              ...updatedCourse,
              isProduct: updatedCourse.Producted ?? false,
              courseDates: updatedCourse.Coursedates,
              courseTimeRanges: updatedCourse.CourseTimeRanges,
              maxStudents: updatedCourse.maxStudents, // 新增
              Students: updatedCourse.Students || [], // 新增
            }
          : course
      ));
      setSelectedCourse({
        ...updatedCourse,
        isProduct: updatedCourse.Producted ?? false,
        courseDates: updatedCourse.Coursedates,
        courseTimeRanges: updatedCourse.CourseTimeRanges,
        maxStudents: updatedCourse.maxStudents, // 新增
        Students: updatedCourse.Students || [], // 新增
      });
      toast.success("課程更新成功");
      router.push("/admin/CourseLists");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error instanceof Error ? error.message : "更新課程失敗，請稍後重試");
    }
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    if (!selectedCourse) {
      toast.info("請選擇課程");
      return;
    }

    const clickedDate = arg.dateStr;
    if (startDate && startDate !== "" && endDate && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const clicked = parseISO(clickedDate);
      if (clicked < start || clicked > end) {
        toast.info("只能在開始日期和結束日期之間選擇日期");
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== "") {
      const clicked = parseISO(clickedDate);
      if (getDay(clicked) !== parseInt(selectedWeekday)) {
        toast.info(`只能選擇${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
        return;
      }
    }

    let updatedDates: string[];
    if (calendarDates.includes(clickedDate)) {
      updatedDates = calendarDates.filter((date) => date !== clickedDate);
    } else {
      updatedDates = [...calendarDates, clickedDate];
    }

    if (updatedDates.length > selectedCourse.numberOfDays) {
      toast.info(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
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

    if (startDate && startDate !== "" && endDate && endDate !== "") {
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

    let updatedDates = [...calendarDates];
    if (oldDate && calendarDates.includes(oldDate)) {
      updatedDates = updatedDates.filter((date) => date !== oldDate);
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

  const calendarEvents = calendarDates.map((date) => ({
    title: selectedCourse?.title || "課程",
    date,
    allDay: true,
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    textColor: "#ffffff",
  }));

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin/CourseLists" className="text-blue-400 hover:underline mb-4 inline-block">
          返回
        </Link>
        <h1 className="text-2xl font-bold mb-6">安排課程</h1>
        {dateRangeError && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            {dateRangeError}
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 flex flex-col gap-6">
            <div className="bg-gray-700 rounded-md p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">課程列表</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourse(course)}
                      className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${
                        selectedCourse?.id === course.id ? "bg-gray-600" : ""
                      }`}
                    >
                      <p className="font-medium">{course.title}</p>
                      <p className="text-sm text-gray-300">{course.courseCode}</p>
                      <p className="text-sm text-gray-300">
                        狀態: {course.isProduct ? "已成為產品" : "未成為產品"}
                      </p>
                      <p className="text-sm text-gray-300">
                        學生數: {course.Students.length} / {course.maxStudents ?? "無上限"}
                        {isCourseFull(course) && (
                          <span className="ml-2 text-red-400 font-medium">已滿</span>
                        )}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">沒有可用的課程</p>
                )}
              </div>
            </div>

            {selectedCourse && (
              <div className="bg-gray-700 rounded-md p-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">課程詳情</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">開始日期</label>
                    <Input
                      type="date"
                      {...register("startDate")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">結束日期</label>
                    <Input
                      type="date"
                      {...register("endDate")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm">{errors.endDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">人數上限（可選）</label>
                    <Input
                      type="number"
                      {...register("maxStudents", { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                      placeholder="輸入人數上限（可選）"
                    />
                    {errors.maxStudents && (
                      <p className="text-red-500 text-sm">{errors.maxStudents.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">時間段</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedCourse && Array.isArray(selectedCourse.courseTimeRanges) && selectedCourse.courseTimeRanges.length > 0 ? (
                        selectedCourse.courseTimeRanges.map((range) => (
                          <Button
                            key={range.id}
                            type="button"
                            onClick={() => handleTimeRangeToggle(range.timeRange)}
                            className={`px-4 py-2 rounded-md ${
                              formTimeRanges?.some((tr) => tr.timeRange === range.timeRange)
                                ? "bg-blue-600"
                                : "bg-gray-600 hover:bg-gray-500"
                            }`}
                          >
                            {timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.label || range.timeRange}
                          </Button>
                        ))
                      ) : (
                        <p className="text-gray-400">無可用時間段</p>
                      )}
                    </div>
                  </div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 border-b border-gray-600 pb-4">
                      <h3 className="text-sm font-medium">
                        {timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions]?.label || field.timeRange}
                      </h3>
                      <div>
                        <label className="block text-sm font-medium">開始時間</label>
                        <Input
                          type="time"
                          {...register(`timeRanges.${index}.startTime`)}
                          min={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].start}
                          max={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].end}
                          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                        />
                        {errors.timeRanges?.[index]?.startTime && (
                          <p className="text-red-500 text-sm">{errors.timeRanges[index]?.startTime?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium">結束時間</label>
                        <Input
                          type="time"
                          {...register(`timeRanges.${index}.endTime`)}
                          min={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].start}
                          max={timeRangeOptions[field.timeRange as keyof typeof timeRangeOptions].end}
                          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                        />
                        {errors.timeRanges?.[index]?.endTime && (
                          <p className="text-red-500 text-sm">{errors.timeRanges[index]?.endTime?.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium">週份</label>
                    <select
                      {...register("weekday")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    >
                      <option value="">選擇星期</option>
                      {weekdays.map((weekday) => (
                        <option key={weekday.value} value={weekday.value}>
                          {weekday.label}
                        </option>
                      ))}
                    </select>
                    {errors.weekday && (
                      <p className="text-red-500 text-sm">{errors.weekday.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">課室</label>
                    <Input
                      type="text"
                      {...register("classroom")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                      placeholder="輸入課室名稱（可選）"
                    />
                    {errors.classroom && (
                      <p className="text-red-500 text-sm">{errors.classroom.message}</p>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      更新課程
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

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
                eventBackgroundColor="#2563eb"
                eventBorderColor="#2563eb"
                eventTextColor="#ffffff"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                height="auto"
                eventDrop={handleEventDrop}
                validRange={
                  startDate && startDate !== "" && endDate && endDate !== ""
                    ? {
                        start: parseISO(startDate),
                        end: addDays(parseISO(endDate), 1),
                      }
                    : undefined
                }
              />
            </div>
            {selectedCourse && (
              <div className="mt-4">
                <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setIsProductModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      建立商品
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>基於課程建立商品</DialogTitle>
                    </DialogHeader>
                    <Create_Product_Form
                      initialCourse={selectedCourse}
                      initialCourseDates={calendarDates}
                      initialTimeRanges={formTimeRanges}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrangeCoursePage;