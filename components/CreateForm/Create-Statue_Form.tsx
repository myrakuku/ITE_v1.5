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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CreateStatueAction } from "@/app/actions/Create/Create_statue";
import { CreateStatueSchema } from "@/app/actions/Create/Create_statue/schema";

const CreateStatueForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const statue_form = useForm<z.infer<typeof CreateStatueSchema>>({
    resolver: zodResolver(CreateStatueSchema),
    defaultValues: {
      statuename: "",
    },
  });

  const statue_form_onSubmit = (values: z.infer<typeof CreateStatueSchema>) => {
    console.log("-- 狀態輸入數據 -- :", values, "-- 結束 --");
    startTransition(async () => {
      try {
        const result = await CreateStatueAction(values);
        if (!result.error) {
          statue_form.reset();
          router.push("/admin/StatueLists");
        } else {
          statue_form.setError("root", {
            type: "manual",
            message: result.error || "創建狀態失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        statue_form.setError("root", {
          type: "manual",
          message: "創建狀態失敗，請重試",
        });
      }
    });
  };

  return (
    <Form {...statue_form}>
      <form onSubmit={statue_form.handleSubmit(statue_form_onSubmit)} className="space-y-6">
        {statue_form.formState.errors.root && (
          <div className="text-red-500 text-sm">{statue_form.formState.errors.root.message}</div>
        )}
        <FormField
          control={statue_form.control}
          name="statuename"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">狀態名稱</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入狀態名稱"
                  type="text"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-600 focus:border-blue-600"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
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

export default CreateStatueForm;