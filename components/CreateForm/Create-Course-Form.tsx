// "use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState, useTransition } from "react";
// import {  useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { CreateCourseSchema } from "@/app/actions/Create/Create_Course/schema";
// import { CreateCourseAction } from "@/app/actions/Create/Create_Course";
// import { Switch } from "@/components/ui/switch";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "../ui/textarea";

// const Create_Course_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const params = useParams();
//   const TeacherId = params.Teacherid as string;
//   const [GetTypesData, setGetTypesData] = useState<
//     { id: string; name: string }[]
//   >([]);
//   const [GetCourseModul, setGetCourseModul] = useState<
//     { id: string; title: string; description: string }[]
//   >([]);
//   const [GetTeacherData, setGetTeacherData] = useState<{ name: string } | null>(null);

//   const Course_create_form = useForm<z.infer<typeof CreateCourseSchema>>({
//     resolver: zodResolver(CreateCourseSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       course_code: "",
//       school_name: "",
//       Number_of_days: 0,
//       courseModulId: null,
//       time_hours: 0,
//       teacher: [],
//       Ispublic: false,
//       TimeRange: "",
//       type: [],
//       teacher_id: TeacherId,
//     },
//   });

//   // 監聽 courseModulId 的變化，動態設置 description
//   const selectedCourseModulId = Course_create_form.watch("courseModulId");
//   useEffect(() => {
//     if (selectedCourseModulId && selectedCourseModulId !== "none") {
//       const selectedModul = GetCourseModul.find(
//         (modul) => modul.id === selectedCourseModulId
//       );
//       if (selectedModul) {
//         Course_create_form.setValue("description", selectedModul.description);
//       }
//     } else {
//       Course_create_form.setValue("description", "");
//     }
//   }, [selectedCourseModulId, GetCourseModul, Course_create_form]);

//   // 設置 teacher 字段的默認值
//   useEffect(() => {
//     if (GetTeacherData?.name) {
//       Course_create_form.setValue("teacher", [GetTeacherData.name]);
//     }
//   }, [GetTeacherData, Course_create_form]);

//   useEffect(() => {
//     const fetchTypesData = async () => {
//       try {
//         const res = await fetch(`/api/Type/Get_Type_Lists`);
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setGetTypesData(data);
//         } else {
//           console.error("Get_Type_Lists API 返回非陣列資料", data);
//           setGetTypesData([]);
//         }
//       } catch (error) {
//         console.error("fetchTypesData error:", error);
//         setGetTypesData([]);
//       }
//     };
//     const fetchCourseModul = async () => {
//       try {
//         const res = await fetch(`/api/Course/Get_CourseModul_Lists`);
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setGetCourseModul(data);
//         } else {
//           console.error("Get_CourseModul_Lists API 返回非陣列資料", data);
//           setGetCourseModul([]);
//         }
//       } catch (error) {
//         console.error("fetchCourseModul error:", error);
//         setGetCourseModul([]);
//       }
//     };

//     const fetchUserData = async (TeacherId: string) => {
//       try {
//         const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
//         const data = await res.json();
//         setGetTeacherData(data);
//       } catch (error) {
//         console.error("fetchUserData error:", error);
//         setGetTeacherData(null);
//       }
//     };

//     fetchUserData(TeacherId);
//     fetchTypesData();
//     fetchCourseModul();
//   }, [TeacherId]);

//   console.log("GetTypesData: ", GetTypesData);
//   console.log("GetCourseModul: ", GetCourseModul);
//   console.log("GetTeacherData: ", GetTeacherData);

//   const Course_create_form_onSubmit = (values: z.infer<typeof CreateCourseSchema>) => {
//     console.log("-- 課程輸入數據 -- :", values, "-- 結束 --");
//     startTransition(() => {
//       CreateCourseAction(values).then((result) => {
//         if (result.data) {
//           router.push(`/teacher/${TeacherId}/CourseLists`);
//         }
//       });
//     });
//   };

//   console.log("Error: ", Course_create_form.formState.errors, "-- End --");

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <h1 className="text-2xl font-bold mb-6">創建課程</h1>
//         <Form {...Course_create_form}>
//           <form
//             onSubmit={Course_create_form.handleSubmit(Course_create_form_onSubmit)}
//             className="space-y-6"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={Course_create_form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">標題</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程標題"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">描述</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程描述"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         rows={4}
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="course_code"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程代碼</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程代碼"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="school_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">學校名稱</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入學校名稱"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="Number_of_days"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程天數</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程天數"
//                         type="number"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value || ""}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="TimeRange"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">時段</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入時段 (例如: 09:00-12:00)"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="time_hours"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程時數</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程時數"
//                         type="number"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value || ""}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="teacher"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">教師 (以逗號分隔)</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="老師名稱"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         onChange={(e) =>
//                           field.onChange(
//                             e.target.value
//                               .split(",")
//                               .map((t) => t.trim())
//                               .filter((t) => t.length > 0)
//                           )
//                         }
//                         value={field.value.join(", ")}
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="Ispublic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">是否公開</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending}
//                         className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="courseModulId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程模組</FormLabel>
//                     <FormControl>
//                       <Select
//                         onValueChange={(value) => field.onChange(value === "none" ? null : value)}
//                         value={field.value ?? "none"}
//                         disabled={isPending}
//                       >
//                         <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-gray-500">
//                           <SelectValue placeholder="選擇課程模組" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-gray-700 text-white border-gray-600">
//                           <SelectItem value="none">無模組</SelectItem>
//                           {GetCourseModul.map((modul) => (
//                             <SelectItem key={modul.id} value={modul.id}>
//                               {modul.title}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程類型</FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         {GetTypesData.map((type) => (
//                           <div key={type.id} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={type.id}
//                               checked={field.value.includes(type.id)}
//                               onCheckedChange={(checked) => {
//                                 const currentValues = Array.isArray(field.value)
//                                   ? field.value
//                                   : [];
//                                 if (checked) {
//                                   field.onChange([...currentValues, type.id]);
//                                 } else {
//                                   field.onChange(
//                                     currentValues.filter((v) => v !== type.id)
//                                   );
//                                 }
//                               }}
//                               disabled={isPending}
//                               className="border-gray-600 data-[state=checked]:bg-gray-600"
//                             />
//                             <label
//                               htmlFor={type.id}
//                               className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                             >
//                               {type.name}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <input
//               type="hidden"
//               value={TeacherId}
//               {...Course_create_form.register("teacher_id")}
//             />

//             <Button
//               type="submit"
//               disabled={isPending}
//               className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//             >
//               提交
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Create_Course_Form;
// "use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState, useTransition } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { CreateCourseSchema } from "@/app/actions/Create/Create_Course/schema";
// import { CreateCourseAction } from "@/app/actions/Create/Create_Course";
// import { Switch } from "@/components/ui/switch";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "../ui/textarea";
// import DatePicker from "react-multi-date-picker";
// import TimePicker from "react-multi-date-picker/plugins/time_picker";

// const Create_Course_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const params = useParams();
//   const TeacherId = params.Teacherid as string;
//   const [GetTypesData, setGetTypesData] = useState<
//     { id: string; name: string }[]
//   >([]);
//   const [GetCourseModul, setGetCourseModul] = useState<
//     { id: string; title: string; description: string }[]
//   >([]);
//   const [GetTeacherData, setGetTeacherData] = useState<{ name: string } | null>(
//     null
//   );

//   const timeOptions = [
//     { id: "morning" as const, label: "上午" },
//     { id: "afternoon" as const, label: "下午" },
//     { id: "evening" as const, label: "晚上" },
//     { id: "full_day" as const, label: "全日" },
//   ] as const;

//   type TimeRangeValue = "morning" | "afternoon" | "evening" | "full_day";

//   const Course_create_form = useForm<z.infer<typeof CreateCourseSchema>>({
//     resolver: zodResolver(CreateCourseSchema),
//     mode: "onChange",
//     defaultValues: {
//       title: "",
//       description: "",
//       course_code: "",
//       school_name: "",
//       Number_of_days: 0,
//       courseModulId: null,
//       time_hours: 0,
//       teacher: [],
//       Ispublic: false,
//       TimeRange: [],
//       type: [],
//       teacher_id: TeacherId,
//       start_date: undefined,
//       end_date: undefined,
//       start_time: undefined,
//       end_time: undefined,
//     },
//   });

//   // 監聽 courseModulId 的變化，動態設置 description
//   const selectedCourseModulId = Course_create_form.watch("courseModulId");
//   useEffect(() => {
//     if (selectedCourseModulId && selectedCourseModulId !== "none") {
//       const selectedModul = GetCourseModul.find(
//         (modul) => modul.id === selectedCourseModulId
//       );
//       if (selectedModul) {
//         Course_create_form.setValue("description", selectedModul.description);
//       }
//     } else {
//       Course_create_form.setValue("description", "");
//     }
//   }, [selectedCourseModulId, GetCourseModul, Course_create_form]);

//   // 設置 teacher 字段的默認值
//   useEffect(() => {
//     if (GetTeacherData?.name) {
//       Course_create_form.setValue("teacher", [GetTeacherData.name]);
//     }
//   }, [GetTeacherData, Course_create_form]);

//   useEffect(() => {
//     const fetchTypesData = async () => {
//       try {
//         const res = await fetch(`/api/Type/Get_Type_Lists`);
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           const validData = data.filter((item: any) =>
//             typeof item === "object" && "id" in item && "name" in item
//           );
//           setGetTypesData(validData);
//         } else {
//           console.error("Get_Type_Lists API 返回非陣列資料", data);
//           setGetTypesData([]);
//         }
//       } catch (error) {
//         console.error("fetchTypesData error:", error);
//         setGetTypesData([]);
//       }
//     };

//     const fetchCourseModul = async () => {
//       try {
//         const res = await fetch(`/api/Course/Get_CourseModul_Lists`);
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           const validData = data.filter((item: any) =>
//             typeof item === "object" && "id" in item && "title" in item && "description" in item
//           );
//           setGetCourseModul(validData);
//         } else {
//           console.error("Get_CourseModul_Lists API 返回非陣列資料", data);
//           setGetCourseModul([]);
//         }
//       } catch (error) {
//         console.error("fetchCourseModul error:", error);
//         setGetCourseModul([]);
//       }
//     };

//     const fetchUserData = async (TeacherId: string) => {
//       try {
//         const res = await fetch(`/api/user/Get_User_Lists_by_Id/${TeacherId}`);
//         const data = await res.json();
//         if (data && typeof data === "object" && "name" in data) {
//           setGetTeacherData(data);
//         } else {
//           console.error("fetchUserData 返回無效數據", data);
//           setGetTeacherData(null);
//         }
//       } catch (error) {
//         console.error("fetchUserData error:", error);
//         setGetTeacherData(null);
//       }
//     };

//     fetchUserData(TeacherId);
//     fetchTypesData();
//     fetchCourseModul();
//   }, [TeacherId]);

//   console.log("GetTypesData: ", GetTypesData);
//   console.log("GetCourseModul: ", GetCourseModul);
//   console.log("GetTeacherData: ", GetTeacherData);

//   const Course_create_form_onSubmit: SubmitHandler<
//     z.infer<typeof CreateCourseSchema>
//   > = (values) => {
//     console.log("-- 課程輸入數據 -- :", values, "-- 結束 --");
//     startTransition(() => {
//       CreateCourseAction(values).then((result) => {
//         if (result.data) {
//           router.push(`/teacher/${TeacherId}/CourseLists`);
//         } else {
//           console.error("Create course failed:", result.error);
//           alert(result.error || "創建課程失敗，請稍後重試");
//         }
//       });
//     });
//   };

//   console.log("Error: ", Course_create_form.formState.errors, "-- End --");

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <h1 className="text-2xl font-bold mb-6">創建課程</h1>
//         <Form {...Course_create_form}>
//           <form
//             onSubmit={Course_create_form.handleSubmit(Course_create_form_onSubmit)}
//             className="space-y-6"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={Course_create_form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">標題</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程標題"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">描述</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程描述"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         rows={4}
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="course_code"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程代碼</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程代碼"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="school_name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">學校名稱</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入學校名稱"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="Number_of_days"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程天數</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程天數"
//                         type="number"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value || ""}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="TimeRange"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">時段</FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         {timeOptions.map((time) => (
//                           <div key={time.id} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={time.id}
//                               checked={field.value?.includes(time.id) || false}
//                               onCheckedChange={(checked) => {
//                                 const currentValues = Array.isArray(field.value)
//                                   ? (field.value as TimeRangeValue[])
//                                   : [];
//                                 if (checked) {
//                                   field.onChange([...currentValues, time.id]);
//                                 } else {
//                                   field.onChange(
//                                     currentValues.filter((v) => v !== time.id)
//                                   );
//                                 }
//                               }}
//                               disabled={isPending}
//                               className="border-gray-600 data-[state=checked]:bg-gray-600"
//                             />
//                             <label
//                               htmlFor={time.id}
//                               className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                             >
//                               {time.label}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="start_date"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">開始日期（可選）</FormLabel>
//                     <FormControl>
//                       <DatePicker
//                         format="YYYY-MM-DD"
//                         value={field.value ? new Date(field.value) : null}
//                         onChange={(value) => {
//                           console.log("start_date value:", value);
//                           field.onChange(
//                             value ? value.toDate().toISOString().split("T")[0] : undefined
//                           );
//                         }}
//                         disabled={isPending}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="end_date"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">結束日期（可選）</FormLabel>
//                     <FormControl>
//                       <DatePicker
//                         format="YYYY-MM-DD"
//                         value={field.value ? new Date(field.value) : null}
//                         onChange={(value) => {
//                           console.log("end_date value:", value);
//                           field.onChange(
//                             value ? value.toDate().toISOString().split("T")[0] : undefined
//                           );
//                         }}
//                         disabled={isPending}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="start_time"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">開始時間（可選）</FormLabel>
//                     <FormControl>
//                       <DatePicker
//                         disableDayPicker
//                         format="HH:mm"
//                         plugins={[<TimePicker position="bottom" />]}
//                         value={field.value ? field.value : null}
//                         onChange={(value) => {
//                           console.log("start_time value:", value);
//                           field.onChange(value ? value.format("HH:mm") : undefined);
//                         }}
//                         disabled={isPending}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="end_time"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">結束時間（可選）</FormLabel>
//                     <FormControl>
//                       <DatePicker
//                         disableDayPicker
//                         format="HH:mm"
//                         plugins={[<TimePicker position="bottom" />]}
//                         value={field.value ? field.value : null}
//                         onChange={(value) => {
//                           console.log("end_time value:", value);
//                           field.onChange(value ? value.format("HH:mm") : undefined);
//                         }}
//                         disabled={isPending}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="time_hours"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程時數</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程時數"
//                         type="number"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value || ""}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="teacher"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">教師 (以逗號分隔)</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="老師名稱"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         onChange={(e) =>
//                           field.onChange(
//                             e.target.value
//                               .split(",")
//                               .map((t) => t.trim())
//                               .filter((t) => t.length > 0)
//                           )
//                         }
//                         value={field.value.join(", ")}
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="Ispublic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">是否公開</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending}
//                         className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="courseModulId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程模組</FormLabel>
//                     <FormControl>
//                       <Select
//                         onValueChange={(value) => field.onChange(value === "none" ? null : value)}
//                         value={field.value ?? "none"}
//                         disabled={isPending}
//                       >
//                         <SelectTrigger className="bg-gray-700 text-white border-gray-600 focus:border-gray-500">
//                           <SelectValue placeholder="選擇課程模組" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-gray-700 text-white border-gray-600">
//                           <SelectItem value="none">無模組</SelectItem>
//                           {GetCourseModul.map((modul) => (
//                             <SelectItem key={modul.id} value={modul.id}>
//                               {modul.title}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={Course_create_form.control}
//                 name="type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程類型</FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         {GetTypesData.map((type) => (
//                           <div key={type.id} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={type.id}
//                               checked={field.value.includes(type.id)}
//                               onCheckedChange={(checked) => {
//                                 const currentValues = Array.isArray(field.value)
//                                   ? field.value
//                                   : [];
//                                 if (checked) {
//                                   field.onChange([...currentValues, type.id]);
//                                 } else {
//                                   field.onChange(
//                                     currentValues.filter((v) => v !== type.id)
//                                   );
//                                 }
//                               }}
//                               disabled={isPending}
//                               className="border-gray-600 data-[state=checked]:bg-gray-600"
//                             />
//                             <label
//                               htmlFor={type.id}
//                               className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                             >
//                               {type.name}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <input
//               type="hidden"
//               value={TeacherId}
//               {...Course_create_form.register("teacher_id")}
//             />

//             <Button
//               type="submit"
//               disabled={isPending}
//               className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//             >
//               提交
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Create_Course_Form;



"use client";

import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventDropArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO, addDays, differenceInDays, getDay, addWeeks } from "date-fns";
import { toast } from "react-toastify";

// 定義時間段枚舉類型
type TimeRangeEnum = "morning" | "afternoon" | "evening" | "full_day";

// 定義表單 schema
const CourseDateSchema = z.object({
  start_date: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "無效的開始日期",
  }).optional().nullable(),
  end_date: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "無效的結束日期",
  }).optional().nullable(),
  timeRanges: z
    .array(
      z.object({
        timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
        start_time: z.string().optional().nullable(),
        end_time: z.string().optional().nullable(),
      })
    )
    .optional(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.start_date && data.end_date && data.start_date !== "" && data.end_date !== "") {
      return parseISO(data.start_date) <= parseISO(data.end_date);
    }
    return true;
  },
  {
    message: "結束日期必須晚於或等於開始日期",
    path: ["end_date"],
  }
);

type CourseDateForm = z.infer<typeof CourseDateSchema>;

type CourseTimeRange = {
  id: string;
  courseId: string;
  timeRange: TimeRangeEnum;
  start_time: string | null;
  end_time: string | null;
  createdAt: string;
  updatedAt: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  timeRanges: TimeRangeEnum[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: false,
  types: string[];
  courseModuleId: string | null;
  startDate: string | null;
  endDate: string | null;
  courseDates: string[];
  weekday: string | null;
  classroom: string | null;
  createdAt: string;
  updatedAt: string;
  courseTimeRanges: CourseTimeRange[];
};

const timeRangeOptions: Record<TimeRangeEnum, { label: string; start: string; end: string }> = {
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
  const [isLoading, setIsLoading] = useState(true);
  const calendarRef = useRef<FullCalendar>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CourseDateForm>({
    resolver: zodResolver(CourseDateSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      timeRanges: [],
      weekday: null,
      classroom: null,
    },
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const selectedWeekday = watch("weekday");
  const timeRanges = watch("timeRanges");

  const weekdays = [
    { value: "0", label: "星期日" },
    { value: "1", label: "星期一" },
    { value: "2", label: "星期二" },
    { value: "3", label: "星期三" },
    { value: "4", label: "星期四" },
    { value: "5", label: "星期五" },
    { value: "6", label: "星期六" },
  ];

  const isValidTimeRange = (range: string): range is TimeRangeEnum => {
    return ["morning", "afternoon", "evening", "full_day"].includes(range);
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data: Course[] = await response.json();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
          setCalendarDates(data[0].courseDates || []);
          reset({
            start_date: data[0].startDate || "",
            end_date: data[0].endDate || "",
            timeRanges: data[0].courseTimeRanges
              .filter((tr) => isValidTimeRange(tr.timeRange))
              .map((tr) => ({
                timeRange: tr.timeRange,
                start_time: tr.start_time || "",
                end_time: tr.end_time || "",
              })) || [],
            weekday: data[0].weekday || null,
            classroom: data[0].classroom || "",
          });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入課程數據");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [reset]);

  useEffect(() => {
    if (selectedCourse) {
      reset({
        start_date: selectedCourse.startDate || "",
        end_date: selectedCourse.endDate || "",
        timeRanges: selectedCourse.courseTimeRanges
          .filter((tr) => isValidTimeRange(tr.timeRange))
          .map((tr) => ({
            timeRange: tr.timeRange,
            start_time: tr.start_time || "",
            end_time: tr.end_time || "",
          }))
          || selectedCourse.timeRanges
              .filter(isValidTimeRange)
              .map((range) => ({
                timeRange: range,
                start_time: timeRangeOptions[range].start,
                end_time: timeRangeOptions[range].end,
              })),
        weekday: selectedCourse.weekday || null,
        classroom: selectedCourse.classroom || "",
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

  const handleTimeRangeToggle = (timeRange: TimeRangeEnum) => {
    const currentTimeRanges = timeRanges || [];
    const existingIndex = currentTimeRanges.findIndex((tr) => tr.timeRange === timeRange);

    let updatedTimeRanges: CourseDateForm["timeRanges"] = [];
    if (existingIndex >= 0) {
      updatedTimeRanges = currentTimeRanges.filter((_, index) => index !== existingIndex);
    } else {
      updatedTimeRanges = [
        ...currentTimeRanges,
        {
          timeRange,
          start_time: timeRangeOptions[timeRange].start,
          end_time: timeRangeOptions[timeRange].end,
        },
      ];
    }

    setValue("timeRanges", updatedTimeRanges);
  };

  const onSubmit = async (data: CourseDateForm) => {
    if (!selectedCourse) {
      toast.warn("請選擇課程");
      return;
    }

    if (dateRangeError) {
      toast.error(dateRangeError);
      return;
    }

    try {
      const response = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: data.start_date,
          endDate: data.end_date,
          timeRanges: data.timeRanges,
          courseDates: calendarDates,
          weekday: data.weekday,
          classroom: data.classroom,
        }),
      });
      if (!response.ok) {
        throw new Error(`更新失敗: ${response.status}`);
      }
      const updatedCourse = await response.json();
      setCourses(courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      ));
      setSelectedCourse(updatedCourse);
      toast.success("課程更新成功");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新課程失敗，請稍後重試");
    }
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    if (!selectedCourse) {
      toast.warn("請選擇課程");
      return;
    }

    const clickedDate = arg.dateStr;
    if (startDate && startDate !== "" && endDate && endDate !== "") {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const clicked = parseISO(clickedDate);
      if (clicked < start || clicked > end) {
        toast.warn("只能在開始日期和結束日期之間選擇日期");
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== "") {
      const clicked = parseISO(clickedDate);
      if (getDay(clicked) !== parseInt(selectedWeekday)) {
        toast.warn(`只能選擇${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
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
      toast.warn(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
      return;
    }

    setCalendarDates(updatedDates);
  };

  const handleEventDrop = (info: EventDropArg) => {
    if (!selectedCourse) {
      toast.warn("請選擇課程");
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
        toast.warn("只能在開始日期和結束日期之間拖放日期");
        info.revert();
        return;
      }
    }

    if (selectedWeekday && selectedWeekday !== "") {
      const newDateParsed = parseISO(newDate);
      if (getDay(newDateParsed) !== parseInt(selectedWeekday)) {
        toast.warn(`只能拖放到${weekdays.find(w => w.value === selectedWeekday)?.label}的日期`);
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
      toast.warn(`課程日期數量不能超過 ${selectedCourse.numberOfDays} 天`);
      info.revert();
      return;
    }

    setCalendarDates(updatedDates);
  };

  const calendarEvents = selectedCourse
    ? calendarDates.map((date) => ({
        title: selectedCourse.title,
        date,
        allDay: true,
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
        textColor: "#ffffff",
      }))
    : [];

  if (isLoading) {
    return <div className="text-center py-10 text-white">載入中...</div>;
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-600 ${
                      selectedCourse?.id === course.id ? "bg-gray-600" : ""
                    }`}
                  >
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-300">{course.courseCode}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedCourse && (
              <div className="bg-gray-700 rounded-md p-4 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">課程詳情</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">開始日期</label>
                    <input
                      type="date"
                      {...register("start_date")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm">{errors.start_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">結束日期</label>
                    <input
                      type="date"
                      {...register("end_date")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-sm">{errors.end_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">時間段</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedCourse.timeRanges.filter(isValidTimeRange).map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => handleTimeRangeToggle(range)}
                          className={`px-4 py-2 rounded-md ${
                            timeRanges?.some((tr) => tr.timeRange === range)
                              ? "bg-blue-600"
                              : "bg-gray-600 hover:bg-gray-500"
                          }`}
                        >
                          {timeRangeOptions[range].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {timeRanges && timeRanges.length > 0 && (
                    <div className="space-y-4">
                      {timeRanges.map((tr, index) => (
                        <div key={tr.timeRange} className="border-t border-gray-600 pt-4">
                          <h3 className="text-sm font-medium">
                            {timeRangeOptions[tr.timeRange].label} 時間設置
                          </h3>
                          <div className="mt-2 space-y-2">
                            <div>
                              <label className="block text-sm font-medium">開始時間</label>
                              <input
                                type="time"
                                {...register(`timeRanges.${index}.start_time`)}
                                min={timeRangeOptions[tr.timeRange].start}
                                max={timeRangeOptions[tr.timeRange].end}
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                              />
                              {errors.timeRanges?.[index]?.start_time && (
                                <p className="text-red-500 text-sm">
                                  {errors.timeRanges[index].start_time?.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium">結束時間</label>
                              <input
                                type="time"
                                {...register(`timeRanges.${index}.end_time`)}
                                min={timeRangeOptions[tr.timeRange].start}
                                max={timeRangeOptions[tr.timeRange].end}
                                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                              />
                              {errors.timeRanges?.[index]?.end_time && (
                                <p className="text-red-500 text-sm">
                                  {errors.timeRanges[index].end_time?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    <input
                      type="text"
                      {...register("classroom")}
                      className="mt-1 block w-full rounded-md bg-gray-800 border-gray-600 text-white p-2"
                      placeholder="輸入課室名稱（可選）"
                    />
                    {errors.classroom && (
                      <p className="text-red-500 text-sm">{errors.classroom.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    更新課程
                  </button>
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
            {/* <style jsx>{`
              :global(.fc) {
                background-color: #4b5563;
                border-radius: 0.375rem;
                padding: 1rem;
              }
              :global(.fc-toolbar) {
                background-color: #374151;
                color: #ffffff;
                border-radius: 0.375rem 0.375rem 0 0;
              }
              :global(.fc-button) {
                background-color: #2563eb !important;
                border: none !important;
                border-radius: 0.25rem;
                margin: 0.25rem;
              }
              :global(.fc-button:hover) {
                background-color: #1e40af !important;
              }
              :global(.fc-daygrid-day) {
                background-color: #4b5563;
                color: #ffffff;
              }
              :global(.fc-daygrid-day-number) {
                color: #ffffff;
              }
              :global(.fc-col-header-cell) {
                background-color: #374151;
                color: #ffffff;
              }
              :global(.fc-day-disabled) {
                background-color: #1f2937 !important;
                opacity: 0.5;
              }
            `}</style> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrangeCoursePage;