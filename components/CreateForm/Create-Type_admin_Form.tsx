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
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CreateTypeAction } from "@/app/actions/Create/Create_Type";
import { CreateSTypeSchema } from "@/app/actions/Create/Create_Type/schema";
import { useSession } from "next-auth/react";

interface GetTeacher {
  id: string;
  username: string;
  password: string;
  phone: string;
  name: string;
  role: string;
}

const CreateTypeForm_admin = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();
  const [getTeacherData, setGetTeacherData] = useState<GetTeacher | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id || "";
  const userRole = getTeacherData?.role || "";

  useEffect(() => {
    const fetchTeacherData = async (userId: string) => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user/Get_User_Lists_by_Id/${userId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setGetTeacherData(data);
      } catch {
        setError("無法獲取用戶數據");
      }
    };
    fetchTeacherData(userId);
  }, [userId]);

  const type_form = useForm<z.infer<typeof CreateSTypeSchema>>({
    resolver: zodResolver(CreateSTypeSchema),
    defaultValues: {
      typename: "",
      author: userRole,
      role: userRole,
    },
  });

  // 當 userRole 更新時，動態設置表單的 role 和 author
  useEffect(() => {
    if (userRole) {
      type_form.setValue("role", userRole);
      type_form.setValue("author", userRole);
    }
  }, [userRole, type_form]);

  const type_form_onSubmit = (values: z.infer<typeof CreateSTypeSchema>) => {
    console.log("-- 類型輸入數據 -- :", values, "-- 結束 --");
    startTransition(async () => {
      try {
        const result = await CreateTypeAction(values);
        if (!result.error) {
          type_form.reset();
          router.push("/admin/TypeLists");
        } else {
          type_form.setError("root", {
            type: "manual",
            message: result.error || "創建類型失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        type_form.setError("root", {
          type: "manual",
          message: "創建類型失敗，請重試",
        });
      }
    });
  };

  return (
    <Form {...type_form}>
      <form onSubmit={type_form.handleSubmit(type_form_onSubmit)} className="space-y-6">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {type_form.formState.errors.root && (
          <div className="text-red-500 text-sm">{type_form.formState.errors.root.message}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={type_form.control}
            name="typename"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">類型名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入類型名稱"
                    type="text"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={type_form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">作者</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    value={userRole}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                  />
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

export default CreateTypeForm_admin;