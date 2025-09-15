// // app/components/CreateUserForm.tsx
// 'use client'

// import { CreateUserSchema } from '@/app/actions/Create/Create_user/schema'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useTransition } from 'react'
// import { useForm } from 'react-hook-form'
// import * as z from 'zod'
// import { Button } from '../ui/button'
// import { Input } from '../ui/input'
// import { CreateUserAction } from '@/app/actions/Create/Create_user'

// const CreateUserForm = () => {
//   const [isPending, startTransition] = useTransition()

//   const user_create_form = useForm<z.infer<typeof CreateUserSchema>>({
//     resolver: zodResolver(CreateUserSchema),
//     defaultValues: {
//       username: '',
//       password: '',
//       phone: '',
//       name: '',
//       role: 'USER',
//     },
//   })

//   const user_create_form_onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
//     console.log('-- 用户输入数据 -- :', values, '-- 结束 --')
//     startTransition(async () => {
//       const result = await CreateUserAction(values)
//       if (!result.data) {
//         user_create_form.setError('root', { message: result.error || '創建用戶失敗' })
//       } else {
//         user_create_form.reset()
//         // 可選：顯示成功訊息或重定向
//         alert('用戶創建成功！')
//         // window.location.href = '/users'
//       }
//     })
//   }

//   return (
//     <Form {...user_create_form}>
//       <form onSubmit={user_create_form.handleSubmit(user_create_form_onSubmit)} className="space-y-6">
//         {user_create_form.formState.errors.root && (
//           <div className="text-red-500 text-sm">{user_create_form.formState.errors.root.message}</div>
//         )}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={user_create_form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>用戶名稱</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     disabled={isPending}
//                     placeholder="輸入名稱"
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={user_create_form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>姓名</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     value={field.value ?? ''} // 將 null 轉為空字符串
//                     disabled={isPending}
//                     placeholder="輸入姓名"
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={user_create_form.control}
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
//           <FormField
//             control={user_create_form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>電話</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     value={field.value ?? ''} // 將 null 轉為空字符串
//                     disabled={isPending}
//                     placeholder="輸入電話"
//                     type="text"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit" disabled={isPending}>
//           提交
//         </Button>
//       </form>
//     </Form>
//   )
// }

// export default CreateUserForm


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
import { CreateUserAction } from "@/app/actions/Create/Create_user";
import { useRouter } from "next/navigation";

const CreateUserForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); 


  const user_create_form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      name: "",
      role: "USER",
    },
  });

  const user_create_form_onSubmit = async (values: z.infer<typeof CreateUserSchema>) => {
    console.log("-- 用户输入数据 -- :", values, "-- 结束 --");
    startTransition(async () => {
      
      // if (!result.data) {
      //   user_create_form.setError("root", { message: result.error || "創建用戶失敗" });
      // } else {
      //   user_create_form.reset();
      //   alert("用戶創建成功！");
        // 可選：重定向到用戶列表
        // window.location.href = "/admin/UserLists";
      // }


                  try {
                    const result = await CreateUserAction(values);
                    // 檢查是否有錯誤
                    if (!result.error) {
                      router.push(`/login`); // 無錯誤表示成功，導航
                    } else {
                      console.error("提交失敗:", result.error);
                      user_create_form.setError("root", {
                        type: "manual",
                        message: result.error || "提交失敗，請重試",
                      });
                    }
                  } catch (error) {
                    console.error("提交時發生錯誤:", error);
                    user_create_form.setError("root", {
                      type: "manual",
                      message: "提交失敗，請重試",
                    });
                  }
    });
  };

  return (
    <Form {...user_create_form}>
      <form onSubmit={user_create_form.handleSubmit(user_create_form_onSubmit)} className="space-y-6">
        {user_create_form.formState.errors.root && (
          <div className="text-red-500 text-sm">{user_create_form.formState.errors.root.message}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={user_create_form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">用戶名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入用戶名稱"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">姓名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                    placeholder="輸入姓名"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">密碼</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入密碼"
                    type="password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">電話</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                    placeholder="輸入電話"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={user_create_form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">角色</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isPending}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="USER">用戶</option>
                    <option value="TEACHER">教師</option>
                    <option value="ADMIN">管理員</option>
                  </select>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          {isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
              </svg>
              提交中...
            </span>
          ) : (
            "提交"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateUserForm;