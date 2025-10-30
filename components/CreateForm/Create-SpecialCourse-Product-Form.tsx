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
import { CreateSpecialCourseProductSchema } from "@/app/actions/Create/Create_SpecialCourseProduct/schema";
import { CreateSpecialCourseProductAction } from "@/app/actions/Create/Create_SpecialCourseProduct";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

type FormValues = z.infer<typeof CreateSpecialCourseProductSchema> & {
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

  // 安全取得 initialCourse（不再強制轉型）
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
      setValue("IsPublic", course.isPublic);
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
    if (initialCourse && !selectedCourseId && typeof initialCourse === 'object' && 'id' in initialCourse) {
      handleCourseSelect(initialCourse as Course);
    }
  }, [initialCourse, selectedCourseId, handleCourseSelect]);

  const selectable = courses.filter(c => !c.Producted);
  const nonSelectable = courses.filter(c => c.Producted);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">步驟 1：選擇課程</h2>
      {error && <p className="text-red-500">{error}</p>}

      {initialCourse && typeof initialCourse === 'object' && 'title' in initialCourse ? (
        <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <p className="font-medium text-blue-900">{(initialCourse as Course).title}</p>
          <p className="text-sm text-blue-700">{(initialCourse as Course).description}</p>
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

// === Step 2 & Step 3 保持不變（略）===
const Step2_ProductDetails = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">步驟 2：產品詳情</h2>
      {/* ... 省略，與原檔案相同 ... */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField control={control} name="title" render={({ field }) => (
            <FormItem><FormLabel>標題</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="description" render={({ field }) => (
            <FormItem><FormLabel>描述</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="Target_Audience" render={({ field }) => (
            <FormItem><FormLabel>目標觀眾</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="space-y-4">
          <FormField control={control} name="Course_Objective" render={({ field }) => (
            <FormItem><FormLabel>課程目標</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="Applicable_Scenarios" render={({ field }) => (
            <FormItem><FormLabel>適用場景</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value || null)} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="price" render={({ field }) => (
            <FormItem><FormLabel>原價</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={control} name="real_price" render={({ field }) => (
            <FormItem><FormLabel>實價</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}><ChevronLeft className="w-4 h-4 mr-1" /> 上一步</Button>
        <Button onClick={onNext}>下一步 <ChevronRight className="w-4 h-4 ml-1" /></Button>
      </div>
    </div>
  );
};

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
      const [typeData, statusData] = await Promise.all([typeRes.json(), statusRes.json()]);
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

  const onSubmit = () => {
    startTransition(async () => {
      const values = getValues();
      const result = await CreateSpecialCourseProductAction(values);
      if (!result.error) {
        toast.success("產品創建成功");
        router.push("/admin/ProductLists");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">步驟 3：媒體與分類</h2>
      {/* ... 省略，與原檔案相同 ... */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <FormField control={control} name="images" render={() => (
            <FormItem>
              <FormLabel>圖片</FormLabel>
              <FormControl><Input type="file" accept="image/*" multiple onChange={handleImageChange} /></FormControl>
            </FormItem>
          )} />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {imagePreviews.map((src, i) => (
                <Image key={i} src={src} alt="" width={100} height={100} className="rounded object-cover" />
              ))}
            </div>
          )}
        </div>
        <div>
          <FormField control={control} name="videos" render={() => (
            <FormItem>
              <FormLabel>影片</FormLabel>
              <FormControl><Input type="file" accept="video/*" multiple onChange={handleVideoChange} /></FormControl>
            </FormItem>
          )} />
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
        <FormField control={control} name="CourseProductTypeArray" render={({ field }) => (
          <FormItem>
            <FormLabel>產品類型</FormLabel>
            <div className="space-y-2">
              {types.map(t => (
                <div key={t.id} className="flex items-center">
                  <Checkbox checked={field.value.includes(t.id)} onCheckedChange={c => {
                    field.onChange(c ? [...field.value, t.id] : field.value.filter(id => id !== t.id));
                  }} />
                  <Label className="ml-2">{t.typename}</Label>
                </div>
              ))}
            </div>
          </FormItem>
        )} />
        <FormField control={control} name="CourseProductStatusArray" render={({ field }) => (
          <FormItem>
            <FormLabel>產品狀態</FormLabel>
            <div className="space-y-2">
              {statuses.map(s => (
                <div key={s.id} className="flex items-center">
                  <Checkbox checked={field.value.includes(s.id)} onCheckedChange={c => {
                    field.onChange(c ? [...field.value, s.id] : field.value.filter(id => id !== s.id));
                  }} />
                  <Label className="ml-2">{s.statuename}</Label>
                </div>
              ))}
            </div>
          </FormItem>
        )} />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}><ChevronLeft className="w-4 h-4 mr-1" /> 上一步</Button>
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
    resolver: zodResolver(CreateSpecialCourseProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      real_price: 0,
      IsPublic: false,
      CourseProductTypeArray: [],
      CourseProductStatusArray: [],
      courseId: null,
      images: [],
      videos: [],
      Target_Audience: "",
      Course_Objective: "",
      Applicable_Scenarios: "",
      initialCourse: initialCourse || undefined,
    },
  });

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6 text-center">創建特別課程產品</h1>

      <div className="flex justify-center mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition ${
              step >= i ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step > i ? <CheckCircle className="w-5 h-5" /> : i}
            </div>
            {i < 3 && <div className={`w-24 h-1 mx-2 ${step > i ? 'bg-blue-600' : 'bg-gray-300'}`} />}
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={e => { e.preventDefault(); }}>
          {step === 1 && <Step1_CourseSelection onNext={() => setStep(2)} />}
          {step === 2 && <Step2_ProductDetails onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
          {step === 3 && <Step3_MediaAndTypes onPrev={() => setStep(2)} />}
        </form>
      </FormProvider>
    </div>
  );
};

export default Create_SpecialCourse_Product_Form;
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
// import { useCallback, useEffect, useState, useTransition } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { useRouter } from "next/navigation";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { z } from "zod";
// import Image from "next/image";
// import { toast } from "sonner";
// import { Course } from "@/types/course";
// import { CreateSpecialCourseProductSchema } from "@/app/actions/Create/Create_SpecialCourseProduct/schema";
// import { CreateSpecialCourseProductAction } from "@/app/actions/Create/Create_SpecialCourseProduct";

// type FormValues = z.infer<typeof CreateSpecialCourseProductSchema>;

// interface CourseProductType {
//   id: string;
//   typename: string;
//   author: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface CourseProductStatus {
//   id: string;
//   statuename: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface CreateProductFormProps {
//   initialCourse?: Course;
// }

// const Create_SpecialCourse_Product_Form = ({ initialCourse }: CreateProductFormProps) => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const [GetCourseListsData, setGetCourseListsData] = useState<Course[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
//   const [GetTypeData, setGetTypeData] = useState<CourseProductType[]>([]);
//   const [GetStatueDadta, setGetStatueDadta] = useState<CourseProductStatus[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

//   const user_Product_form = useForm<FormValues>({
//     resolver: zodResolver(CreateSpecialCourseProductSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       price: 0,
//       real_price: 0,
//       IsPublic: false,
//       CourseProductTypeArray: [],
//       CourseProductStatusArray: [],
//       courseId: null,
//       images: [],
//       videos: [],
//       Target_Audience: "",
//       Course_Objective: "",
//       Applicable_Scenarios: "",
//     },
//   });

//   const handleCourseSelect = useCallback(
//     (course: Course) => {
//       if (course.Producted && !initialCourse) {
//         toast.info("此課程已轉為產品，無法再次選擇");
//         return;
//       }
//       setSelectedCourseId(course.id);
//       user_Product_form.setValue("title", course.title, { shouldValidate: true });
//       user_Product_form.setValue("description", course.description, {
//         shouldValidate: true,
//       });
//       user_Product_form.setValue("courseId", course.id, { shouldValidate: true });
//       user_Product_form.setValue("IsPublic", course.isPublic, {
//         shouldValidate: true,
//       });
//       if (course.numberOfDays && course.timeHours) {
//         const suggestedPrice = course.numberOfDays * course.timeHours * 100;
//         user_Product_form.setValue("price", suggestedPrice, {
//           shouldValidate: true,
//         });
//         user_Product_form.setValue("real_price", Math.round(suggestedPrice * 0.9), {
//           shouldValidate: true,
//         });
//       }
//       toast.success(`已選擇課程：${course.title}`);
//     },
//     [user_Product_form, initialCourse]
//   );

//   // 獲取課程、類型和狀態數據
//   useEffect(() => {
//     const fetchCourseListsData = async () => {
//       try {
//         const response = await fetch("/api/Course/Get_Course_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         const courseData = Array.isArray(data)
//           ? data.map((course: Course) => ({
//               ...course,
//               Producted: course.Producted ?? false,
//               isProduct: course.isProduct ?? false,
//               courseDates: course.courseDates || [],
//               courseTimeRanges: course.courseTimeRanges || [],
//             }))
//           : [];
//         setGetCourseListsData(courseData);
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "無法獲取課程數據";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     };

//     const fetchTypeListsData = async () => {
//       try {
//         const response = await fetch("/api/Type/Get_Type_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetTypeData(data);
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "無法獲取類型數據";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     };

//     const fetchStatueListsData = async () => {
//       try {
//         const response = await fetch("/api/Status/Get_Status_Lists");
//         if (!response.ok) {
//           throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.error) {
//           throw new Error(data.error);
//         }
//         setGetStatueDadta(data);
//       } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "無法獲取狀態數據";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     };

//     fetchCourseListsData();
//     fetchTypeListsData();
//     fetchStatueListsData();
//   }, []); // 數據加載僅在組件掛載時執行

//   // 處理初始課程選擇和自動選擇邏輯
//   useEffect(() => {
//     if (initialCourse && !selectedCourseId) {
//       handleCourseSelect(initialCourse);
//     } else if (!initialCourse && GetCourseListsData.length > 0 && !selectedCourseId) {
//       const firstSelectable = GetCourseListsData.find(
//         (course: Course) => !course.Producted
//       );
//       if (firstSelectable) {
//         handleCourseSelect(firstSelectable);
//       } else {
//         toast.info("無可選課程，請先創建課程");
//       }
//     }
//   }, [initialCourse, selectedCourseId, GetCourseListsData, handleCourseSelect]);

//   // 處理圖片上傳
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []).filter(
//       (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
//     );
//     if (files.length !== e.target.files?.length) {
//       toast.error("部分圖片無效或超過 5MB");
//     }
//     user_Product_form.setValue("images", files, { shouldValidate: true });
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews((prev) => {
//       prev.forEach((url) => URL.revokeObjectURL(url));
//       return previews;
//     });
//   };

//   // 處理影片上傳
//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []).filter(
//       (file) => file.type.startsWith("video/") && file.size <= 50 * 1024 * 1024
//     );
//     if (files.length !== e.target.files?.length) {
//       toast.error("部分影片無效或超過 50MB");
//     }
//     user_Product_form.setValue("videos", files, { shouldValidate: true });
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setVideoPreviews((prev) => {
//       prev.forEach((url) => URL.revokeObjectURL(url));
//       return previews;
//     });
//   };

//   // 清理圖片和影片預覽的內存
//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//       videoPreviews.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [imagePreviews, videoPreviews]);

//   // 提交表單
//   const user_Product_form_onSubmit: SubmitHandler<FormValues> = (values) => {
//     if (!selectedCourseId) {
//       toast.error("請選擇一個課程");
//       return;
//     }
//     const transformedValues = {
//       ...values,
//       Target_Audience: values.Target_Audience || null,
//       Course_Objective: values.Course_Objective || null,
//       Applicable_Scenarios: values.Applicable_Scenarios || null,
//       CourseProductTypeArray: values.CourseProductTypeArray.map((id) => id),
//       CourseProductStatusArray: values.CourseProductStatusArray.map((id) => id),
//     };

//     startTransition(async () => {
//       try {
//         const result = await CreateSpecialCourseProductAction(transformedValues);
//         if (!result.error) {
//           toast.success("產品創建成功");
//           if (initialCourse) {
//             window.dispatchEvent(
//               new CustomEvent("productCreated", { detail: result.data })
//             );
//           } else {
//             router.push(`/admin/ProductLists`);
//           }
//         } else {
//           user_Product_form.setError("root", {
//             type: "manual",
//             message: result.error || "提交失敗，請重試",
//           });
//           toast.error(result.error || "提交失敗，請重試");
//         }
//       } catch (error) {
//         const errorMessage =
//           error instanceof Error ? error.message : "提交失敗，請重試";
//         user_Product_form.setError("root", {
//           type: "manual",
//           message: errorMessage,
//         });
//         toast.error(errorMessage);
//       }
//     });
//   };

//   const selectableCourses = GetCourseListsData.filter(
//     (course) => !course.Producted
//   );
//   const nonSelectableCourses = GetCourseListsData.filter(
//     (course) => course.Producted
//   );

//   return (
//     <div className="container mx-auto p-4 flex gap-6">
//       <div className="w-1/3">
//         <h2 className="text-xl font-semibold mb-4">選擇課程</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         {initialCourse ? (
//           <div className="p-3 border rounded bg-blue-50 border-blue-200">
//             <h3 className="font-medium text-blue-800">{initialCourse.title}</h3>
//             <p className="text-sm text-gray-600">{initialCourse.description}</p>
//             <p className="text-sm text-gray-500">
//               課程代碼: {initialCourse.courseCode}
//             </p>
//             <p className="text-sm text-gray-500">學校: {initialCourse.schoolName}</p>
//             <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
//               <p className="text-sm text-green-800 font-medium">
//                 ✅ 已自動選擇此課程
//               </p>
//               <p className="text-xs text-green-600">基於安排特別課程頁面</p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <h3 className="text-lg font-medium mb-2">
//                 不可選課程（已為產品）
//               </h3>
//               {nonSelectableCourses.length > 0 ? (
//                 <div className="grid gap-2">
//                   {nonSelectableCourses.map((course) => (
//                     <div
//                       key={course.id}
//                       className="p-3 border rounded bg-gray-200 cursor-not-allowed"
//                     >
//                       <h3 className="font-medium">{course.title}</h3>
//                       <p className="text-sm text-gray-600">{course.description}</p>
//                       <p className="text-sm text-gray-500">
//                         課程代碼: {course.courseCode}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         學校: {course.schoolName} {/* 直接使用 course.schoolName */}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-gray-500">無不可選課程</div>
//               )}
//             </div>
//             <div className="w-1/2">
//               <h3 className="text-lg font-medium mb-2">
//                 可選課程（可轉為產品）
//               </h3>
//               {selectableCourses.length > 0 ? (
//                 <div className="grid gap-2">
//                   {selectableCourses.map((course) => (
//                     <div
//                       key={course.id}
//                       className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
//                         selectedCourseId === course.id ? "bg-blue-100 border-blue-500" : ""
//                       }`}
//                       onClick={() => handleCourseSelect(course)}
//                     >
//                       <h3 className="font-medium">{course.title}</h3>
//                       <p className="text-sm text-gray-600">{course.description}</p>
//                       <p className="text-sm text-gray-500">
//                         課程代碼: {course.courseCode}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         學校: {course.schoolName}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-gray-500">無可選課程</div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="w-2/3">
//         <h1 className="text-2xl font-bold mb-4">
//           {initialCourse ? `創建產品 - ${initialCourse.title}` : "創建產品"}
//         </h1>
//         <Form {...user_Product_form}>
//           <form
//             onSubmit={user_Product_form.handleSubmit(user_Product_form_onSubmit)}
//             className="grid grid-cols-1 md:grid-cols-2 gap-6"
//           >
//             {user_Product_form.formState.errors.root && (
//               <div className="col-span-2 text-red-500">
//                 {user_Product_form.formState.errors.root.message}
//               </div>
//             )}
//             {/* 左欄 */}
//             <div className="space-y-4">
//               <FormField
//                 control={user_Product_form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>標題</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending || !!initialCourse}
//                         placeholder="標題"
//                         type="text"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>描述</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         disabled={isPending || !!initialCourse}
//                         placeholder="描述"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="Target_Audience"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>目標觀眾</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         value={field.value ?? ""}
//                         disabled={isPending}
//                         placeholder="輸入目標觀眾"
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="Course_Objective"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>課程目標</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         value={field.value ?? ""}
//                         disabled={isPending}
//                         placeholder="輸入課程目標"
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="Applicable_Scenarios"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>可適用場景</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         {...field}
//                         value={field.value ?? ""}
//                         disabled={isPending}
//                         placeholder="輸入可適用場景"
//                         onChange={(e) => field.onChange(e.target.value || null)}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* 右欄 */}
//             <div className="space-y-4">
//               <FormField
//                 control={user_Product_form.control}
//                 name="price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>原價格</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="價格"
//                         type="number"
//                         min="0"
//                         step="1"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="real_price"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>實際價格</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="實際價格"
//                         type="number"
//                         min="0"
//                         step="1"
//                         onChange={(e) => field.onChange(Number(e.target.value))}
//                         value={field.value}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="IsPublic"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>是否公開</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isPending || !!initialCourse}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="images"
//                 render={() => (
//                   <FormItem>
//                     <FormLabel>上傳圖片</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         disabled={isPending}
//                         onChange={handleImageChange}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {imagePreviews.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="text-lg font-medium mb-2">圖片預覽</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     {imagePreviews.map((preview, index) => (
//                       <Image
//                         key={index}
//                         src={preview}
//                         alt={`圖片預覽 ${index + 1}`}
//                         width={150}
//                         height={100}
//                         className="w-full h-24 object-cover rounded"
//                         unoptimized
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <FormField
//                 control={user_Product_form.control}
//                 name="videos"
//                 render={() => (
//                   <FormItem>
//                     <FormLabel>上傳影片</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="file"
//                         accept="video/*"
//                         multiple
//                         disabled={isPending}
//                         onChange={handleVideoChange}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {videoPreviews.length > 0 && (
//                 <div className="mt-4">
//                   <h3 className="text-lg font-medium mb-2">影片預覽</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     {videoPreviews.map((preview, index) => (
//                       <video
//                         key={index}
//                         src={preview}
//                         controls
//                         className="w-full h-24 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <FormField
//                 control={user_Product_form.control}
//                 name="CourseProductTypeArray"
//                 render={({ field: { value, onChange } }) => (
//                   <FormItem>
//                     <FormLabel>產品類型</FormLabel>
//                     <div className="grid gap-2">
//                       {GetTypeData.map((type) => (
//                         <div key={type.id} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={type.id}
//                             checked={value.includes(type.id)}
//                             onCheckedChange={(checked) => {
//                               const newValue = checked
//                                 ? [...value, type.id]
//                                 : value.filter((t) => t !== type.id);
//                               onChange(newValue);
//                             }}
//                             disabled={isPending}
//                           />
//                           <Label htmlFor={type.id}>{type.typename}</Label>
//                         </div>
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={user_Product_form.control}
//                 name="CourseProductStatusArray"
//                 render={({ field: { value, onChange } }) => (
//                   <FormItem>
//                     <FormLabel>產品狀態</FormLabel>
//                     <div className="grid gap-2">
//                       {GetStatueDadta.map((status) => (
//                         <div key={status.id} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={status.id}
//                             checked={value.includes(status.id)}
//                             onCheckedChange={(checked) => {
//                               const newValue = checked
//                                 ? [...value, status.id]
//                                 : value.filter((s) => s !== status.id);
//                               onChange(newValue);
//                             }}
//                             disabled={isPending}
//                           />
//                           <Label htmlFor={status.id}>{status.statuename}</Label>
//                         </div>
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             {/* 隱藏字段 */}
//             <FormField
//               control={user_Product_form.control}
//               name="courseId"
//               render={({ field }) => (
//                 <FormItem hidden>
//                   <FormControl>
//                     <Input {...field} value={field.value || ""} type="hidden" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* 提交按鈕 */}
//             <div className="col-span-2">
//               <Button
//                 type="submit"
//                 disabled={isPending || !selectedCourseId}
//                 className="w-full md:w-auto"
//               >
//                 {isPending ? "正在提交..." : "提交"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Create_SpecialCourse_Product_Form;