
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
// import { useForm } from "react-hook-form";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { CreateProductSchema } from "@/app/actions/Create/Create_Product/schema";
// import { CreateProductAction } from "@/app/actions/Create/Create_Product";
// import { Switch } from "@/components/ui/switch";
// import { useRouter } from "next/navigation";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// // 定義課程物件的型別，根據 Prisma 的 Course model
// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   Coursedates: string[];
//   teacher: string[];
//   teacherId: string;
//   createdAt: string;
//   updatedAt: string;
//   isPublic: boolean; // 確保包含 isPublic
// }

// // 定義表單的輸入類型，與 CreateProductSchema 一致
// interface FormValues {
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   IsPublic: boolean;
//   CourseProductTypeArray: string[];
//   CourseProductStatusArray: string[];
//   courseId: string | null;
// }

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

// const Create_Product_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const [GetCourseListsData, setGetCourseListsData] = useState<Course[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
//   const [GetTypeData, setGetTypeData] = useState<CourseProductType[]>([]);
//   const [GetStatueDadta, setGetStatueDadta] = useState<CourseProductStatus[]>([]);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
//   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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
//         setGetCourseListsData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "無法獲取課程數據");
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
//         console.log("Type Data:", data);
//         setGetTypeData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "無法獲取類型數據");
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
//         console.log("Status Data:", data);
//         setGetStatueDadta(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "無法獲取狀態數據");
//       }
//     };

//     fetchCourseListsData();
//     fetchTypeListsData();
//     fetchStatueListsData();
//   }, []);

//   console.log("GetCourseListsData : ", GetCourseListsData, "-- End --");

//   const user_Product_form = useForm<FormValues>({
//     resolver: zodResolver(CreateProductSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       price: 0,
//       real_price: 0,
//       IsPublic: false,
//       CourseProductTypeArray: [],
//       CourseProductStatusArray: [],
//       courseId: null,
//     },
//   });

//   const handleCourseSelect = (course: Course) => {
//     if (course.isPublic) {
//       setSelectedCourseId(course.id);
//       user_Product_form.setValue("title", course.title);
//       user_Product_form.setValue("description", course.description);
//       user_Product_form.setValue("courseId", course.id);
//     }
//   };

//   useEffect(() => {
//     user_Product_form.setValue("CourseProductTypeArray", selectedTypes);
//     user_Product_form.setValue("CourseProductStatusArray", selectedStatuses);
//   }, [selectedTypes, selectedStatuses, user_Product_form]);

//   const user_Product_form_onSubmit = (values: FormValues) => {
//     console.log(
//       "-- 商品輸入數據 -- :",
//       values,
//       "-- price type -- :",
//       typeof values.price,
//       "-- CourseProductTypeArray -- :",
//       values.CourseProductTypeArray,
//       "-- CourseProductStatusArray -- :",
//       values.CourseProductStatusArray,
//       "-- 結束 --"
//     );
//     startTransition(async () => {
//       try {
//         const result = await CreateProductAction(values);
//         console.log("-- 服務端響應 -- :", result, "-- 結束 --");
//         if (!result.error) {
//           router.push(`/admin/ProductLists`);
//         } else {
//           user_Product_form.setError("root", {
//             type: "manual",
//             message: result.error || "提交失敗，請重試",
//           });
//         }
//       } catch (error) {
//         console.error("提交時發生錯誤:", error);
//         user_Product_form.setError("root", {
//           type: "manual",
//           message: "提交失敗，請重試",
//         });
//       }
//     });
//   };

//   console.log("-- 產品表單狀態 -- :", user_Product_form.formState.errors, "-- 結束 --");

//   // 將課程分為公開和私有
//   const publicCourses = GetCourseListsData.filter((course) => course.isPublic);
//   const privateCourses = GetCourseListsData.filter((course) => !course.isPublic);

//   return (


//     <div className="container mx-auto p-4 flex gap-6">
//       {/* 左邊課程列表 */}
//       <div className="w-1/3">
//         <h2 className="text-xl font-semibold mb-4">選擇課程</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         <div className="flex gap-4">
//           {/* 私有課程區域（左邊） */}
//           <div className="w-1/2">
//             <h3 className="text-lg font-medium mb-2">私有課程（不可選）</h3>
//             {privateCourses.length > 0 ? (
//               <div className="grid gap-2">
//                 {privateCourses.map((course) => (
//                   <div
//                     key={course.id}
//                     className="p-3 border rounded bg-gray-200 cursor-not-allowed"
//                   >
//                     <h3 className="font-medium">{course.title}</h3>
//                     <p className="text-sm text-gray-600">{course.description}</p>
//                     <p className="text-sm text-gray-500">課程代碼: {course.courseCode}</p>
//                     <p className="text-sm text-gray-500">學校: {course.schoolName}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-gray-500">無私有課程</div>
//             )}
//           </div>

//           {/* 公開課程區域（右邊） */}
//           <div className="w-1/2">
//             <h3 className="text-lg font-medium mb-2">公開課程（可選）</h3>
//             {publicCourses.length > 0 ? (
//               <div className="grid gap-2">
//                 {publicCourses.map((course) => (
//                   <div
//                     key={course.id}
//                     className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
//                       selectedCourseId === course.id ? "bg-blue-100 border-blue-500" : ""
//                     }`}
//                     onClick={() => handleCourseSelect(course)}
//                   >
//                     <h3 className="font-medium">{course.title}</h3>
//                     <p className="text-sm text-gray-600">{course.description}</p>
//                     <p className="text-sm text-gray-500">課程代碼: {course.courseCode}</p>
//                     <p className="text-sm text-gray-500">學校: {course.schoolName}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-gray-500">無公開課程</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 右邊表單 */}
//       <div className="w-2/3">
//         <h1 className="text-2xl font-bold mb-4">創建產品</h1>
//         <Form {...user_Product_form}>
//           <form onSubmit={user_Product_form.handleSubmit(user_Product_form_onSubmit)} className="space-y-4">
//             <FormField
//               control={user_Product_form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>標題</FormLabel>
//                   <FormControl>
//                     <Input {...field} disabled={isPending} placeholder="標題" type="text" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={user_Product_form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>描述</FormLabel>
//                   <FormControl>
//                     <Input {...field} disabled={isPending} placeholder="描述" type="text" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={user_Product_form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>原價格</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="價格"
//                       type="number"
//                       min="0"
//                       step="1"
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                       value={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={user_Product_form.control}
//               name="real_price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>想人給的價格</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="家人們！！！"
//                       type="number"
//                       min="0"
//                       step="1"
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                       value={field.value}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={user_Product_form.control}
//               name="IsPublic"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>是否公開</FormLabel>
//                   <FormControl>
//                     <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={user_Product_form.control}
//               name="CourseProductTypeArray"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>產品類型</FormLabel>
//                   <div className="grid gap-2">
//                     {GetTypeData.map((type) => (
//                       <div key={type.id} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={type.id}
//                           checked={selectedTypes.includes(type.typename)}
//                           onCheckedChange={(checked) => {
//                             setSelectedTypes((prev) =>
//                               checked
//                                 ?([...prev, type.typename])
//                                 : prev.filter((t) => t !== type.typename)
//                             );
//                           }}
//                           disabled={isPending}
//                         />
//                         <Label htmlFor={type.id}>{type.typename}</Label>
//                       </div>
//                     ))}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={user_Product_form.control}
//               name="CourseProductStatusArray"
//               render={() => (
//                 <FormItem>
//                   <FormLabel>產品狀態</FormLabel>
//                   <div className="grid gap-2">
//                     {GetStatueDadta.map((status) => (
//                       <div key={status.id} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={status.id}
//                           checked={selectedStatuses.includes(status.statuename)}
//                           onCheckedChange={(checked) => {
//                             setSelectedStatuses((prev) =>
//                               checked
//                                 ?([...prev, status.statuename])
//                                 : prev.filter((s) => s !== status.statuename)
//                             );
//                           }}
//                           disabled={isPending}
//                         />
//                         <Label htmlFor={status.id}>{status.statuename}</Label>
//                       </div>
//                     ))}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

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

//             <Button type="submit" disabled={isPending}>
//               提交
//             </Button>
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
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CreateProductSchema } from "@/app/actions/Create/Create_Product/schema";
import { CreateProductAction } from "@/app/actions/Create/Create_Product";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  Coursedates: string[];
  teacher: string[];
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isProductItem: boolean; //暫時不用
  isProduct: boolean;
  Producted: boolean;
}

interface FormValues {
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  CourseProductTypeArray: string[];
  CourseProductStatusArray: string[];
  courseId: string | null;
}

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

const Create_Product_Form = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [GetCourseListsData, setGetCourseListsData] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [GetTypeData, setGetTypeData] = useState<CourseProductType[]>([]);
  const [GetStatueDadta, setGetStatueDadta] = useState<CourseProductStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourseListsData = async () => {
      try {
        const response = await fetch("/api/Course/Get_Course_Lists");
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetCourseListsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取課程數據");
      }
    };

    const fetchTypeListsData = async () => {
      try {
        const response = await fetch("/api/Type/Get_Type_Lists");
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Type Data:", data);
        setGetTypeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取類型數據");
      }
    };

    const fetchStatueListsData = async () => {
      try {
        const response = await fetch("/api/Status/Get_Status_Lists");
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Status Data:", data);
        setGetStatueDadta(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取狀態數據");
      }
    };

    fetchCourseListsData();
    fetchTypeListsData();
    fetchStatueListsData();
  }, []);

  console.log("GetCourseListsData : ", GetCourseListsData, "-- End --");

  const user_Product_form = useForm<FormValues>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      real_price: 0,
      IsPublic: false,
      CourseProductTypeArray: [],
      CourseProductStatusArray: [],
      courseId: null,
    },
  });

  const handleCourseSelect = (course: Course) => {
    setSelectedCourseId(course.id);
    user_Product_form.setValue("title", course.title);
    user_Product_form.setValue("description", course.description);
    user_Product_form.setValue("courseId", course.id);
    user_Product_form.setValue("IsPublic", course.isPublic); // 同步課程的 isPublic
  };

  useEffect(() => {
    user_Product_form.setValue("CourseProductTypeArray", selectedTypes);
    user_Product_form.setValue("CourseProductStatusArray", selectedStatuses);
  }, [selectedTypes, selectedStatuses, user_Product_form]);

  const user_Product_form_onSubmit = (values: FormValues) => {
    console.log(
      "-- 商品輸入數據 -- :",
      values,
      "-- price type -- :",
      typeof values.price,
      "-- CourseProductTypeArray -- :",
      values.CourseProductTypeArray,
      "-- CourseProductStatusArray -- :",
      values.CourseProductStatusArray,
      "-- 結束 --"
    );
    startTransition(async () => {
      try {
        const result = await CreateProductAction(values);
        console.log("-- 服務端響應 -- :", result, "-- 結束 --");
        if (!result.error) {
          router.push(`/admin/ProductLists`);
        } else {
          user_Product_form.setError("root", {
            type: "manual",
            message: result.error || "提交失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        user_Product_form.setError("root", {
          type: "manual",
          message: "提交失敗，請重試",
        });
      }
    });
  };

  console.log("-- 產品表單狀態 -- :", user_Product_form.formState.errors, "-- 結束 --");

  const selectableCourses = GetCourseListsData.filter((course) => !course.Producted);
  const nonSelectableCourses = GetCourseListsData.filter((course) => course.Producted);

  return (
    <div className="container mx-auto p-4 flex gap-6">
      {/* 左邊課程列表 */}
      <div className="w-1/3">
        <h2 className="text-xl font-semibold mb-4">選擇課程</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex gap-4">
          {/* 不可選課程區域（左邊） */}
          <div className="w-1/2">
            <h3 className="text-lg font-medium mb-2">不可選課程（已為產品）</h3>
            {nonSelectableCourses.length > 0 ? (
              <div className="grid gap-2">
                {nonSelectableCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 border rounded bg-gray-200 cursor-not-allowed"
                  >
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <p className="text-sm text-gray-500">課程代碼: {course.courseCode}</p>
                    <p className="text-sm text-gray-500">學校: {course.schoolName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">無不可選課程</div>
            )}
          </div>

          {/* 可選課程區域（右邊） */}
          <div className="w-1/2">
            <h3 className="text-lg font-medium mb-2">可選課程（可轉為產品）</h3>
            {selectableCourses.length > 0 ? (
              <div className="grid gap-2">
                {selectableCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
                      selectedCourseId === course.id ? "bg-blue-100 border-blue-500" : ""
                    }`}
                    onClick={() => handleCourseSelect(course)}
                  >
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.description}</p>
                    <p className="text-sm text-gray-500">課程代碼: {course.courseCode}</p>
                    <p className="text-sm text-gray-500">學校: {course.schoolName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">無可選課程</div>
            )}
          </div>
        </div>
      </div>

      {/* 右邊表單 */}
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-4">創建產品</h1>
        <Form {...user_Product_form}>
          <form onSubmit={user_Product_form.handleSubmit(user_Product_form_onSubmit)} className="space-y-4">
            <FormField
              control={user_Product_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="描述" type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>原價格</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="價格"
                      type="number"
                      min="0"
                      step="1"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
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
                  <FormLabel>想人給的價格</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="家人們！！！"
                      type="number"
                      min="0"
                      step="1"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
  control={user_Product_form.control}
  name="IsPublic"
  render={({ field }) => (
    <FormItem>
      <FormLabel>是否公開</FormLabel>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={isPending}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

            <FormField
              control={user_Product_form.control}
              name="CourseProductTypeArray"
              render={() => (
                <FormItem>
                  <FormLabel>產品類型</FormLabel>
                  <div className="grid gap-2">
                    {GetTypeData.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.id}
                          checked={selectedTypes.includes(type.typename)}
                          onCheckedChange={(checked) => {
                            setSelectedTypes((prev) =>
                              checked
                                ?([...prev, type.typename])
                                : prev.filter((t) => t !== type.typename)
                            );
                          }}
                          disabled={isPending}
                        />
                        <Label htmlFor={type.id}>{type.typename}</Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="CourseProductStatusArray"
              render={() => (
                <FormItem>
                  <FormLabel>產品狀態</FormLabel>
                  <div className="grid gap-2">
                    {GetStatueDadta.map((status) => (
                      <div key={status.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={status.id}
                          checked={selectedStatuses.includes(status.statuename)}
                          onCheckedChange={(checked) => {
                            setSelectedStatuses((prev) =>
                              checked
                                ?([...prev, status.statuename])
                                : prev.filter((s) => s !== status.statuename)
                            );
                          }}
                          disabled={isPending}
                        />
                        <Label htmlFor={status.id}>{status.statuename}</Label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={user_Product_form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem hidden>
                  <FormControl>
                    <Input {...field} value={field.value || ""} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              提交
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Create_Product_Form;