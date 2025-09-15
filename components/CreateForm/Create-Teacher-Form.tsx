// "use client";

// import { CreateUserSchema } from "@/app/actions/Create/Create_user/schema";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { useRouter } from "next/navigation";

// const Create_Teacher_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();

//   const teacher_create_form = useForm<z.infer<typeof CreateUserSchema>>({
//     resolver: zodResolver(CreateUserSchema),
//     defaultValues: {
//       username: "",
//       password: "",
//       phone: "",
//       name: "",
//       role: "TEACHER",
//     },
//   });

//   const teacher_create_form_onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
//     console.log("-- 用户输入数据 -- :", values, "-- 结束 --");

//     startTransition(async () => {
//       try {
//         const response = await fetch("/api/user/create", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(values),
//         });

//         const result = await response.json();

//         if (response.ok && !result.error) {
//           router.push("/admin/TeacherLists");
//         } else {
//           console.error("提交失敗:", result.error);
//           teacher_create_form.setError("root", {
//             type: "manual",
//             message: result.error || "提交失敗，請重試",
//           });
//         }
//       } catch (error) {
//         console.error("提交時發生錯誤:", error);
//         teacher_create_form.setError("root", {
//           type: "manual",
//           message: "提交失敗，請重試",
//         });
//       }
//     });
//   };

//   console.log("-- BUG -- : ", teacher_create_form.formState.errors, " -- END -- ");

//   return (
//     <Form {...teacher_create_form}>
//       <form onSubmit={teacher_create_form.handleSubmit(teacher_create_form_onSubmit)}>
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={teacher_create_form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>用戶名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入用戶名稱"
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
//             control={teacher_create_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>姓名</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     value={field.value ?? ""}
//                     onChange={(e) => field.onChange(e.target.value || null)}
//                     disabled={isPending}
//                     placeholder="輸入姓名（可選）"
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
//             control={teacher_create_form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>密碼</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入密碼"
//                     type="password"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={teacher_create_form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>電話</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     value={field.value ?? ""}
//                     onChange={(e) => field.onChange(e.target.value || null)}
//                     disabled={isPending}
//                     placeholder="輸入電話（可選）"
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* 隱藏 role 欄位，因為預設為 TEACHER */}
//         <input
//           type="hidden"
//           value="TEACHER"
//           {...teacher_create_form.register("role")}
//         />

//         {/* 顯示伺服器錯誤 */}
//         {teacher_create_form.formState.errors.root && (
//           <div className="text-red-500 text-sm mt-2">
//             {teacher_create_form.formState.errors.root.message}
//           </div>
//         )}

//         <Button type="submit" disabled={isPending}>
//           提交
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default Create_Teacher_Form;

"use client";

import { CreateUserSchema } from "@/app/actions/Create/Create_user/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Create_Teacher_Form = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const teacher_create_form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      name: "",
      role: "TEACHER",
    },
  });

  const teacher_create_form_onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
    console.log("-- 用户输入数据 -- :", values, "-- 结束 --");

    startTransition(async () => {
      try {
        const response = await fetch("/api/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (response.ok && !result.error) {
          router.push("/admin/TeacherLists");
        } else {
          console.error("提交失敗:", result.error);
          teacher_create_form.setError("root", {
            type: "manual",
            message: result.error || "提交失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        teacher_create_form.setError("root", {
          type: "manual",
          message: "提交失敗，請重試",
        });
      }
    });
  };

  console.log("-- BUG -- : ", teacher_create_form.formState.errors, " -- END -- ");

  return (
    <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
      <Link href="/admin/TeacherLists" className="text-white" >
        返回
      </Link>
      <Form {...teacher_create_form}>
        <form onSubmit={teacher_create_form.handleSubmit(teacher_create_form_onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={teacher_create_form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">用戶名稱</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入用戶名稱"
                      type="text"
                      className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_create_form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">姓名</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      disabled={isPending}
                      placeholder="輸入姓名（可選）"
                      type="text"
                      className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_create_form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">密碼</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入密碼"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={teacher_create_form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">電話</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      disabled={isPending}
                      placeholder="輸入電話（可選）"
                      type="text"
                      className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* 隱藏 role 欄位，因為預設為 TEACHER */}
          <input
            type="hidden"
            value="TEACHER"
            {...teacher_create_form.register("role")}
          />

          {/* 顯示伺服器錯誤 */}
          {teacher_create_form.formState.errors.root && (
            <div className="bg-red-600 text-white px-3 py-2 rounded-md">
              {teacher_create_form.formState.errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 text-white"
          >
            {isPending ? "正在提交..." : "提交"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Create_Teacher_Form;