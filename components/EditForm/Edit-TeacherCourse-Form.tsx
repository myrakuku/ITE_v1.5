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
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "@/components/ui/switch";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "../ui/textarea";
import { toast } from "react-toastify";
import { EditCourseTeacherSchema } from "@/app/actions/Edit/Edit_CourseTeacher/schema";
import { EditCourseTeacherAction } from "@/app/actions/Edit/Edit_CourseTeacher";

interface CourseType {
  id: string;
  typename: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  TeacherId: string; // 新增 TeacherId
}

interface Teacher {
  name: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  Producted: boolean;
  type: string[];
  courseModuleId: string | null;
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[];
  classroom: string | null;
  weekday: string | null;
  CourseTimeRanges: {
    id: string;
    timeRange: string;
    starttime: string | null;
    endtime: string | null;
  }[];
}

const timeOptions = [
  { id: "morning" as const, label: "上午" },
  { id: "afternoon" as const, label: "下午" },
  { id: "evening" as const, label: "晚上" },
  // { id: "full_day" as const, label: "全日" },
] as const;

const EditCourseTeacherForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.Teacherid as string;
  const courseId = params.CourseId as string;
  const [filteredCourseModules, setFilteredCourseModules] = useState<CourseModule[]>([]); // 新增狀態
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);

  const form = useForm<z.infer<typeof EditCourseTeacherSchema>>({
    resolver: zodResolver(EditCourseTeacherSchema),
    mode: "onChange",
    defaultValues: {
      courseId, // 添加 courseId
      title: "",
      description: "",
      courseCode: "",
      schoolName: "",
      numberOfDays: 0,
      courseModuleId: null,
      timeHours: 0,
      teacher: [],
      isPublic: false,
      isProduct: false,
      timeRanges: [],
      type: [],
      teacherId,
      startDate: null,
      endDate: null,
      courseDates: [],
      weekday: null,
      classroom: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "timeRanges",
  });

  // 獲取課程數據並設置表單初始值
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const res = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
        if (!res.ok) {
          throw new Error(`無法獲取課程數據: ${res.status} ${res.statusText}`);
        }
        const data: CourseData = await res.json();
        console.log("Fetched courseData:", data);
        setCourseData(data);

        // 設置表單初始值
        form.reset({
          courseId: data.id, // 使用 API 返回的 id 作為 courseId
          title: data.title,
          description: data.description,
          courseCode: data.courseCode,
          schoolName: data.schoolName,
          numberOfDays: data.numberOfDays,
          timeHours: data.timeHours,
          teacher: data.teacher,
          isPublic: data.isPublic,
          isProduct: data.isProduct,
          type: data.type,
          courseModuleId: data.courseModuleId ?? null,
          teacherId: data.teacherId,
          startDate: data.startDate ?? null,
          endDate: data.endDate ?? null,
          courseDates: data.Coursedates ?? [],
          classroom: data.classroom ?? null,
          weekday: data.weekday ?? null,
          timeRanges: data.CourseTimeRanges?.map((range) => ({
            timeRange: range.timeRange as "morning" | "afternoon" | "evening" | "full_day",
            starttime: range.starttime ?? null,
            endtime: range.endtime ?? null,
          })) ?? [],
        });
      } catch (error) {
        console.error("Fetch course data error:", error);
        toast.error(error instanceof Error ? error.message : "無法載入課程數據");
      }
    };

    fetchCourseData();
  }, [courseId, form]);

  // 驗證 teacherId
  useEffect(() => {
    if (!teacherId) {
      toast.error("無效的教師 ID");
      router.push("/teachers");
    }
  }, [teacherId, router]);

  // 監聽 courseModuleId 的變化，動態設置 description
  const selectedCourseModuleId = form.watch("courseModuleId");
  useEffect(() => {
    if (selectedCourseModuleId && selectedCourseModuleId !== "none") {
      const selectedModule = courseModules.find(
        (module) => module.id === selectedCourseModuleId
      );
      if (selectedModule) {
        form.setValue("description", selectedModule.description);
      }
    } else if (courseData) {
      form.setValue("description", courseData.description);
    }
  }, [selectedCourseModuleId, courseModules, form, courseData]);

  // 設置 teacher 字段的默認值
  useEffect(() => {
    if (teacherData?.name) {
      form.setValue("teacher", [teacherData.name]);
    }
  }, [teacherData, form]);

  // 獲取課程類型、模組和教師數據
  useEffect(() => {
    const fetchTypesData = async () => {
      try {
        const res = await fetch("/api/Type/Get_Type_Lists");
        if (!res.ok) {
          throw new Error(`無法獲取課程類型: ${res.status}`);
        }
        const data: CourseType[] = await res.json();
        setCourseTypes(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入課程類型");
        setCourseTypes([]);
      }
    };

    const fetchCourseModules = async () => {
      try {
        const res = await fetch("/api/Course/Get_CourseModul_Lists");
        if (!res.ok) {
          throw new Error(`無法獲取課程模組: ${res.status}`);
        }
        const data: CourseModule[] = await res.json();
        setCourseModules(data);

                // 篩選出 TeacherId 與 teacherId 匹配的模組
        const filtered = data.filter((module) => module.TeacherId === teacherId);
        setFilteredCourseModules(filtered);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入課程模組");
        setCourseModules([]);
      }
    };

    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/user/Get_User_Lists_by_Id/${teacherId}`);
        if (!res.ok) {
          throw new Error(`無法獲取教師資料: ${res.status}`);
        }
        const data: Teacher = await res.json();
        setTeacherData(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入教師資料");
        setTeacherData(null);
      }
    };

    fetchTeacherData();
    fetchTypesData();
    fetchCourseModules();
  }, [teacherId]);

  const onSubmit: SubmitHandler<z.infer<typeof EditCourseTeacherSchema>> = (values) => {
    startTransition(() => {
      EditCourseTeacherAction(values).then((result) => {
        if (result.data) {
          toast.success("課程更新成功");
          router.push(`/teacher/${teacherId}/CourseLists`);
        } else {
          toast.error(result.error || "更新課程失敗，請稍後重試");
        }
      });
    });
  };

  console.log("courseTypes:", courseTypes, "-- End --");
  console.log("courseModules:", courseModules, "-- End --");
  console.log("teacherData:", teacherData, "-- End --");
  console.log("courseData:", courseData, "-- End --");
  console.log("formState.errors:", form.formState.errors, "-- End --");

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">修改課程</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">標題</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程標題"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="課程標題"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">描述</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程描述"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        rows={4}
                        aria-label="課程描述"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程代碼</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程代碼"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="課程代碼"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">學校名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入學校名稱"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="學校名稱"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
             <FormField
  control={form.control}
  name="numberOfDays"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-white">課程天數</FormLabel>
      <FormControl>
        <Input
          {...field}
          disabled={isPending}
          placeholder="輸入課程天數（可包含小數）"
          type="number"
          step="0.1" // 允許小數，步長為 0.1
          onChange={(e) => field.onChange(Number(e.target.value) || 0)} // 確保空值時返回 0
          value={field.value || ""}
          className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
          aria-label="課程天數"
        />
      </FormControl>
      <FormMessage className="text-red-400" />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="timeHours"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-white">每堂時數</FormLabel>
      <FormControl>
        <Input
          {...field}
          disabled={isPending}
          placeholder="輸入課程時數（可包含小數）"
          type="number"
          step="0.1" // 允許小數，步長為 0.1
          onChange={(e) => field.onChange(Number(e.target.value) || 0)} // 確保空值時返回 0
          value={field.value || ""}
          className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
          aria-label="課程時數"
        />
      </FormControl>
      <FormMessage className="text-red-400" />
    </FormItem>
  )}
/>
              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">教師 (以逗號分隔)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="老師名稱"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t.length > 0)
                          )
                        }
                        value={field.value.join(", ") || ""}
                        aria-label="教師名稱"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">是否公開</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
                        aria-label="是否公開"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">是否為產品</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
                        aria-label="是否為產品"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseModuleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程模組</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                        value={field.value ?? "none"}
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                          aria-label="課程模組"
                        >
                          <SelectValue placeholder="選擇課程模組" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600">
                          <SelectItem value="none">無模組</SelectItem>
                          {filteredCourseModules.map((module) => (
                            <SelectItem key={module.id} value={module.id}>
                              {module.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程類型</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {courseTypes.map((type) => (
                          <div key={type.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={type.id}
                              checked={field.value.includes(type.id)}
                              onCheckedChange={(checked) => {
                                const currentValues = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                if (checked) {
                                  field.onChange([...currentValues, type.id]);
                                } else {
                                  field.onChange(
                                    currentValues.filter((v) => v !== type.id)
                                  );
                                }
                              }}
                              disabled={isPending}
                              className="border-gray-600 data-[state=checked]:bg-gray-600"
                              aria-label={type.typename}
                            />
                            <label
                              htmlFor={type.id}
                              className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type.typename}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {/* 重新啟用被註釋掉的字段 */}
              {/* <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">開始日期</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="date"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="開始日期"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">結束日期</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="date"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="結束日期"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="courseDates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程日期</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課程日期（以逗號分隔，例如 2025-08-01,2025-08-02）"
                        onChange={(e) => {
                          const dates = e.target.value
                            .split(",")
                            .map((d) => d.trim())
                            .filter((d) => d.length > 0 && !isNaN(Date.parse(d)));
                          field.onChange(dates);
                        }}
                        value={field.value ? field.value.join(", ") : ""}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="課程日期"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">星期</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入星期（例如 Monday）"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="星期"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="classroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課室</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入課室（例如 Room 101）"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="課室"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
              {/* 動態時間範圍輸入 */}
              <div className="col-span-2">
                <FormLabel className="text-white">時間範圍</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`timeRanges.${index}.timeRange`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isPending}
                            >
                              <SelectTrigger
                                className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-32"
                                aria-label="時間段"
                              >
                                <SelectValue placeholder="選擇時間段" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 text-white border-gray-600">
                                {timeOptions.map((time) => (
                                  <SelectItem key={time.id} value={time.id}>
                                    {time.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <div
                      className="hidden"
                    >

                    <FormField
                      control={form.control}
                      name={`timeRanges.${index}.starttime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              type="time"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || null)}
                              className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-32"
                              aria-label="開始時間"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`timeRanges.${index}.endtime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              type="time"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || null)}
                              className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-32"
                              aria-label="結束時間"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isPending}
                    >
                      移除
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ timeRange: "morning", starttime: null, endtime: null })}
                  disabled={isPending}
                  className="mt-2"
                >
                  添加時間範圍
                </Button>
              </div>
            </div>

            <input type="hidden" value={teacherId} {...form.register("teacherId")} />
            <input type="hidden" value={courseId} {...form.register("courseId")} />

            <Button
              type="submit"
              disabled={isPending}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              {isPending ? "提交中..." : "提交"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditCourseTeacherForm;


// // components/CreateForm/Create-CourseTeacher-Form.tsx
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
// import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Switch } from "@/components/ui/switch";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "../ui/textarea";
// import { toast } from "react-toastify";

// import { EditCourseTeacherSchema } from "@/app/actions/Edit/Edit_CourseTeacher/schema";
// import { EditCourseTeacherAction } from "@/app/actions/Edit/Edit_CourseTeacher";

// // 定義型別
// interface CourseType {
//   id: string;
//   typename: string;
// }

// interface CourseModule {
//   id: string;
//   title: string;
//   description: string;
// }

// interface Teacher {
//   name: string;
// }

// const timeOptions = [
//   { id: "morning" as const, label: "上午" },
//   { id: "afternoon" as const, label: "下午" },
//   { id: "evening" as const, label: "晚上" },
//   { id: "full_day" as const, label: "全日" },
// ] as const;

// // type TimeRangeValue = "morning" | "afternoon" | "evening" | "full_day";

// const EditCourseTeacherForm = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const params = useParams();
//   const teacherId = params.Teacherid as string;
//   const courseId = params.CourseId as string;
//   const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
//   const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
//   const [teacherData, setTeacherData] = useState<Teacher | null>(null);
//   const [ courseDates, setCourseDates] = useState(null);



//   useEffect(()=>{
//     const fetchCourseDates = async () => {
//       try {
//         const res = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
//         if (!res.ok) {
//           throw new Error(`無法獲取課程日期: ${res.status}`);
//         }
//         const data = await res.json();
//         setCourseDates(data);
//       } catch (error) {
//         toast.error(error instanceof Error ? error.message : "無法載入課程日期");
//       }
//     }
//     fetchCourseDates()
//   },[])

//     console.log("courseDates : ", courseDates , "-- End --")


//   const form = useForm<z.infer<typeof EditCourseTeacherSchema>>({
//     resolver: zodResolver(EditCourseTeacherSchema),
//     mode: "onChange",
//     defaultValues: {
//       title: "",
//       description: "",
//       courseCode: "",
//       schoolName: "",
//       numberOfDays: 0,
//       courseModuleId: null,
//       timeHours: 0,
//       teacher: [],
//       isPublic: false,
//       isProduct: false,
//       timeRanges: [], // 使用 timeRanges
//       type: [],
//       teacherId,
//       startDate: null,
//       endDate: null,
//       courseDates: [],
//       weekday: null,
//       classroom: null,
//     },
//   });

//   // 使用 useFieldArray 管理 timeRanges 陣列
//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "timeRanges",
//   });

//   // 驗證 teacherId
//   useEffect(() => {
//     if (!teacherId) {
//       toast.error("無效的教師 ID");
//       router.push("/teachers");
//     }
//   }, [teacherId, router]);

//   // 監聽 courseModuleId 的變化，動態設置 description
//   const selectedCourseModuleId = form.watch("courseModuleId");
//   useEffect(() => {
//     if (selectedCourseModuleId && selectedCourseModuleId !== "none") {
//       const selectedModule = courseModules.find(
//         (module) => module.id === selectedCourseModuleId
//       );
//       if (selectedModule) {
//         form.setValue("description", selectedModule.description);
//       }
//     } else {
//       form.setValue("description", "");
//     }
//   }, [selectedCourseModuleId, courseModules, form]);

//   // 設置 teacher 字段的默認值
//   useEffect(() => {
//     if (teacherData?.name) {
//       form.setValue("teacher", [teacherData.name]);
//     }
//   }, [teacherData, form]);

//   // 獲取數據
//   useEffect(() => {
//     const fetchTypesData = async () => {
//       try {
//         const res = await fetch("/api/Type/Get_Type_Lists");
//         if (!res.ok) {
//           throw new Error(`無法獲取課程類型: ${res.status}`);
//         }
//         const data: CourseType[] = await res.json();
//         setCourseTypes(data);
//       } catch (error) {
//         toast.error(error instanceof Error ? error.message : "無法載入課程類型");
//         setCourseTypes([]);
//       }
//     };

//     const fetchCourseModules = async () => {
//       try {
//         const res = await fetch("/api/Course/Get_CourseModul_Lists");
//         if (!res.ok) {
//           throw new Error(`無法獲取課程模組: ${res.status}`);
//         }
//         const data: CourseModule[] = await res.json();
//         setCourseModules(data);
//       } catch (error) {
//         toast.error(error instanceof Error ? error.message : "無法載入課程模組");
//         setCourseModules([]);
//       }
//     };

//     const fetchTeacherData = async () => {
//       try {
//         const res = await fetch(`/api/user/Get_User_Lists_by_Id/${teacherId}`);
//         if (!res.ok) {
//           throw new Error(`無法獲取教師資料: ${res.status}`);
//         }
//         const data: Teacher = await res.json();
//         setTeacherData(data);
//       } catch (error) {
//         toast.error(error instanceof Error ? error.message : "無法載入教師資料");
//         setTeacherData(null);
//       }
//     };

//     fetchTeacherData();
//     fetchTypesData();
//     fetchCourseModules();
//   }, [teacherId]);

//   const onSubmit: SubmitHandler<z.infer<typeof EditCourseTeacherSchema>> = (values) => {
//     startTransition(() => {
//       EditCourseTeacherAction(values).then((result) => {
//         if (result.data) {
//           toast.success("課程創建成功");
//           router.push(`/teacher/${teacherId}/CourseLists`);
//         } else {
//           toast.error(result.error || "創建課程失敗，請稍後重試");
//         }
//       });
//     });
//   };

//   console.log("courseTypes : " ,courseTypes , "-- End --");
//   console.log("courseModules : " ,courseModules , "-- End --");
//   console.log("teacherData: ",teacherData ,"-- End --")

//   console.log(" -- Bug -- ", form.formState.errors ,"-- End --")

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <h1 className="text-2xl font-bold mb-6">修改課程</h1>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">標題</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程標題"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="課程標題"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">描述</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程描述"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         rows={4}
//                         aria-label="課程描述"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="courseCode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程代碼</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程代碼"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="課程代碼"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="schoolName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">學校名稱</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入學校名稱"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="學校名稱"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="numberOfDays"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程天數</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程天數"
//                         type="number"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value || ""}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="課程天數"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="timeHours"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程時數</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課程時數"
//                         type="number"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value || ""}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="課程時數"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="teacher"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">教師 (以逗號分隔)</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="老師名稱"
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         onChange={(e) =>
//                           field.onChange(
//                             e.target.value
//                               .split(",")
//                               .map((t) => t.trim())
//                               .filter((t) => t.length > 0)
//                           )
//                         }
//                         value={field.value.join(", ")}
//                         aria-label="教師名稱"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="isPublic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">是否公開</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending}
//                         className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
//                         aria-label="是否公開"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="isProduct"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">是否為產品</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending}
//                         className="data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-gray-700"
//                         aria-label="是否為產品"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="courseModuleId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程模組</FormLabel>
//                     <FormControl>
//                       <Select
//                         onValueChange={(value) => field.onChange(value === "none" ? null : value)}
//                         value={field.value ?? "none"}
//                         disabled={isPending}
//                       >
//                         <SelectTrigger
//                           className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                           aria-label="課程模組"
//                         >
//                           <SelectValue placeholder="選擇課程模組" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-gray-700 text-white border-gray-600">
//                           <SelectItem value="none">無模組</SelectItem>
//                           {courseModules.map((module) => (
//                             <SelectItem key={module.id} value={module.id}>
//                               {module.title}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課程類型</FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         {courseTypes.map((type) => (
//                           <div key={type.id} className="flex items-center space-x-2">
//                             <Checkbox
//                               id={type.id}
//                               checked={field.value.includes(type.id)}
//                               onCheckedChange={(checked) => {
//                                 const currentValues = Array.isArray(field.value)
//                                   ? field.value
//                                   : [];
//                                 if (checked) {
//                                   field.onChange([...currentValues, type.id]);
//                                 } else {
//                                   field.onChange(
//                                     currentValues.filter((v) => v !== type.id)
//                                   );
//                                 }
//                               }}
//                               disabled={isPending}
//                               className="border-gray-600 data-[state=checked]:bg-gray-600"
//                               aria-label={type.typename}
//                             />
//                             <label
//                               htmlFor={type.id}
//                               className="text-sm font-medium text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                             >
//                               {type.typename}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               <div
//                 className="hidden"
//               >
//             <FormField
//                             control={form.control}
//                             name="startDate"
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel className="text-white">開始日期</FormLabel>
//                                 <FormControl>
//                                   <Input
//                                     {...field}
//                                     disabled={isPending}
//                                     type="date"
//                                     value={field.value || ""}
//                                     onChange={(e) => field.onChange(e.target.value || null)}
//                                     className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                                     aria-label="開始日期"
//                                   />
//                                 </FormControl>
//                                 <FormMessage className="text-red-400" />
//                               </FormItem>
//                             )}
//                           />

//               </div>
             
//                            <div
//                 className="hidden"
//               >
//               <FormField
//                 control={form.control}
//                 name="endDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">結束日期</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         type="date"
//                         value={field.value || ""}
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="結束日期"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               />
//               </div>

//                             <div
//                 className="hidden"
//               >
// <FormField
//   control={form.control}
//   name="courseDates"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel className="text-white">課程日期</FormLabel>
//       <FormControl>
//         <Input
//           {...field}
//           disabled={isPending}
//           placeholder="輸入課程日期（以逗號分隔，例如 2025-08-01,2025-08-02）"
//           onChange={(e) => {
//             const dates = e.target.value
//               .split(",")
//               .map((d) => d.trim())
//               .filter((d) => d.length > 0 && !isNaN(Date.parse(d))); // 驗證日期格式
//             field.onChange(dates);
//           }}
//           value={field.value ? field.value.join(", ") : ""} // 處理 undefined
//           className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//           aria-label="課程日期"
//         />
//       </FormControl>
//       <FormMessage className="text-red-400" />
//     </FormItem>
//   )}
// /></div>

//               <div
//                 className="hidden"
//               >
//               <FormField
//                 control={form.control}
//                 name="weekday"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">星期</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入星期（例如 Monday）"
//                         value={field.value || ""}
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="星期"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               /></div>
//               <div
//                 className="hidden"
//               >
//               <FormField
//                 control={form.control}
//                 name="classroom"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-white">課室</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="輸入課室（例如 Room 101）"
//                         value={field.value || ""}
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                         className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
//                         aria-label="課室"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-400" />
//                   </FormItem>
//                 )}
//               /></div>

//               {/* 動態時間範圍輸入 */}
//               <div className="col-span-2">
//                 <FormLabel className="text-white">時間範圍</FormLabel>
//                 {fields.map((field, index) => (
//                   <div key={field.id} className="flex items-center space-x-4 mb-4">
//                     <FormField
//                       control={form.control}
//                       name={`timeRanges.${index}.timeRange`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Select
//                               onValueChange={field.onChange}
//                               value={field.value}
//                               disabled={isPending}
//                             >
//                               <SelectTrigger
//                                 className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-32"
//                                 aria-label="時間段"
//                               >
//                                 <SelectValue placeholder="選擇時間段" />
//                               </SelectTrigger>
//                               <SelectContent className="bg-gray-700 text-white border-gray-600">
//                                 {timeOptions.map((time) => (
//                                   <SelectItem key={time.id} value={time.id}>
//                                     {time.label}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </FormControl>
//                           <FormMessage className="text-red-400" />
//                         </FormItem>
//                       )}
//                     />
//                     <div 
//                       className="hidden"
//                     >
//                     <FormField
//                       control={form.control}
//                       name={`timeRanges.${index}.starttime`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               disabled={isPending}
//                               type="time"
//                               value={field.value || ""}
//                               onChange={(e) => field.onChange(e.target.value || null)}
//                               className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-32"
//                               aria-label="開始時間"
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-400" />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name={`timeRanges.${index}.endtime`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               disabled={isPending}
//                               type="time"
//                               value={field.value || ""}
//                               onChange={(e) => field.onChange(e.target.value || null)}
//                               className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-32"
//                               aria-label="結束時間"
//                             />
//                           </FormControl>
//                           <FormMessage className="text-red-400" />
//                         </FormItem>
//                       )}
//                     />
//                     </div>
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => remove(index)}
//                       disabled={isPending}
//                     >
//                       移除
//                     </Button>
//                   </div>
//                 ))}
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={() => append({ timeRange: "morning", starttime: null, endtime: null })}
//                   disabled={isPending}
//                   className="mt-2"
//                 >
//                   添加時間範圍
//                 </Button>
//               </div>
//             </div>

//             <input type="hidden" value={teacherId} {...form.register("teacherId")} />

//             <Button
//               type="submit"
//               disabled={isPending}
//               className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//             >
//               {isPending ? "提交中..." : "提交"}
//             </Button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default EditCourseTeacherForm;