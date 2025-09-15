"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { EditProductSchema } from "@/app/actions/Edit/Edit_AdminProduct/schema";
import { EditProductAction } from "@/app/actions/Edit/Edit_AdminProduct";

// Define interfaces for API responses
interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  Producted:boolean;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

interface ProductType {
  typename: string;
}

interface ProductStatus {
  statuename: string;
}

const EditProductForm = () => {
  const params = useParams();
  const router = useRouter();
  const ProductId = params.ProductId as string;
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [productStatuses, setProductStatuses] = useState<string[]>([]);

  const form = useForm<z.infer<typeof EditProductSchema>>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      productId: ProductId,
      title: "",
      description: "",
      price: 0,
      real_price: 0,
      IsPublic: false,
      CoursePorductTypeArray: [],
      CoursePorductStatueArray: [],
    },
  });

  // Fetch product data and types/statuses
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`/api/product/Get_Product_Lists_by_ID/${ProductId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data: ProductData = await res.json();
        form.reset({
          productId: data.id,
          title: data.title,
          description: data.description,
          price: data.price,
          real_price: data.real_price,
          IsPublic: data.IsPublic,
          CoursePorductTypeArray: data.CoursePorductTypeArray,
          CoursePorductStatueArray: data.CoursePorductStatueArray,
        });
      } catch {
        toast.error("無法載入產品數據");
      }
    };

    const fetchProductTypesAndStatuses = async () => {
      try {
        const [typesRes, statusesRes] = await Promise.all([
          fetch("/api/Type/Get_Type_Lists"),
          fetch("/api/Status/Get_Status_Lists"),
        ]);
        const typesData: ProductType[] = await typesRes.json();
        const statusesData: ProductStatus[] = await statusesRes.json();
        setProductTypes(typesData.map((type) => type.typename));
        setProductStatuses(statusesData.map((status) => status.statuename));
      } catch {
        toast.error("無法載入產品類型或狀態");
      }
    };

    fetchProductData();
    fetchProductTypesAndStatuses();
  }, [ProductId, form]);

  const onSubmit = async (values: z.infer<typeof EditProductSchema>) => {
    try {
      const result = await EditProductAction(values);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("產品更新成功");
        router.push("/admin/ProductLists");
      }
    } catch {
      toast.error("更新產品時發生錯誤");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">編輯產品</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="輸入產品標題" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="輸入產品描述" rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>價格</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="輸入價格"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="real_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>實際價格</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="輸入實際價格"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="IsPublic"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>公開產品</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CoursePorductTypeArray"
            render={({ field }) => (
              <FormItem>
                <FormLabel>產品類型</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    {productTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={field.value.includes(type)}
                          onCheckedChange={(checked) => {
                            const updatedTypes = checked
                              ? [...field.value, type]
                              : field.value.filter((t) => t !== type);
                            field.onChange(updatedTypes);
                          }}
                        />
                        <label htmlFor={`type-${type}`}>{type}</label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CoursePorductStatueArray"
            render={({ field }) => (
              <FormItem>
                <FormLabel>產品狀態</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    {productStatuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={field.value.includes(status)}
                          onCheckedChange={(checked) => {
                            const updatedStatuses = checked
                              ? [...field.value, status]
                              : field.value.filter((s) => s !== status);
                            field.onChange(updatedStatuses);
                          }}
                        />
                        <label htmlFor={`status-${status}`}>{status}</label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/productLists")}
            >
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProductForm;