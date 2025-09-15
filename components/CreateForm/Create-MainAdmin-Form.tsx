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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const CreateAdminForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const Admin_create_form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      name: "",
      role: "ADMIN",
    },
  });

  const Admin_create_form_onSubmit = (values: z.infer<typeof CreateUserSchema>) => {
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
          router.push("/");
        } else {
          console.error("提交失敗:", result.error);
          Admin_create_form.setError("root", {
            type: "manual",
            message: result.error || "提交失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        Admin_create_form.setError("root", {
          type: "manual",
          message: "提交失敗，請重試",
        });
      }
    });
  };

  console.log("-- BUG -- : ", Admin_create_form.formState.errors, " -- END -- ");

  return (
    <Form {...Admin_create_form}>
      <form onSubmit={Admin_create_form.handleSubmit(Admin_create_form_onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={Admin_create_form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>用戶名稱</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入用戶名稱"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={Admin_create_form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入姓名（可選）"
                    type="text"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={Admin_create_form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密碼</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入密碼"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={Admin_create_form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電話</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="輸入電話（可選）"
                    type="text"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <input
          type="hidden"
          value="ADMIN"
          {...Admin_create_form.register("role")}
        />

        {/* 顯示伺服器錯誤 */}
        {Admin_create_form.formState.errors.root && (
          <div className="text-red-500 text-sm mt-2">
            {Admin_create_form.formState.errors.root.message}
          </div>
        )}

        <Button type="submit" disabled={isPending}>
          提交
        </Button>
      </form>
    </Form>
  );
};

export default CreateAdminForm;