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
// import { useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { useParams, useRouter } from "next/navigation";


// import { CreateBillSchema } from "@/app/actions/Create/Create_Bill/schema";
// import { CreateBillAction } from "@/app/actions/Create/Create_Bill";


// const CreateBillForm = () => { 
//     const [isPending, startTransition] = useTransition();
//     const router = useRouter();   
//     const params = useParams();
//     console.log("params : ",  params)



//       const bill_form = useForm<z.infer<typeof CreateBillSchema>>({
//         resolver: zodResolver(CreateBillSchema),
//         defaultValues: {
//             client_name: "",
//             title: "",
//             description: "",
//             price: 0,
//             total: 0,
//             date: "",
//         },
//       });

//         const bill_form_onSubmit = (values: z.infer<typeof CreateBillSchema>) => {
//           console.log("-- Bill輸入數據 -- :", values, "-- 結束 --");
//         };



// console.log("Error:",bill_form.formState.errors,"-- End --" )

//           return (
//             <Form {...bill_form}>
//               <form onSubmit={bill_form.handleSubmit(bill_form_onSubmit)}>
//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="client_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>學生名字</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="學生名字"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>標題</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="標題"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//                     <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>內容</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="內容"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//                     <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>債錢</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="債錢"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//                     <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="total"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>總數</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="總數"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>


//         <div className="grid grid-cols-2 gap-4">
//             <FormField
//               control={bill_form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>日子</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="日子"
//                       type="text"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>


//                 <Button type="submit" disabled={isPending} className="mt-4">
//                   {isPending ? "提交中..." : "提交"}
//                 </Button>
//                 {bill_form.formState.errors.root && (
//                   <p className="text-red-500 mt-2">{bill_form.formState.errors.root.message}</p>
//                 )}
//               </form>
//             </Form>
//           );
    
// };

// export default CreateBillForm;

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
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateBillSchema } from "@/app/actions/Create/Create_Bill/schema";
import { CreateBillAction } from "@/app/actions/Create/Create_Bill";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  username: string;
  role: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

const CreateBillForm = () => {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const router = useRouter();

  // 獲取用戶數據
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/Get_User_Lists");
        if (!response.ok) throw new Error("無法獲取用戶數據");
        const data = await response.json();
        const filteredData = data.filter((user: User) => user.role === "USER");
        setUsers(filteredData);
        setFilteredUsers(filteredData);
      } catch (error) {
        console.error("獲取用戶數據失敗:", error);
        toast.error("無法獲取用戶數據，請稍後重試。", {
          description: "錯誤",
        });
      }
    };
    fetchUsers();
  }, []);

  // 獲取商品數據
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/Get_Product_Lists");
        if (!response.ok) throw new Error("無法獲取商品數據");
        const data = await response.json();
        console.log("API 商品數據:", data); // 記錄原始 API 響應
        const sanitizedData = data.map((product: Product) => ({
          ...product,
          real_price: Number(product.real_price), // 確保 real_price 為數字
        }));
        setProducts(sanitizedData);
        setFilteredProducts(sanitizedData);
      } catch (error) {
        console.error("獲取商品數據失敗:", error);
        toast.error("無法獲取商品數據，請稍後重試。", {
          description: "錯誤",
        });
      }
    };
    fetchProducts();
  }, []);

  // 用戶搜尋功能
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.username.toLowerCase().includes(userSearch.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userSearch, users]);

  // 商品搜尋功能
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(productSearch.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [productSearch, products]);

  // 表單初始化
  const bill_form = useForm<z.infer<typeof CreateBillSchema>>({
    resolver: zodResolver(CreateBillSchema),
    defaultValues: {
      client_name: "",
      title: "",
      description: "",
      total: 0,
      date: new Date().toISOString().split("T")[0],
      client_id: "",
      products: [],
    },
  });

  // 計算總金額並更新產品列表
  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      if (typeof product.real_price !== "number" || isNaN(product.real_price)) {
        console.error(`無效的 real_price，產品 ${product.title}：`, product.real_price);
        return sum;
      }
      return sum + product.real_price;
    }, 0);

    const products = selectedProducts
      .filter((product) => product.title && product.description && typeof product.real_price === "number" && !isNaN(product.real_price))
      .map((product) => ({
        title: product.title,
        description: product.description,
        price: product.real_price,
      }));

    bill_form.setValue("total", total);
    bill_form.setValue("products", products);

    if (products.length === 0) {
      console.warn("未選擇有效產品");
    }
  }, [selectedProducts, bill_form]);

  // 提交表單
  const bill_form_onSubmit = (values: z.infer<typeof CreateBillSchema>) => {
    if (selectedProducts.length === 0) {
      toast.error("請至少選擇一個商品。", {
        description: "錯誤",
      });
      return;
    }

    startTransition(async () => {
      try {
        const submitData = {
          ...values,
          products: selectedProducts.map((product) => ({
            title: product.title,
            description: product.description,
            price: product.real_price,
          })),
        };
        const result = await CreateBillAction(submitData);
        if (result.data) {
          toast.success("帳單已成功創建！", {
            description: "成功",
          });
          router.push("/admin/Accounts");
        } else {
          toast.error(result.error || "建立帳單失敗，請稍後重試。", {
            description: "錯誤",
          });
        }
      } catch (error) {
        console.error("建立帳單失敗:", error);
        toast.error("建立帳單失敗，請稍後重試。", {
          description: "錯誤",
        });
      }
    });
  };

  // 添加商品到列表
  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  // 移除商品
  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  console.log("bug : ", bill_form.formState.errors ,"-- End --")

  return (
    <Form {...bill_form}>
      <form onSubmit={bill_form.handleSubmit(bill_form_onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="client_name"
            render={() => (
              <FormItem>
                <FormLabel>學生名字</FormLabel>
                <Input
                  placeholder="搜尋學生名字或用戶名"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="mb-2"
                />
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      const selectedUser = users.find((user) => user.id === value);
                      if (selectedUser) {
                        bill_form.setValue("client_name", selectedUser.name || selectedUser.username);
                        bill_form.setValue("client_id", selectedUser.id);
                      }
                    }}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇學生" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>標題</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="標題" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>內容</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="內容" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

<div>
  <Dialog>
    <DialogTrigger asChild>
      <Button type="button" disabled={isPending}>
        加入商品
      </Button>
    </DialogTrigger>
    <DialogContent className="w-full max-w-[95vw] sm:max-w-3xl lg:max-w-4xl">
      <DialogHeader>
        <DialogTitle>選擇商品</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          placeholder="搜尋商品標題或描述"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          className="w-full"
        />

            <textarea name="" id=""></textarea>

<div className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/4">標題</TableHead>
        <TableHead className="w-1/3 hidden md:table-cell">描述</TableHead>
        <TableHead className="w-1/6">價格</TableHead>
        <TableHead className="w-1/6">實際價格</TableHead>
        <TableHead className="w-1/6 text-right">操作</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredProducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell className="w-1/4">{product.title}</TableCell>
          <TableCell className="w-1/3 hidden md:table-cell">
            <textarea
              value={product.description}
              readOnly
              className="w-full max-w-[200px] h-16 resize-none border-none bg-transparent p-2 text-sm"
              aria-label={`商品 ${product.title} 的描述`}
            />
          </TableCell>
          <TableCell className="w-1/6">HK${product.price.toFixed(2)}</TableCell>
          <TableCell className="w-1/6">HK${product.real_price.toFixed(2)}</TableCell>
          <TableCell className="w-1/6 text-right">
            <Button
              type="button"
              onClick={() => handleAddProduct(product)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              加入
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
        {/* 行動設備上的卡片式佈局 */}
        <div className="md:hidden space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <div className="font-semibold">{product.title}</div>
              <div className="text-sm text-gray-600">{product.description}</div>
              <div className="mt-2">
                <span className="text-sm">價格: HK${product.price.toFixed(2)}</span>
                <span className="ml-4 text-sm">實際價格: HK${product.real_price.toFixed(2)}</span>
              </div>
              <Button
                type="button"
                onClick={() => handleAddProduct(product)}
                disabled={isPending}
                className="mt-2 w-full"
              >
                加入
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
</div>
        <div>
          <h3 className="text-lg font-semibold mb-2">已選擇的商品</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>標題</TableHead>
                {/* <TableHead>描述</TableHead> */}
                <TableHead>實際價格</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.title}</TableCell>
                  {/* <TableCell>{product.description}</TableCell> */}
                  <TableCell>HK${product.real_price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                      disabled={isPending}
                    >
                      刪除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>總數</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="總數"
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={bill_form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>日子</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-4">
          {isPending ? "提交中..." : "建立單據"}
        </Button>
        {Object.keys(bill_form.formState.errors).length > 0 && (
          <div className="mt-4 p-4 border border-red-500 rounded">
            <h4 className="text-red-500 font-semibold">表單錯誤：</h4>
            <pre>{JSON.stringify(bill_form.formState.errors, null, 2)}</pre>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CreateBillForm;