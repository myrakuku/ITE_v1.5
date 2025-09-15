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
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";
import { CreateERBSchema } from "@/app/actions/Create/Create_ERB/schema";
import { CreateERBAction } from "@/app/actions/Create/Create_ERB";

const CreateERBForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateERBSchema>>({
    resolver: zodResolver(CreateERBSchema),
    defaultValues: {
      title: "",
      description: "",
      school_name: "",
      time_h: 0,
      time: "",
      teacher: [],
      Ispublic: false,
      // date_start: "",
      // date_end: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CreateERBSchema>) => {
    startTransition(() => {
      CreateERBAction(values).then((result) => {
        if (result.data) {
          toast.success("ERB 創建成功");
          form.reset();
        } else {
          toast.error(result.error || "創建 ERB 失敗，請稍後重試");
        }
      });
    });
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">創建 ERB</h1>
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
                        placeholder="輸入標題"
                        type="text"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="標題"
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
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入描述"
                        type="text"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="描述"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="school_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">學校名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入學校名稱"
                        type="text"
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="學校名稱"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="date_start"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white">開始日期</FormLabel>
                    <FormControl>
                      <Controller
                        name="date_start"
                        control={form.control}
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            value={value ? new Date(value) : null}
                            format="YYYY-MM-DD"
                            onChange={(date) => {
                              const isoDate = date ? date.format("YYYY-MM-DD") : null;
                              onChange(isoDate);
                            }}
                            disabled={isPending}
                            inputClass="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-full p-2 rounded-md"
                            aria-label="開始日期"
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_end"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white">結束日期</FormLabel>
                    <FormControl>
                      <Controller
                        name="date_end"
                        control={form.control}
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            value={value ? new Date(value) : null}
                            format="YYYY-MM-DD"
                            onChange={(date) => {
                              const isoDate = date ? date.format("YYYY-MM-DD") : null;
                              onChange(isoDate);
                            }}
                            disabled={isPending}
                            inputClass="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-full p-2 rounded-md"
                            aria-label="結束日期"
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="time_h"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">時數</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="輸入時數"
                        type="number"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value || ""}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="時數"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-white">時間</FormLabel>
                    <FormControl>
                      <Controller
                        name="time"
                        control={form.control}
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            value={value ? new Date(`1970-01-01T${value}`) : null}
                            onChange={(date) =>
                              onChange(date ? date.format("HH:mm:ss") : null)
                            }
                            // @ts-expect-error onlyTimePicker 型別未定義
                            onlyTimePicker
                            format="HH:mm:ss"
                            plugins={[<TimePicker key="time-picker" position="bottom" />]}
                            disabled={isPending}
                            inputClass="bg-gray-700 text-white border-gray-600 focus:border-gray-500 w-full p-2 rounded-md"
                            aria-label="時間"
                          />
                        )}
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
                        placeholder="輸入教師名稱"
                        type="text"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t.length > 0)
                          )
                        }
                        value={field.value.join(", ")}
                        className="bg-gray-700 text-white border-gray-600 focus:border-gray-500"
                        aria-label="教師名稱"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Ispublic"
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
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              提交
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateERBForm;