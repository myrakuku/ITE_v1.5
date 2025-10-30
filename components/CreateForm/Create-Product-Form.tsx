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
// import { useCallback, useEffect, useState, useTransition } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { CreateProductSchema } from "@/app/actions/Create/Create_Product/schema";
// import { CreateProductAction } from "@/app/actions/Create/Create_Product";
// import { Switch } from "@/components/ui/switch";
// import { useRouter } from "next/navigation";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { z } from "zod";
// import Image from "next/image";
// import { toast } from "sonner";
// import { Course } from "@/types/course";

// type FormValues = z.infer<typeof CreateProductSchema> & {
//   images?: File[];
// };

// interface CourseProductType {
//   id: string;
//   typename: string;
//   author: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface CourseProductStatus {
//   id: string;
//   statuename: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface CreateProductFormProps {
//   initialCourse?: Course;
//   initialCourseDates?: string[];
//   initialTimeRanges?: { timeRange: string; startTime?: string | null; endTime?: string | null }[];
// }

// const timeRangeOptions = {
//   morning: { label: "上午", start: "09:00", end: "13:00" },
//   afternoon: { label: "下午", start: "14:00", end: "18:00" },
//   evening: { label: "晚上", start: "19:00", end: "22:00" },
//   full_day: { label: "全天", start: "00:00", end: "23:59" },
// };

// const Create_Product_Form = ({ initialCourse, initialCourseDates = [], initialTimeRanges = [] }: CreateProductFormProps) => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const [GetCourseListsData, setGetCourseListsData] = useState<Course[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourse?.id || null);
//   const [GetTypeData, setGetTypeData] = useState<CourseProductType[]>([]);
//   const [GetStatueDadta, setGetStatueDadta] = useState<CourseProductStatus[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);

//   const user_Product_form = useForm<FormValues>({
//     resolver: zodResolver(CreateProductSchema),
//     defaultValues: {
//       title: initialCourse?.title || "",
//       description: initialCourse?.description || "",
//       price: initialCourse ? initialCourse.numberOfDays * initialCourse.timeHours * 100 : 0,
//       real_price: initialCourse ? Math.round(initialCourse.numberOfDays * initialCourse.timeHours * 100 * 0.9) : 0,
//       IsPublic: initialCourse?.isPublic || false,
//       CourseProductTypeArray: initialCourse?.type || [],
//       CourseProductStatusArray: [],
//       courseId: initialCourse?.id || null,
//       imageUrls: [],
//       videoUrls: "",
//       Target_Audience: "",
//       Course_Objective: "",
//       Applicable_Scenarios: "",
//       courseDates: initialCourseDates || [],
//       courseTimeRanges: initialTimeRanges?.map((range) => ({
//         timeRange: range.timeRange,
//         startTime: range.startTime ?? timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start ?? null,
//         endTime: range.endTime ?? timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end ?? null,
//       })) || [],
//       images: [],
//     },
//   });

//   // 使用 useCallback 確保 handleCourseSelect 穩定
//   const handleCourseSelect = useCallback((course: Course) => {
//     if (course.Producted && !initialCourse) {
//       toast.info("此課程已轉為產品，無法再次選擇");
//       return;
//     }
//     setSelectedCourseId(course.id);
//     user_Product_form.setValue("title", course.title, { shouldValidate: true });
//     user_Product_form.setValue("description", course.description, {
//       shouldValidate: true,
//     });
//     user_Product_form.setValue("courseId", course.id, { shouldValidate: true });
//     user_Product_form.setValue("IsPublic", course.isPublic, {
//       shouldValidate: true,
//     });
//     user_Product_form.setValue("courseDates", course.courseDates, {
//       shouldValidate: true,
//     });
//     user_Product_form.setValue(
//       "courseTimeRanges",
//       course.courseTimeRanges.map((range) => ({
//         timeRange: range.timeRange,
//         startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || null,
//         endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || null,
//       })),
//       { shouldValidate: true }
//     );
//     if (course.numberOfDays && course.timeHours) {
//       const suggestedPrice = course.numberOfDays * course.timeHours * 100;
//       user_Product_form.setValue("price", suggestedPrice, {
//         shouldValidate: true,
//       });
//       user_Product_form.setValue("real_price", Math.round(suggestedPrice * 0.9), {
//         shouldValidate: true,
//       });
//     }
//     toast.success(`已選擇課程：${course.title}`);
//   }, [user_Product_form, initialCourse]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []).filter(
//       (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
//     );

//     if (files.length !== e.target.files?.length) {
//       toast.error("部分圖片無效或超過 5MB");
//       return;
//     }

//     setSelectedImages(files);

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews((prev) => {
//       prev.forEach((url) => URL.revokeObjectURL(url));
//       return previews;
//     });
//   };

//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreviews]);

//   useEffect(() => {
//     const fetchCourseListsData = async () => {
//       try {
//         const response = await fetch("/api/Course/Get_Course_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         const courseData = Array.isArray(data)
//           ? data.map((course: Course) => ({
//               ...course,
//               Producted: course.Producted ?? false,
//               isProduct: course.isProduct ?? false,
//               courseDates: course.courseDates || [],
//               courseTimeRanges: course.courseTimeRanges || [],
//             }))
//           : [];
//         setGetCourseListsData(courseData);
//         if (!initialCourse && courseData.length > 0 && !selectedCourseId) {
//           const firstSelectable = courseData.find(
//             (course: Course) => !course.Producted
//           );
//           if (firstSelectable) {
//             handleCourseSelect(firstSelectable);
//           } else {
//             toast.info("無可選課程，請先創建課程");
//           }
//         }
//       } catch (_err) {
//         const errorMessage = _err instanceof Error ? _err.message : "無法獲取課程數據";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     };

//     const fetchTypeListsData = async () => {
//       try {
//         const response = await fetch("/api/Type/Get_Type_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetTypeData(data);
//       } catch (_err) {
//         const errorMessage = _err instanceof Error ? _err.message : "無法獲取類型數據";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     };

//     const fetchStatueListsData = async () => {
//       try {
//         const response = await fetch("/api/Status/Get_Status_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetStatueDadta(data);
//       } catch (_err) {
//         const errorMessage = _err instanceof Error ? _err.message : "無法獲取狀態數據";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     };

//     fetchCourseListsData();
//     fetchTypeListsData();
//     fetchStatueListsData();
//   }, []); // 移除不必要的依賴

//   const user_Product_form_onSubmit: SubmitHandler<FormValues> = async (values) => {
//     console.log("product_values:", values, "-- End --");

//     if (!selectedCourseId) {
//       toast.error("請選擇一個課程");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", values.title);
//     formData.append("description", values.description);
//     formData.append("price", values.price.toString());
//     formData.append("real_price", values.real_price.toString());
//     formData.append("IsPublic", values.IsPublic.toString());
//     formData.append("CourseProductTypeArray", JSON.stringify(values.CourseProductTypeArray || []));
//     formData.append("CourseProductStatusArray", JSON.stringify(values.CourseProductStatusArray || []));

//     if (values.courseId) {
//       formData.append("courseId", values.courseId);
//     }
//     if (values.Target_Audience) {
//       formData.append("Target_Audience", values.Target_Audience);
//     }
//     if (values.Course_Objective) {
//       formData.append("Course_Objective", values.Course_Objective);
//     }
//     if (values.Applicable_Scenarios) {
//       formData.append("Applicable_Scenarios", values.Applicable_Scenarios);
//     }
//     formData.append("courseDates", JSON.stringify(values.courseDates || []));
//     formData.append("courseTimeRanges", JSON.stringify(values.courseTimeRanges || []));

//     if (values.videoUrls) {
//       formData.append("videoUrls", values.videoUrls);
//     }

//     if (selectedImages.length > 0) {
//       console.log("添加圖片到 FormData，數量:", selectedImages.length);
//       selectedImages.forEach((file, index) => {
//         console.log(`添加圖片[${index}]:`, file.name, file.size, file.type);
//         formData.append("images", file);
//       });
//     } else {
//       console.log("沒有選擇圖片");
//     }

//     console.log("FormData 內容:");
//     for (const [key, value] of formData.entries()) {
//       if (value instanceof File) {
//         console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
//       } else {
//         console.log(`${key}: ${value}`);
//       }
//     }

//     startTransition(async () => {
//       try {
//         const result = await CreateProductAction(formData);

//         if (result.error) {
//           user_Product_form.setError("root", {
//             type: "manual",
//             message: result.error,
//           });
//           toast.error(result.error);
//         } else {
//           toast.success("產品創建成功");
//           console.log("返回的產品數據:", result.data);
//           if (initialCourse) {
//             window.dispatchEvent(
//               new CustomEvent("productCreated", { detail: result.data })
//             );
//           } else {
//             router.push("/admin/ProductLists");
//           }
//           setSelectedImages([]);
//           setImagePreviews([]);
//         }
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "提交失敗，請重試";
//         user_Product_form.setError("root", {
//           type: "manual",
//           message: errorMessage,
//         });
//         toast.error(errorMessage);
//       }
//     });
//   };

//   const selectableCourses = GetCourseListsData.filter(
//     (course) => !course.Producted
//   );
//   const nonSelectableCourses = GetCourseListsData.filter(
//     (course) => course.Producted
//   );

//   console.log("Form Errors:", user_Product_form.formState.errors, "-- End --");
//   console.log("Selected Course ID:", selectedCourseId, "-- End --");
//   console.log("Course List Data:", GetCourseListsData, "-- End --");

//   return (
//     <div className="container mx-auto p-4 flex gap-6">
//       <div className="w-1/3">
//         <h2 className="text-xl font-semibold mb-4">選擇課程</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         {initialCourse ? (
//           <div className="p-3 border rounded bg-blue-50 border-blue-200">
//             <h3 className="font-medium text-blue-800">{initialCourse.title}</h3>
//             <p className="text-sm text-gray-600">{initialCourse.description}</p>
//             <p className="text-sm text-gray-500">
//               課程代碼: {initialCourse.courseCode}
//             </p>
//             <p className="text-sm text-gray-500">學校: {initialCourse.schoolName}</p>
//             <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
//               <p className="text-sm text-green-800 font-medium">
//                 ✅ 已自動選擇此課程
//               </p>
//               <p className="text-xs text-green-600">基於安排特別課程頁面</p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <h3 className="text-lg font-medium mb-2">
//                 不可選課程（已為產品）
//               </h3>
//               {nonSelectableCourses.length > 0 ? (
//                 <div className="grid gap-2">
//                   {nonSelectableCourses.map((course) => (
//                     <div
//                       key={course.id}
//                       className="p-3 border rounded bg-gray-200 cursor-not-allowed"
//                     >
//                       <h3 className="font-medium">{course.title}</h3>
//                       <p className="text-sm text-gray-600">{course.description}</p>
//                       <p className="text-sm text-gray-500">
//                         課程代碼: {course.courseCode}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         學校: {course.schoolName}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-gray-500">無不可選課程</div>
//               )}
//             </div>
//             <div className="w-1/2">
//               <h3 className="text-lg font-medium mb-2">
//                 可選課程（可轉為產品）
//               </h3>
//               {selectableCourses.length > 0 ? (
//                 <div className="grid gap-2">
//                   {selectableCourses.map((course) => (
//                     <div
//                       key={course.id}
//                       className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
//                         selectedCourseId === course.id ? "bg-blue-100 border-blue-500" : ""
//                       }`}
//                       onClick={() => handleCourseSelect(course)}
//                     >
//                       <h3 className="font-medium">{course.title}</h3>
//                       <p className="text-sm text-gray-600">{course.description}</p>
//                       <p className="text-sm text-gray-500">
//                         課程代碼: {course.courseCode}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         學校: {course.schoolName}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-gray-500">無可選課程</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="w-2/3">
//         <h1 className="text-2xl font-bold mb-4">
//           {initialCourse ? `創建產品 - ${initialCourse.title}` : "創建產品"}
//         </h1>
//         <Form {...user_Product_form}>
//           <form
//             onSubmit={user_Product_form.handleSubmit(user_Product_form_onSubmit)}
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//           >
//             {user_Product_form.formState.errors.root && (
//               <div className="col-span-2 text-red-500">
//                 {user_Product_form.formState.errors.root.message}
//               </div>
//             )}
//             {/* 左欄 */}
//             <div className="space-y-4">
//               <FormField
//                 control={user_Product_form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>標題</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending || !!initialCourse}
//                         placeholder="標題"
//                         type="text"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>描述</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         disabled={isPending || !!initialCourse}
//                         placeholder="描述"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="Target_Audience"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>目標觀眾</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         value={field.value ?? ""}
//                         disabled={isPending}
//                         placeholder="輸入目標觀眾"
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="Course_Objective"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>課程目標</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         value={field.value ?? ""}
//                         disabled={isPending}
//                         placeholder="輸入課程目標"
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="Applicable_Scenarios"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>可適用場景</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         value={field.value ?? ""}
//                         disabled={isPending}
//                         placeholder="輸入可適用場景"
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* 右欄 */}
//             <div className="space-y-4">
//               <FormField
//                 control={user_Product_form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>原價格</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="價格"
//                         type="number"
//                         min="0"
//                         step="1"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="real_price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>實際價格</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="實際價格"
//                         type="number"
//                         min="0"
//                         step="1"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="IsPublic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>是否公開</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending || !!initialCourse}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormItem>
//                 <FormLabel>上傳圖片</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     disabled={isPending}
//                     onChange={handleImageChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//               {imagePreviews.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="text-lg font-medium mb-2">圖片預覽</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     {imagePreviews.map((preview, index) => (
//                       <Image
//                         key={index}
//                         src={preview}
//                         alt={`圖片預覽 ${index + 1}`}
//                         width={150}
//                         height={100}
//                         className="w-full h-24 object-cover rounded"
//                         unoptimized
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <FormField
//                 control={user_Product_form.control}
//                 name="videoUrls"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>影片網址</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入單一影片網址"
//                         type="url"
//                         value={field.value ?? ""}
//                         onChange={(e) => field.onChange(e.target.value || undefined)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="CourseProductTypeArray"
//                 render={({ field: { value, onChange } }) => (
//                   <FormItem>
//                     <FormLabel>產品類型</FormLabel>
//                     <div className="grid gap-2">
//                       {GetTypeData.map((type) => (
//                         <div key={type.id} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={type.id}
//                             checked={(value || []).includes(type.id)}
//                             onCheckedChange={(checked) => {
//                               const newValue = checked
//                                 ? [...(value || []), type.id]
//                                 : (value || []).filter((t) => t !== type.id);
//                               onChange(newValue);
//                             }}
//                             disabled={isPending}
//                           />
//                           <Label htmlFor={type.id}>{type.typename}</Label>
//                         </div>
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="CourseProductStatusArray"
//                 render={({ field: { value, onChange } }) => (
//                   <FormItem>
//                     <FormLabel>產品狀態</FormLabel>
//                     <div className="grid gap-2">
//                       {GetStatueDadta.map((status) => (
//                         <div key={status.id} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={status.id}
//                             checked={(value || []).includes(status.id)}
//                             onCheckedChange={(checked) => {
//                               const newValue = checked
//                                 ? [...(value || []), status.id]
//                                 : (value || []).filter((s) => s !== status.id);
//                               onChange(newValue);
//                             }}
//                             disabled={isPending}
//                           />
//                           <Label htmlFor={status.id}>{status.statuename}</Label>
//                         </div>
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* 隱藏字段 */}
//             <FormField
//               control={user_Product_form.control}
//               name="courseId"
//               render={({ field }) => (
//                 <FormItem hidden>
//                   <FormControl>
//                     <Input {...field} value={field.value || ""} type="hidden" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={user_Product_form.control}
//               name="courseDates"
//               render={({ field }) => (
//                 <FormItem hidden>
//                   <FormControl>
//                     <Input {...field} value={JSON.stringify(field.value || [])} type="hidden" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={user_Product_form.control}
//               name="courseTimeRanges"
//               render={({ field }) => (
//                 <FormItem hidden>
//                   <FormControl>
//                     <Input {...field} value={JSON.stringify(field.value || [])} type="hidden" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="col-span-2">
//               <Button
//                 type="submit"
//                 disabled={isPending || !selectedCourseId}
//                 className="w-full md:w-auto"
//               >
//                 {isPending ? "正在提交..." : "提交"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Create_Product_Form;
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CreateProductSchema } from "@/app/actions/Create/Create_Product/schema";
import { CreateProductAction } from "@/app/actions/Create/Create_Product";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Course } from "@/types/course";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type FormValues = z.infer<typeof CreateProductSchema> & {
  images?: File[];
};

interface CourseProductType {
  id: string;
  typename: string;
  author: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseProductStatus {
  id: string;
  statuename: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductFormProps {
  initialCourse?: Course;
  initialCourseDates?: string[];
  initialTimeRanges?: { timeRange: string; startTime?: string | null; endTime?: string | null }[];
}

const timeRangeOptions = {
  morning: { label: "上午", start: "09:00", end: "13:00" },
  afternoon: { label: "下午", start: "14:00", end: "18:00" },
  evening: { label: "晚上", start: "19:00", end: "22:00" },
  full_day: { label: "全天", start: "00:00", end: "23:59" },
};

// === 步驟定義 ===
const steps = [
  { id: 1, name: "基本資訊", fields: ["title", "description"] },
  { id: 2, name: "價格與公開", fields: ["price", "real_price", "IsPublic"] },
  { id: 3, name: "目標與場景", fields: ["Target_Audience", "Course_Objective", "Applicable_Scenarios"] },
  { id: 4, name: "圖片與影片", fields: ["images", "videoUrls"] },
  { id: 5, name: "類型與狀態", fields: ["CourseProductTypeArray", "CourseProductStatusArray"] },
  { id: 6, name: "確認提交", fields: [] },
];

const Create_Product_Form = ({
  initialCourse,
  initialCourseDates = [],
  initialTimeRanges = [],
}: CreateProductFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [GetCourseListsData, setGetCourseListsData] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(initialCourse?.id || null);
  const [GetTypeData, setGetTypeData] = useState<CourseProductType[]>([]);
  const [GetStatueDadta, setGetStatueDadta] = useState<CourseProductStatus[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const user_Product_form = useForm<FormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      title: initialCourse?.title || "",
      description: initialCourse?.description || "",
      price: initialCourse ? initialCourse.numberOfDays * initialCourse.timeHours * 100 : 0,
      real_price: initialCourse ? Math.round(initialCourse.numberOfDays * initialCourse.timeHours * 100 * 0.9) : 0,
      IsPublic: initialCourse?.isPublic || false,
      CourseProductTypeArray: initialCourse?.type || [],
      CourseProductStatusArray: [],
      courseId: initialCourse?.id || null,
      imageUrls: [],
      videoUrls: "",
      Target_Audience: "",
      Course_Objective: "",
      Applicable_Scenarios: "",
      courseDates: initialCourseDates || [],
      courseTimeRanges: initialTimeRanges?.map((range) => ({
        timeRange: range.timeRange,
        startTime: range.startTime ?? timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start ?? null,
        endTime: range.endTime ?? timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end ?? null,
      })) || [],
      images: [],
    },
  });

  const currentStepConfig = steps.find((s) => s.id === currentStep)!;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  // === 步驟切換 ===
  const next = async () => {
    const fields = currentStepConfig.fields;
    const output = await user_Product_form.trigger(fields as any[]);
    if (!output) return;

    if (currentStep < steps.length) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleCourseSelect = useCallback(
    (course: Course) => {
      if (course.Producted && !initialCourse) {
        toast.info("此課程已轉為產品，無法再次選擇");
        return;
      }
      setSelectedCourseId(course.id);
      user_Product_form.setValue("title", course.title, { shouldValidate: true });
      user_Product_form.setValue("description", course.description, { shouldValidate: true });
      user_Product_form.setValue("courseId", course.id, { shouldValidate: true });
      user_Product_form.setValue("IsPublic", course.isPublic, { shouldValidate: true });
      user_Product_form.setValue("courseDates", course.courseDates || initialCourseDates, { shouldValidate: true });
      user_Product_form.setValue(
        "courseTimeRanges",
        course.courseTimeRanges.map((range) => ({
          timeRange: range.timeRange,
          startTime: range.starttime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.start || null,
          endTime: range.endtime || timeRangeOptions[range.timeRange as keyof typeof timeRangeOptions]?.end || null,
        })),
        { shouldValidate: true }
      );
      if (course.numberOfDays && course.timeHours) {
        const suggestedPrice = course.numberOfDays * course.timeHours * 100;
        user_Product_form.setValue("price", suggestedPrice, { shouldValidate: true });
        user_Product_form.setValue("real_price", Math.round(suggestedPrice * 0.9), { shouldValidate: true });
      }
      toast.success(`已選擇課程：${course.title}`);
    },
    [user_Product_form, initialCourse, initialCourseDates]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (files.length !== e.target.files?.length) {
      toast.error("部分圖片無效或超過 5MB");
      return;
    }

    setSelectedImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return previews;
    });
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    const fetchCourseListsData = async () => {
      try {
        const response = await fetch("/api/Course/Get_Course_Lists");
        if (!response.ok) throw new Error(`API 錯誤: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);

        interface ApiCourse {
          id: string;
          title: string;
          description: string;
          courseCode: string;
          schoolName: string;
          startDate: string | null;
          endDate: string | null;
          weekday: string | null;
          classroom: string | null;
          numberOfDays: number;
          timeHours: number;
          isPublic: boolean;
          isProduct: boolean;
          teacherId: string;
          numberOfStudents?: number | null;
          maxStudents?: number | null;
          Producted?: boolean;
          courseDates?: string[];
          courseTimeRanges?: {
            id: string;
            timeRange: string;
            starttime: string | null;
            endtime: string | null;
          }[];
          type?: string[];
          teacher?: string[];
          courseModulId?: string | null;
          createdAt?: string | Date;
          updatedAt?: string | Date;
          Students?: string[];
        }

        const courseData: Course[] = Array.isArray(data)
          ? data.map((course: ApiCourse) => ({
              id: course.id,
              title: course.title,
              description: course.description,
              courseCode: course.courseCode,
              schoolName: course.schoolName,
              startDate: course.startDate,
              endDate: course.endDate,
              weekday: course.weekday,
              classroom: course.classroom,
              numberOfDays: course.numberOfDays,
              timeHours: course.timeHours,
              isPublic: course.isPublic,
              isProduct: course.isProduct,
              teacherId: course.teacherId,
              numberOfStudents: course.numberOfStudents ?? null,
              maxStudents: course.maxStudents ?? null,
              Producted: course.Producted ?? false,
              courseDates: course.courseDates ?? [],
              courseTimeRanges: course.courseTimeRanges ?? [],
              type: course.type ?? [],
              teacher: course.teacher ?? [],
              courseModulId: course.courseModulId ?? null,
              createdAt: course.createdAt ? new Date(course.createdAt) : new Date(),
              updatedAt: course.updatedAt ? new Date(course.updatedAt) : new Date(),
              Students: course.Students ?? [],
            }))
          : [];
        setGetCourseListsData(courseData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "無法獲取課程數據";
        toast.error(errorMessage);
      }
    };

    const fetchTypeListsData = async () => {
      try {
        const response = await fetch("/api/Type/Get_Type_Lists");
        if (!response.ok) throw new Error(`API 錯誤: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetTypeData(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "無法獲取類型數據";
        toast.error(errorMessage);
      }
    };

    const fetchStatueListsData = async () => {
      try {
        const response = await fetch("/api/Status/Get_Status_Lists");
        if (!response.ok) throw new Error(`API 錯誤: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setGetStatueDadta(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "無法獲取狀態數據";
        toast.error(errorMessage);
      }
    };

    fetchCourseListsData();
    fetchTypeListsData();
    fetchStatueListsData();
  }, []);

  useEffect(() => {
    if (initialCourse && !selectedCourseId) {
      handleCourseSelect(initialCourse);
    } else if (!initialCourse && GetCourseListsData.length > 0 && !selectedCourseId) {
      const firstSelectable = GetCourseListsData.find((course) => !course.Producted);
      if (firstSelectable) {
        handleCourseSelect(firstSelectable);
      } else {
        toast.info("無可選課程，請先創建課程");
      }
    }
  }, [initialCourse, selectedCourseId, GetCourseListsData, handleCourseSelect]);

  const user_Product_form_onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!selectedCourseId) {
      toast.error("請選擇一個課程");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("real_price", values.real_price.toString());
    formData.append("IsPublic", values.IsPublic.toString());
    formData.append("CourseProductTypeArray", JSON.stringify(values.CourseProductTypeArray || []));
    formData.append("CourseProductStatusArray", JSON.stringify(values.CourseProductStatusArray || []));
    if (values.courseId) formData.append("courseId", values.courseId);
    if (values.Target_Audience) formData.append("Target_Audience", values.Target_Audience);
    if (values.Course_Objective) formData.append("Course_Objective", values.Course_Objective);
    if (values.Applicable_Scenarios) formData.append("Applicable_Scenarios", values.Applicable_Scenarios);
    formData.append("courseDates", JSON.stringify(values.courseDates || []));
    formData.append("courseTimeRanges", JSON.stringify(values.courseTimeRanges || []));
    if (values.videoUrls) formData.append("videoUrls", values.videoUrls);
    selectedImages.forEach((file) => formData.append("images", file));

    startTransition(async () => {
      try {
        const result = await CreateProductAction(formData);
        if (result.error) {
          user_Product_form.setError("root", { type: "manual", message: result.error });
          toast.error(result.error);
        } else {
          toast.success("產品創建成功");
          if (initialCourse) {
            window.dispatchEvent(new CustomEvent("productCreated", { detail: result.data }));
          } else {
            router.push("/admin/ProductLists");
          }
          setSelectedImages([]);
          setImagePreviews([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "提交失敗";
        user_Product_form.setError("root", { type: "manual", message: errorMessage });
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* 進度條 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {i < steps.length - 1 && <div className="w-16 h-1 bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-2 text-center">
          步驟 {currentStep} / {steps.length}：{currentStepConfig.name}
        </p>
      </div>

      <Form {...user_Product_form}>
        <form onSubmit={user_Product_form.handleSubmit(user_Product_form_onSubmit)} className="space-y-6">
          {/* === 步驟內容 === */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={user_Product_form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>標題</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!initialCourse} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={user_Product_form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={!!initialCourse} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={user_Product_form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>原價格</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={user_Product_form.control}
                name="real_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>實際價格</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={user_Product_form.control}
                name="IsPublic"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>是否公開</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={!!initialCourse} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-1 gap-6">
              {["Target_Audience", "Course_Objective", "Applicable_Scenarios"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={user_Product_form.control}
                  name={fieldName as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {fieldName === "Target_Audience" ? "目標觀眾" :
                         fieldName === "Course_Objective" ? "課程目標" : "可適用場景"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={typeof field.value === "string" ? field.value : ""}
                          disabled={isPending}
                          placeholder={`輸入${fieldName === "Target_Audience" ? "目標觀眾" : fieldName === "Course_Objective" ? "課程目標" : "可適用場景"}`}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <FormItem>
                <FormLabel>上傳圖片</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={isPending} />
                </FormControl>
              </FormItem>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((src, i) => (
                    <Image key={i} src={src} alt={`預覽 ${i + 1}`} width={150} height={100} className="rounded object-cover" unoptimized />
                  ))}
                </div>
              )}
              <FormField
                control={user_Product_form.control}
                name="videoUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>影片網址</FormLabel>
                    <FormControl>
                      <Input type="url" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <FormLabel>產品類型</FormLabel>
                <div className="mt-2 space-y-2">
                  {GetTypeData.map((t) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={user_Product_form.watch("CourseProductTypeArray")?.includes(t.id)}
                        onCheckedChange={(checked) => {
                          const arr = user_Product_form.getValues("CourseProductTypeArray") || [];
                          user_Product_form.setValue(
                            "CourseProductTypeArray",
                            checked ? [...arr, t.id] : arr.filter((id) => id !== t.id)
                          );
                        }}
                      />
                      <Label>{t.typename}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <FormLabel>產品狀態</FormLabel>
                <div className="mt-2 space-y-2">
                  {GetStatueDadta.map((s) => (
                    <div key={s.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={user_Product_form.watch("CourseProductStatusArray")?.includes(s.id)}
                        onCheckedChange={(checked) => {
                          const arr = user_Product_form.getValues("CourseProductStatusArray") || [];
                          user_Product_form.setValue(
                            "CourseProductStatusArray",
                            checked ? [...arr, s.id] : arr.filter((id) => id !== s.id)
                          );
                        }}
                      />
                      <Label>{s.statuename}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">請確認所有資訊</h3>
              <div className="space-y-2 text-sm">
                <p><strong>標題：</strong>{user_Product_form.getValues("title")}</p>
                <p><strong>價格：</strong>HK${user_Product_form.getValues("real_price")}</p>
                <p><strong>圖片：</strong>{selectedImages.length} 張</p>
                <p><strong>影片：</strong>{user_Product_form.getValues("videoUrls") ? "已填寫" : "未填寫"}</p>
              </div>
            </div>
          )}

          {/* 按鈕 */}
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={prev} disabled={currentStep === 1 || isPending}>
              <ChevronLeft className="w-4 h-4 mr-1" /> 上一步
            </Button>
            {currentStep === steps.length ? (
              <Button type="submit" disabled={isPending}>
                {isPending ? "提交中..." : "確認創建"}
              </Button>
            ) : (
              <Button type="button" onClick={next}>
                下一步 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Create_Product_Form;