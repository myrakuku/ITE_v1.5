
// components/CreateForm/Create-CourseTeacher-Form.tsx
'use client';

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
import { CreateCourseTeacherSchema } from "@/app/actions/Create/Create_CourseTeacher/schema";
import { CreateCourseTeacherAction } from "@/app/actions/Create/Create_CourseTeacher";

interface CourseType {
  id: string;
  typename: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  TeacherId: string;
}

interface Teacher {
  name: string;
  Course?: { id: string }[]; // 加入 Course 關聯
}

const timeOptions = [
  { id: "morning" as const, label: "上午" },
  { id: "afternoon" as const, label: "下午" },
  { id: "evening" as const, label: "晚上" },
] as const;

const CreateCourseTeacherForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.Teacherid as string;
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [filteredCourseModules, setFilteredCourseModules] = useState<CourseModule[]>([]);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  // === 新增：獲取教師現有課程 ===
  const [existingCourses, setExistingCourses] = useState<any[]>([]);

  const form = useForm<z.infer<typeof CreateCourseTeacherSchema>>({
    resolver: zodResolver(CreateCourseTeacherSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      courseCode: "", // 自動生成
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

// 監聽 type 變化 + 教師資料 + 現有課程 → 生成 courseCode
const selectedTypes = form.watch("type");

useEffect(() => {
  if (!teacherData?.name || selectedTypes.length === 0 || !courseTypes.length) {
    form.setValue("courseCode", "");
    return;
  }

  // 找出選中的類型名稱
  const selectedTypeIds = selectedTypes;
  const selectedTypeNames = courseTypes
    .filter(t => selectedTypeIds.includes(t.id))
    .map(t => t.typename);

  if (selectedTypeNames.length === 0) {
    form.setValue("courseCode", "");
    return;
  }

  // === 關鍵：從現有課程中，找出「同類型」的最大序號 ===
  let maxSeq = 0;

  existingCourses.forEach(course => {
    if (!course.courseCode || !course.type) return;

    // 檢查是否包含選中的任一類型
    const hasMatchingType = course.type.some((typeId: string) =>
      selectedTypeIds.includes(typeId)
    );
    if (!hasMatchingType) return;

    // 解析 courseCode：假設格式為 "數字_類型_教師"
    const match = course.courseCode.match(/^(\d+)_/);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  });

  const nextSeq = maxSeq + 1;
  const typePart = selectedTypeNames.join("+"); // 多類型用 + 連接
  const code = `${nextSeq}_${typePart}_${teacherData.name}`;

  form.setValue("courseCode", code);
}, [selectedTypes, teacherData, courseTypes, existingCourses, form]);

  useEffect(() => {
    if (teacherData?.name) {
      form.setValue("teacher", [teacherData.name]);
    }
  }, [teacherData, form]);

  // 獲取所有資料
  useEffect(() => {
    const fetchTypesData = async () => {
      try {
        const res = await fetch("/api/Type/Get_Type_Lists");
        if (!res.ok) throw new Error(`無法獲取課程類型: ${res.status}`);
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
        if (!res.ok) throw new Error(`無法獲取課程模組: ${res.status}`);
        const data: CourseModule[] = await res.json();
        setCourseModules(data);
        const filtered = data.filter(m => m.TeacherId === teacherId);
        setFilteredCourseModules(filtered);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入課程模組");
        setCourseModules([]);
        setFilteredCourseModules([]);
      }
    };

    const fetchTeacherData = async () => {
      try {
        const res = await fetch(`/api/user/Get_User_Lists_by_Id/${teacherId}`);
        if (!res.ok) throw new Error(`無法獲取教師資料: ${res.status}`);
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

// 在 useEffect 載入資料時，加上：
useEffect(() => {
  const fetchExistingCourses = async () => {
    try {
      const res = await fetch(`/api/user/teacher/${teacherId}/CourseLists`);
      if (!res.ok) return;
      const data = await res.json();
      setExistingCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("無法載入現有課程", error);
    }
  };

  if (teacherId) fetchExistingCourses();
}, [teacherId]);

// === 新增：監聽 courseModuleId 變化，自動填入 title & description ===
const selectedModuleId = form.watch("courseModuleId");

useEffect(() => {
  if (!selectedModuleId) {
    // 若選擇「無模組」，不強制清除現有內容
    return;
  }

  const selectedModule = filteredCourseModules.find(m => m.id === selectedModuleId);
  if (selectedModule) {
    form.setValue("title", selectedModule.title, { shouldValidate: true });
    form.setValue("description", selectedModule.description, { shouldValidate: true });
  }
}, [selectedModuleId, filteredCourseModules, form]);


useEffect(() => {
  const fetchExistingCourses = async () => { /* ... */ };
  if (teacherId) fetchExistingCourses();
}, [teacherId]);

// === 新增：自動填入 title & description ===
useEffect(() => {
  if (!selectedModuleId) return;

  const selectedModule = filteredCourseModules.find(m => m.id === selectedModuleId);
  if (selectedModule) {
    form.setValue("title", selectedModule.title, { shouldValidate: true });
    form.setValue("description", selectedModule.description, { shouldValidate: true });
  }
}, [selectedModuleId, filteredCourseModules, form]);

  const onSubmit: SubmitHandler<z.infer<typeof CreateCourseTeacherSchema>> = (values) => {
    startTransition(() => {
      CreateCourseTeacherAction(values).then((result) => {
        if (result.data) {
          toast.success("課程創建成功");
          router.push(`/teacher/${teacherId}/CourseLists`);
        } else {
          toast.error(result.error || "創建課程失敗，請稍後重試");
        }
      });
    });
  };

  console.log("courseTypes : " ,courseTypes , "-- End --");
  console.log("courseModules : " ,courseModules , "-- End --");
  console.log("teacherData: ",teacherData ,"-- End --")
  console.log(" -- Bug -- ", form.formState.errors ,"-- End --")

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">創建課程</h1>
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
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500 resize-none whitespace-pre-wrap"
                        style={{ whiteSpace: "pre-wrap" }} // 雙重保險
                        rows={4}
                        aria-label="課程描述"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {/* 課程代碼：唯讀 + 自動生成 */}
              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">課程代碼</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={true} // 禁止手動編輯
                        placeholder="自動生成"
                        className="bg-gray-700 text-white border-gray-600 opacity-75"
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
                        value={field.value.join(", ")}
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
            {filteredCourseModules.map((module) => ( // 使用 filteredCourseModules
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

{/* 課程類型：選取後觸發 courseCode 更新 */}
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
                                const current = Array.isArray(field.value) ? field.value : [];
                                if (checked) {
                                  field.onChange([...current, type.id]);
                                } else {
                                  field.onChange(current.filter(v => v !== type.id));
                                }
                              }}
                              disabled={isPending}
                              className="border-gray-600 data-[state=checked]:bg-gray-600"
                            />
                            <label htmlFor={type.id} className="text-sm font-medium text-white">
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
              <div
                className="hidden"
              >
            <FormField
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

              </div>
             
                           <div
                className="hidden"
              >
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
              </div>

                            <div
                className="hidden"
              >
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
              .filter((d) => d.length > 0 && !isNaN(Date.parse(d))); // 驗證日期格式
            field.onChange(dates);
          }}
          value={field.value ? field.value.join(", ") : ""} // 處理 undefined
          className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
          aria-label="課程日期"
        />
      </FormControl>
      <FormMessage className="text-red-400" />
    </FormItem>
  )}
/></div>

              <div
                className="hidden"
              >
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
              /></div>
              <div
                className="hidden"
              >
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
              /></div>

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

export default CreateCourseTeacherForm;
