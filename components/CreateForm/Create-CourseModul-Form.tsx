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
        // 關鍵：\n 會被保留
        formData.append("description", values.description);
        formData.append("TeacherId", values.TeacherId);
        formData.append("originalFileName", values.originalFileName ?? "");
        formData.append("file", file);

        console.log("Submitting description (with \\n):", values.description);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
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

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    placeholder="輸入描述（支援換行）"
                    rows={4}
                    className="resize-none whitespace-pre-wrap" // 關鍵 CSS
                    style={{ whiteSpace: "pre-wrap" }} // 雙重保險
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "提交中..." : "提交"}
        </Button>
      </form>
    </Form>
  );
}