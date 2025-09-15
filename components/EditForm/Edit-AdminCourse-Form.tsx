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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EditADminCourseSchema } from "@/app/actions/Edit/Edit_AdminCourse/schema";
import { EditAdminCourseAction } from "@/app/actions/Edit/Edit_AdminCourse";

interface Teacher {
  id: string;
  username: string;
  role: "TEACHER" | "USER" | "ADMIN";
}

const EditAdminCourseForm = () => {
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const form = useForm<z.infer<typeof EditADminCourseSchema>>({
    resolver: zodResolver(EditADminCourseSchema),
    defaultValues: {
      courseId,
      teacher: [],
      schoolName: "",
      classroom: undefined,
    },
  });

  // 獲取課程數據和教師列表（邏輯保持不變）
  useEffect(() => {
    const fetchCourseDataById = async () => {
      try {
        const res = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        form.reset({
          courseId,
          teacher: data.teacher || [],
          schoolName: data.schoolName || "",
          classroom: data.classroom || undefined,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入課程數據");
      }
    };

    fetchCourseDataById();
  }, [courseId, form]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/user/teacher/teacherLists");
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setTeachers(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入教師列表");
      }
    };

    fetchTeachers();
  }, []);

  const onSubmit = (values: z.infer<typeof EditADminCourseSchema>) => {
    startTransition(async () => {
      const result = await EditAdminCourseAction(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("課程更新成功");
        router.push(`/admin/CourseLists/`);
      }
    });
  };

  console.log("bug : ", form.formState.errors, "-- End --");
  console.log("teachers : ", teachers, "-- End --");

  return (
    <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">學校名稱</FormLabel>
                <FormControl>
                  <Input
                    placeholder="輸入學校名稱"
                    {...field}
                    disabled={isPending}
                    className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="classroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">課室</FormLabel>
                <FormControl>
                  <Input
                    placeholder="輸入課室"
                    {...field}
                    value={field.value ?? ""}
                    disabled={isPending}
                    className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">教師</FormLabel>
                <div className="space-y-2">
                  {teachers
                    .filter((teacher) => teacher.role === "TEACHER")
                    .map((teacher) => (
                      <FormItem
                        key={teacher.id}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value.includes(teacher.id)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, teacher.id]
                                : field.value.filter((id) => id !== teacher.id);
                              field.onChange(newValue);
                            }}
                            disabled={isPending}
                            className="border-gray-600"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium text-white">
                          {teacher.username}
                        </FormLabel>
                      </FormItem>
                    ))}
                </div>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

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

export default EditAdminCourseForm;