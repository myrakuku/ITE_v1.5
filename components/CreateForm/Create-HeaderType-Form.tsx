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
import { CreateHeaderTypeAction } from "@/app/actions/Create/Create_HeaderType";
import { CreateHeaderTypeSchema } from "@/app/actions/Create/Create_HeaderType/schema";

const CreateHeaderTypeForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const headertype_form = useForm<z.infer<typeof CreateHeaderTypeSchema>>({
    resolver: zodResolver(CreateHeaderTypeSchema),
    defaultValues: {
      HeaderTypeName: "",
    },
  });

  const headertype_form_onSubmit = (values: z.infer<typeof CreateHeaderTypeSchema>) => {
    console.log("-- 關鍵字輸入數據 -- :", values, "-- 結束 --");
    startTransition(async () => {
      try {
        const result = await CreateHeaderTypeAction(values);
        if (!result.error) {
          headertype_form.reset();
          router.push("/admin/HeaderTypeLists");
        } else {
          headertype_form.setError("root", {
            type: "manual",
            message: result.error || "創建關鍵字失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        headertype_form.setError("root", {
          type: "manual",
          message: "創建關鍵字失敗，請重試",
        });
      }
    });
  };

  return (
    <Form {...headertype_form}>
      <form onSubmit={headertype_form.handleSubmit(headertype_form_onSubmit)} className="space-y-6">
        {headertype_form.formState.errors.root && (
          <div className="text-red-500 text-sm">{headertype_form.formState.errors.root.message}</div>
        )}
        <FormField
          control={headertype_form.control}
          name="HeaderTypeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">關鍵字名稱</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isPending}
                  placeholder="輸入關鍵字名稱"
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

export default CreateHeaderTypeForm;