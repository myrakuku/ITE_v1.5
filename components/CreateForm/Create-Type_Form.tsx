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
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { CreateTypeAction } from "@/app/actions/Create/Create_Type";
import { CreateSTypeSchema } from "@/app/actions/Create/Create_Type/schema";
import { useSession } from "next-auth/react";

interface GetTeacher {
  id: string;
  username: string;
  password: string;
  phone: string;
  name: string;
  role: string;
}

const CreateTypeForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  console.log("params : ", params);
  const TeacherId = params.Teacherid as string;
  const [GetTeacherData, setGetTeacherData] = useState<GetTeacher | null>(null);
  const { data: session } = useSession();
  console.log("session : ", session, "-- End --");
  console.log("id : ", session?.user?.id, "-- End --");
  const UserId = session?.user?.id || "";

  useEffect(() => {
    const fetchTeacherData = async (UserId: string) => {
      const response = await fetch(`/api/user/Get_User_Lists_by_Id/${UserId}`);
      const data = await response.json();
      setGetTeacherData(data);
    };
    fetchTeacherData(UserId);
  }, [UserId]);

  console.log("GetTeacherData : ", GetTeacherData, "-- End --");

  const UserRole = GetTeacherData?.role || "";
  console.log("UserRole : ", UserRole, "-- End --");

  const statue_form = useForm<z.infer<typeof CreateSTypeSchema>>({
    resolver: zodResolver(CreateSTypeSchema),
    defaultValues: {
      typename: "",
      author: "",
      role: "",
    },
  });

  statue_form.setValue("role", UserRole);
  statue_form.setValue("author", UserRole);

  const statue_form_onSubmit = (values: z.infer<typeof CreateSTypeSchema>) => {
    console.log("-- holiday輸入數據 -- :", values, "-- 結束 --");
    startTransition(async () => {
      try {
        const result = await CreateTypeAction(values);
        if (!result.error) {
          router.push(`/teacher/${TeacherId}/TypesLists`);
        } else {
          console.error("提交失敗:", result.error);
          statue_form.setError("root", {
            type: "manual",
            message: result.error || "提交失敗，請重試",
          });
        }
      } catch (error) {
        console.error("提交時發生錯誤:", error);
        statue_form.setError("root", {
          type: "manual",
          message: "提交失敗，請重試",
        });
      }
    });
  };

  console.log("Error:", statue_form.formState.errors, "-- End --");

  return (
    <div className="bg-gray-800 rounded-md px-3 py-2 shadow-lg">
      <Form {...statue_form}>
        <form onSubmit={statue_form.handleSubmit(statue_form_onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={statue_form.control}
              name="typename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white">類型</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入類型"
                      type="text"
                      className="bg-gray-700 border-gray-600 text-white px-3 py-2 rounded-md"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>
          {statue_form.formState.errors.root && (
            <div className="bg-red-600 text-white px-3 py-2 rounded-md">
              {statue_form.formState.errors.root.message}
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

export default CreateTypeForm;