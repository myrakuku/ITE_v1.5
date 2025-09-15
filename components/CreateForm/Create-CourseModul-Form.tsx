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
// import { useState, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { CreateCourseModulSchema } from "@/app/actions/Create/Create_CourseModul/schema";
// import { CreateCourseModulAction } from "@/app/actions/Create/Create_CourseModul";
// import { Textarea } from "@/components/ui/textarea";
// import { useParams, useRouter } from "next/navigation";



// const Create_CourseModul_Form = () => {
//   const [isPending, startTransition] = useTransition();

//   const [fileBase64, setFileBase64] = useState<string>("");
//   const [originalFileName, setOriginalFileName] = useState<string>("");
//     const params = useParams();
//     console.log("params : ",  params)
//     const TeacherId = params.Teacherid as string;
//     const router = useRouter();


//   const user_CourseModul_form = useForm<z.infer<typeof CreateCourseModulSchema>>({
//     resolver: zodResolver(CreateCourseModulSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       TeacherId: TeacherId,
//       teaching_materials: "",
//       originalFileName: "",
//     },
//   });

//   // 文件處理函數
//   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   if (file) {
//   //     setOriginalFileName(file.name);
//   //     const reader = new FileReader();
//   //     reader.onload = (event) => {
//   //       const base64String = event.target?.result as string;
//   //       setFileBase64(base64String);
//   //       user_CourseModul_form.setValue("teaching_materials", base64String);
//   //       user_CourseModul_form.setValue("originalFileName", file.name);
//   //     };
//   //     reader.readAsDataURL(file);
//   //   }
//   // };


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     if (file.size > 10 * 1024 * 1024) { // 限制檔案大小為 10MB
//       user_CourseModul_form.setError("teaching_materials", {
//         message: "檔案大小不能超過 10MB",
//       });
//       return;
//     }
//     setOriginalFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const base64String = event.target?.result as string;
//       setFileBase64(base64String);
//       user_CourseModul_form.setValue("teaching_materials", base64String);
//       user_CourseModul_form.setValue("originalFileName", file.name);
//     };
//     reader.readAsDataURL(file);
//   }
// };

//   const user_CourseModul_form_onSubmit = (values: z.infer<typeof CreateCourseModulSchema>) => {
//     console.log("-- 課程模組输入数据 -- :", values, "-- 结束 --");
//     startTransition(async() => {
//       try{
//         const result = await CreateCourseModulAction(values);
//         if("error" in result) {
//           throw new Error(result.error || "申請接受失敗");
//         }
//         router.push(`/teacher/${TeacherId}/TeachingMaterialsLists`);

//       } catch(error){
//         const errorMessage = error instanceof Error ? error.message : "未知錯誤";
//         user_CourseModul_form.setError("root", {
//           message: `表單提交失敗: ${errorMessage}`,
//         });
//       }
      
//     });
//   };

//   console.log("-- BUG -- : ", user_CourseModul_form.formState.errors, " -- END -- ");

//   return (
//     <Form {...user_CourseModul_form}>
//       <form onSubmit={user_CourseModul_form.handleSubmit(user_CourseModul_form_onSubmit)}>
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={user_CourseModul_form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="Title"
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={user_CourseModul_form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     {...field}
//                     disabled={isPending}
//                     placeholder="Enter description"
//                     rows={4} // 可選：設置默認行數
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={user_CourseModul_form.control}
//             name="teaching_materials"
//             render={() => (
//               <FormItem>
//                 <FormLabel>教材</FormLabel>
//                 <FormControl>
//                   <Input
//                     disabled={isPending}
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".jpg,.png,.pdf,.rar,.zip"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {fileBase64 && (
//           <div className="text-sm text-gray-500">已選擇文件: {originalFileName}</div>
//         )}

//         <Button type="submit" disabled={isPending}>
//           提交
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default Create_CourseModul_Form;


// app/components/CreateForm/CreateCourseModulForm.tsx
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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCourseModulSchema } from "@/app/actions/Create/Create_CourseModul/schema";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";

export default function CreateCourseModulForm() {
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string>("");
  const params = useParams();
  const TeacherId = params.Teacherid as string;
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateCourseModulSchema>>({
    resolver: zodResolver(CreateCourseModulSchema),
    defaultValues: {
      title: "",
      description: "",
      TeacherId: TeacherId,
      teaching_materials: "",
      originalFileName: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        form.setError("teaching_materials", {
          message: "檔案大小不能超過 30MB",
        });
        return;
      }
      setFileName(file.name);
      form.setValue("originalFileName", file.name);
    }
  };

  const onSubmit = async (values: z.infer<typeof CreateCourseModulSchema>) => {
    startTransition(async () => {
      try {
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput.files?.[0];
        if (!file) {
          form.setError("teaching_materials", {
            message: "請選擇一個檔案",
          });
          return;
        }

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("TeacherId", values.TeacherId);
        formData.append("originalFileName", values.originalFileName ?? "");
        formData.append("file", file);

        console.log("Submitting form data:", {
          title: values.title,
          description: values.description,
          TeacherId: values.TeacherId,
          originalFileName: values.originalFileName,
          file: file.name,
        });

        const response = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
          console.error("API response error:", result);
          throw new Error(result.error || "檔案上傳失敗");
        }

        router.push(`/teacher/${TeacherId}/TeachingMaterialsLists`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "未知錯誤";
        form.setError("root", {
          message: `表單提交失敗: ${errorMessage}`,
        });
      }
    });
  };

return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} placeholder="輸入描述" rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="teaching_materials"
            render={() => (
              <FormItem>
                <FormLabel>教材</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.png,.pdf,.rar,.zip"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {fileName && <div className="text-sm text-gray-500">已選擇文件: {fileName}</div>}

        <Button type="submit" disabled={isPending}>
          提交
        </Button>
      </form>
    </Form>
  );
}