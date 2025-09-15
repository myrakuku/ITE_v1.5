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
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import DatePicker from "react-multi-date-picker";
// import { useParams, useRouter } from "next/navigation";
// import { EditTeacherHolidayAction } from "@/app/actions/Edit/Edit_TeacherHoliday";
// import { EditTeacherHolidaySchema } from "@/app/actions/Edit/Edit_TeacherHoliday/schema";

// interface TeacherHoliday {
//   id: string;
//   date: string[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// const EditTeacherHolidayForm = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const params = useParams();
//   console.log("params : ", params, " -- End -- ");
//   const Teacherid = params.Teacherid as string;
//   const Teacherholidaysid = params.teacherholidaysid as string;
//   const [getTeacherHoliday, setGetTeacherHoliday] = useState<TeacherHoliday | null>(null);

//   useEffect(() => {
//     const fetchTeacherHoliday = async (Teacherholidaysid: string) => {
//       try {
//         const res = await fetch(`/api/Holiday/Get_TeacherHoliday_Lists_by_Id/${Teacherholidaysid}`);
//         if (!res.ok) {
//           throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
//         }
//         const data = await res.json();
//         setGetTeacherHoliday(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchTeacherHoliday(Teacherholidaysid);
//   }, [Teacherholidaysid]);

//   const Edit_teacher_holiday_form = useForm<z.infer<typeof EditTeacherHolidaySchema>>({
//     resolver: zodResolver(EditTeacherHolidaySchema),
//     defaultValues: {
//       TeacherId: Teacherholidaysid,
//       date: [],
//     },
//   });

//   // 當 getTeacherHoliday 更新時，設置表單的 date 值
//   useEffect(() => {
//     if (getTeacherHoliday && getTeacherHoliday.date) {
//       Edit_teacher_holiday_form.reset({
//         TeacherId: Teacherholidaysid,
//         date: getTeacherHoliday.date,
//       });
//     }
//   }, [getTeacherHoliday, Edit_teacher_holiday_form, Teacherholidaysid]);

//   const Edit_teacher_holiday_form_onSubmit = (values: z.infer<typeof EditTeacherHolidaySchema>) => {
//     console.log("-- holiday輸入數據 -- :", values, "-- 結束 --");
//     startTransition(async () => {
//       try {
//         const result = await EditTeacherHolidayAction(values);
//         if (!result.error) {
//           router.push(`/teacher/${Teacherid}/calendar`);
//         } else {
//           console.error("提交失敗:", result.error);
//           Edit_teacher_holiday_form.setError("root", {
//             type: "manual",
//             message: result.error || "提交失敗，請重試",
//           });
//         }
//       } catch (error) {
//         console.error("提交時發生錯誤:", error);
//         Edit_teacher_holiday_form.setError("root", {
//           type: "manual",
//           message: "提交失敗，請重試",
//         });
//       }
//     });
//   };

//   console.log("-- getTeacherHoliday -- : ", getTeacherHoliday, " -- END -- ");
//   console.log("-- BUG -- : ", Edit_teacher_holiday_form.formState.errors, " -- END -- ");

//   return (
//     <Form {...Edit_teacher_holiday_form}>
//       <form onSubmit={Edit_teacher_holiday_form.handleSubmit(Edit_teacher_holiday_form_onSubmit)}>
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={Edit_teacher_holiday_form.control}
//             name="date"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>選擇假期日期</FormLabel>
//                 <FormControl>
//                   <DatePicker
//                     value={field.value}
//                     onChange={(dates) => {
//                       const formattedDates = dates
//                         ? dates.map((date: any) => date.format("YYYY-MM-DD"))
//                         : [];
//                       field.onChange(formattedDates);
//                     }}
//                     multiple
//                     format="YYYY-MM-DD"
//                     placeholder="選擇日期"
//                     className="w-full"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit" disabled={isPending} className="mt-4">
//           {isPending ? "提交中..." : "提交"}
//         </Button>
//         {Edit_teacher_holiday_form.formState.errors.root && (
//           <p className="text-red-500 mt-2">{Edit_teacher_holiday_form.formState.errors.root.message}</p>
//         )}
//       </form>
//     </Form>
//   );
// };

// export default EditTeacherHolidayForm;

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
import DatePicker, { DateObject } from "react-multi-date-picker";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { EditTeacherHolidayAction } from "@/app/actions/Edit/Edit_TeacherHoliday";
import { EditTeacherHolidaySchema } from "@/app/actions/Edit/Edit_TeacherHoliday/schema";

interface TeacherHoliday {
  id: string;
  date: string[];
  createdAt?: string;
  updatedAt?: string;
}

const EditTeacherHolidayForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.Teacherid as string;
  const teacherHolidayId = params.teacherholidaysid as string;
  const [getTeacherHoliday, setGetTeacherHoliday] = useState<TeacherHoliday | null>(null);

  useEffect(() => {
    if (!teacherId || !teacherHolidayId) {
      toast.error("無效的教師 ID 或假期 ID");
      router.push("/teachers");
      return;
    }

    const fetchTeacherHoliday = async () => {
      try {
        const res = await fetch(`/api/Holiday/Get_TeacherHoliday_Lists_by_Id/${teacherHolidayId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setGetTeacherHoliday(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "無法載入假期數據");
      }
    };
    fetchTeacherHoliday();
  }, [teacherId, teacherHolidayId, router]);

  const form = useForm<z.infer<typeof EditTeacherHolidaySchema>>({
    resolver: zodResolver(EditTeacherHolidaySchema),
    defaultValues: {
      teacherId,
      date: [],
    },
  });

  useEffect(() => {
    if (getTeacherHoliday && getTeacherHoliday.date) {
      form.reset({
        teacherId,
        date: getTeacherHoliday.date,
      });
    }
  }, [getTeacherHoliday, form, teacherId, teacherHolidayId]);

  const onSubmit = (values: z.infer<typeof EditTeacherHolidaySchema>) => {
    startTransition(async () => {
      try {
        const result = await EditTeacherHolidayAction(values);
        if (!result.error) {
          toast.success("教師假期更新成功");
          router.push(`/teacher/${teacherId}/calendar`);
        } else {
          toast.error(result.error);
          form.setError("root", {
            type: "manual",
            message: result.error,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "提交失敗，請重試";
        toast.error(errorMessage);
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    });
  };

  return (
    <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">選擇假期日期</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value.map((date) => new Date(date))}
                      onChange={(dates: DateObject[]) => {
                        const formattedDates = dates
                          ? dates.map((date) => date.format("YYYY-MM-DD"))
                          : [];
                        field.onChange(formattedDates);
                      }}
                      multiple
                      format="YYYY-MM-DD"
                      disabled={isPending}
                      inputClass="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md w-full focus:border-gray-500"
                      aria-label="假期日期"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors.root && (
            <div className="bg-red-600 text-white px-3 py-2 rounded-md">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700 text-white"
          >
            {isPending ? "提交中..." : "提交"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditTeacherHolidayForm;