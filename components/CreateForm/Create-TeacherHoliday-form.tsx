// "use client";

// import { CreateTeacherHolidaySchema } from "@/app/actions/Create/Create_TeacherHoliday/schema";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {  useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import DatePicker from "react-multi-date-picker";
// import { CreateTeacherHolidayAction } from "@/app/actions/Create/Create_TeacherHoliday";
// import { useParams, useRouter } from "next/navigation";

// const CreateTeacherHolidayForm = () => {
//   const [isPending, startTransition] = useTransition();
//   const router = useRouter();
//   const params = useParams();
//   console.log("params : ",params, " -- End -- ")
//   const Teacherid = params.Teacherid as string ;





//   const teacher_holiday_form = useForm<z.infer<typeof CreateTeacherHolidaySchema>>({
//     resolver: zodResolver(CreateTeacherHolidaySchema),
//     defaultValues: {
//       TeacherId: Teacherid,
//       date: [],
//     },
//   });

//   const teacher_holiday_form_onSubmit = (values: z.infer<typeof CreateTeacherHolidaySchema>) => {
//     console.log("-- holiday輸入數據 -- :", values, "-- 結束 --");
//     startTransition(async () => {
//       try {
//         const result = await CreateTeacherHolidayAction(values);
//         // 檢查是否有錯誤
//         if (!result.error) {
//           router.push(`/teacher/${Teacherid}/calendar`); // 無錯誤表示成功，導航
//         } else {
//           console.error("提交失敗:", result.error);
//           teacher_holiday_form.setError("root", {
//             type: "manual",
//             message: result.error || "提交失敗，請重試",
//           });
//         }
//       } catch (error) {
//         console.error("提交時發生錯誤:", error);
//         teacher_holiday_form.setError("root", {
//           type: "manual",
//           message: "提交失敗，請重試",
//         });
//       }
//     });
//   };

//   console.log("-- BUG -- : ", teacher_holiday_form.formState.errors, " -- END -- ");

//   return (
//     <Form {...teacher_holiday_form}>
//       <form onSubmit={teacher_holiday_form.handleSubmit(teacher_holiday_form_onSubmit)}>
//         <div className="grid grid-cols-2 gap-4">
//           <FormField
//             control={teacher_holiday_form.control}
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
//         {teacher_holiday_form.formState.errors.root && (
//           <p className="text-red-500 mt-2">{teacher_holiday_form.formState.errors.root.message}</p>
//         )}
//       </form>
//     </Form>
//   );
// };

// export default CreateTeacherHolidayForm;



"use client";

import { CreateTeacherHolidaySchema } from "@/app/actions/Create/Create_TeacherHoliday/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { toast } from "react-toastify";
import { CreateTeacherHolidayAction } from "@/app/actions/Create/Create_TeacherHoliday";
import { useParams, useRouter } from "next/navigation";

const CreateTeacherHolidayForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.Teacherid as string;

  useEffect(() => {
    if (!teacherId) {
      toast.error("無效的教師 ID");
      router.push("/teachers");
    }
  }, [teacherId, router]);

  const form = useForm<z.infer<typeof CreateTeacherHolidaySchema>>({
    resolver: zodResolver(CreateTeacherHolidaySchema),
    defaultValues: {
      TeacherId : teacherId,
      date: [],
    },
  });

  const onSubmit = (values: z.infer<typeof CreateTeacherHolidaySchema>) => {
    startTransition(async () => {
      try {
        const result = await CreateTeacherHolidayAction(values);
        if (!result.error) {
          toast.success("教師假期創建成功");
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
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">創建教師假期</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">選擇假期日期</FormLabel>
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
                        inputClass="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-full p-2 rounded-md"
                        aria-label="假期日期"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.root && (
              <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
            )}
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

export default CreateTeacherHolidayForm;