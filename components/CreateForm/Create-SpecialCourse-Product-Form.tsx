'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import Image from "next/image";
import { toast } from "sonner";
import { Course } from "@/types/course";

import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { CreateProductFromSpecialSchema } from "@/app/actions/Create/Create_SpecialCourseProduct/schema";
import { CreateSpecialCourseProductAction } from "@/app/actions/Create/Create_SpecialCourseProduct";

// === 修正：正確匯入 ===


// === 型別定義 ===
type FormValues = z.infer<typeof CreateProductFromSpecialSchema> & {
  initialCourse?: Course;
};

interface CourseProductType {
  id: string;
  typename: string;
  author: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseProductStatus {
  id: string;
  statuename: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductFormProps {
  initialCourse?: Course;
}

// === Step 1: 課程選擇 ===
const Step1_CourseSelection = ({ onNext }: { onNext: () => void }) => {
  const { watch, setValue, getValues } = useFormContext<FormValues>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initialCourse = getValues("initialCourse");

  const handleCourseSelect = useCallback(
    (course: Course) => {
      if (course.Producted && !initialCourse) {
        toast.info("此課程已轉為產品，無法再次選擇");
        return;
      }
      setSelectedCourseId(course.id);
      setValue("title", course.title);
      setValue("description", course.description);
      setValue("courseId", course.id);
      if (course.numberOfDays && course.timeHours) {
        const price = course.numberOfDays * course.timeHours * 100;
        setValue("price", price);
        setValue("real_price", Math.round(price * 0.9));
      }
      toast.success(`已選擇：${course.title}`);
    },
    [setValue, initialCourse]
  );

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/Course/Get_Course_Lists");
        if (!res.ok) throw new Error("無法載入課程");
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch {
        setError("載入課程失敗");
        toast.error("載入課程失敗");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (initialCourse && !selectedCourseId && initialCourse?.id) {
      handleCourseSelect(initialCourse);
    }
  }, [initialCourse, selectedCourseId, handleCourseSelect]);

  const selectable = courses.filter(c => !c.Producted || c.id === initialCourse?.id);
  const nonSelectable = courses.filter(c => c.Producted && c.id !== initialCourse?.id);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">步驟 1：選擇課程</h2>
      {error && <p className="text-red-500">{error}</p>}

      {initialCourse?.id ? (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <p className="font-medium text-blue-900">{initialCourse.title}</p>
          <p className="text-sm text-blue-700">{initialCourse.description}</p>
          <p className="text-xs text-green-600 mt-2">已自動選擇</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-h-96 overflow-y-auto pr-2">
          <div>
            <h3 className="font-medium text-gray-600 mb-2">不可選（已為產品）</h3>
            {nonSelectable.length === 0 ? (
              <p className="text-gray-500 text-sm">無</p>
            ) : (
              <div className="space-y-2">
                {nonSelectable.map(c => (
                  <div key={c.id} className="p-3 bg-gray-100 rounded border cursor-not-allowed">
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-gray-600">{c.schoolName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-green-700 mb-2">可選課程</h3>
            {selectable.length === 0 ? (
              <p className="text-gray-500 text-sm">無可選課程</p>
            ) : (
              <div className="space-y-2">
                {selectable.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleCourseSelect(c)}
                    className={`p-3 rounded border cursor-pointer transition ${
                      selectedCourseId === c.id
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-gray-600">{c.schoolName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!watch("courseId")}>
          下一步 <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

// === Step 2: 產品詳情 ===
const Step2_ProductDetails = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">步驟 2：產品詳情</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Target_Audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>目標觀眾</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={control}
            name="Course_Objective"
            render={({ field }) => (
              <FormItem>
                <FormLabel>課程目標</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="Applicable_Scenarios"
            render={({ field }) => (
              <FormItem>
                <FormLabel>適用場景</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={e => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>原價</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="real_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>實價</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="w-4 h-4 mr-1" /> 上一步
        </Button>
        <Button onClick={onNext}>
          下一步 <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

// === Step 3: 媒體與分類 ===
const Step3_MediaAndTypes = ({ onPrev }: { onPrev: () => void }) => {
  const { control, setValue, getValues } = useFormContext<FormValues>();
  const [types, setTypes] = useState<CourseProductType[]>([]);
  const [statuses, setStatuses] = useState<CourseProductStatus[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [typeRes, statusRes] = await Promise.all([
        fetch("/api/Type/Get_Type_Lists"),
        fetch("/api/Status/Get_Status_Lists"),
      ]);
      const [typeData, statusData] = await Promise.all([
        typeRes.json(),
        statusRes.json(),
      ]);
      setTypes(typeData);
      setStatuses(statusData);
    };
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      f => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );
    setValue("images", files);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => {
      prev.forEach(URL.revokeObjectURL);
      return previews;
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      f => f.type.startsWith("video/") && f.size <= 50 * 1024 * 1024
    );
    setValue("videos", files);
    const previews = files.map(f => URL.createObjectURL(f));
    setVideoPreviews(prev => {
      prev.forEach(URL.revokeObjectURL);
      return previews;
    });
  };

  // const onSubmit = () => {
  //   startTransition(async () => {
  //     const values = getValues();
  //     const result = await CreateSpecialCourseProductAction(values);
  //     if (!result.error && result.data) {
  //       toast.success("產品創建成功");
  //       router.push("/admin/ProductLists");
  //     } else {
  //       toast.error(result.error ?? "創建失敗");
  //     }
  //   });
  // };

// 在 Step3_MediaAndTypes 中
const onSubmit = () => {
  startTransition(async () => {
    const formData = new FormData();

    // 從 react-hook-form 拿值
    const values = getValues();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("real_price", String(values.real_price));
    if (values.courseId) formData.append("courseId", values.courseId);
    if (values.Target_Audience) formData.append("Target_Audience", values.Target_Audience);
    if (values.Course_Objective) formData.append("Course_Objective", values.Course_Objective);
    if (values.Applicable_Scenarios) formData.append("Applicable_Scenarios", values.Applicable_Scenarios);

    // 多選框陣列
    values.CourseProductTypeArray?.forEach(id => formData.append("CourseProductTypeArray", id));
    values.CourseProductStatusArray?.forEach(id => formData.append("CourseProductStatusArray", id));

    // 檔案（FileList → File[]）
    const imageFiles = document.querySelector('input[name="images"]') as HTMLInputElement;
    const videoFiles = document.querySelector('input[name="videos"]') as HTMLInputElement;

    if (imageFiles?.files) {
      Array.from(imageFiles.files).forEach(file => formData.append("images", file));
    }
    if (videoFiles?.files) {
      Array.from(videoFiles.files).forEach(file => formData.append("videos", file));
    }

    const result = await CreateSpecialCourseProductAction(formData);
    if (result.data) {
      toast.success("產品創建成功");
      router.push("/admin/ProductLists");
    } else {
      toast.error(result.error ?? "創建失敗");
    }
  });
};


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">步驟 3：媒體與分類</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <FormField
            control={control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>圖片（最多 5MB）</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" multiple name="images" onChange={handleImageChange} />
                </FormControl>
              </FormItem>
            )}
          />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {imagePreviews.map((src, i) => (
                <Image key={i} src={src} alt="" width={100} height={100} className="rounded object-cover" />
              ))}
            </div>
          )}
        </div>

        <div>
          <FormField
            control={control}
            name="videos"
            render={() => (
              <FormItem>
                <FormLabel>影片（最多 50MB）</FormLabel>
                <FormControl>
<Input type="file" accept="video/*" multiple name="videos" onChange={handleVideoChange} />
                </FormControl>
              </FormItem>
            )}
          />
          {videoPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {videoPreviews.map((src, i) => (
                <video key={i} src={src} controls className="w-full h-24 rounded object-cover" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="CourseProductTypeArray"
          render={({ field }) => (
            <FormItem>
              <FormLabel>產品類型</FormLabel>
              <div className="space-y-2">
                {types.map(t => (
                  <div key={t.id} className="flex items-center">
                    <Checkbox
                      checked={field.value?.includes(t.id) ?? false}
                      onCheckedChange={checked => {
                        const arr = field.value ?? [];
                        field.onChange(
                          checked ? [...arr, t.id] : arr.filter(id => id !== t.id)
                        );
                      }}
                    />
                    <Label className="ml-2">{t.typename}</Label>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="CourseProductStatusArray"
          render={({ field }) => (
            <FormItem>
              <FormLabel>產品狀態</FormLabel>
              <div className="space-y-2">
                {statuses.map(s => (
                  <div key={s.id} className="flex items-center">
                    <Checkbox
                      checked={field.value?.includes(s.id) ?? false}
                      onCheckedChange={checked => {
                        const arr = field.value ?? [];
                        field.onChange(
                          checked ? [...arr, s.id] : arr.filter(id => id !== s.id)
                        );
                      }}
                    />
                    <Label className="ml-2">{s.statuename}</Label>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          <ChevronLeft className="w-4 h-4 mr-1" /> 上一步
        </Button>
        <Button onClick={onSubmit} disabled={isPending}>
          {isPending ? "提交中..." : "完成創建"} <CheckCircle className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

// === 主表單 ===
const Create_SpecialCourse_Product_Form = ({ initialCourse }: CreateProductFormProps) => {
  const [step, setStep] = useState(1);

  const methods = useForm<FormValues>({
    resolver: zodResolver(CreateProductFromSpecialSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      real_price: 0,
      CourseProductTypeArray: [],
      CourseProductStatusArray: [],
      courseId: null,
      images: [],
      videos: [],
      Target_Audience: null,
      Course_Objective: null,
      Applicable_Scenarios: null,
      initialCourse: initialCourse || undefined,
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">創建產品</h1>

      <div className="flex justify-center mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition ${
                step >= i ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step > i ? <CheckCircle className="w-5 h-5" /> : i}
            </div>
            {i < 3 && <div className={`w-24 h-1 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-300'}`} />}
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={e => e.preventDefault()}>
          {step === 1 && <Step1_CourseSelection onNext={() => setStep(2)} />}
          {step === 2 && <Step2_ProductDetails onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
          {step === 3 && <Step3_MediaAndTypes onPrev={() => setStep(2)} />}
        </form>
      </FormProvider>
    </div>
  );
};

export default Create_SpecialCourse_Product_Form;