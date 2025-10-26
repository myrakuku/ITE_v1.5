// "use client";

// import * as z from "zod";
// import { useState, useEffect, useTransition } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { toast } from "sonner"; // 新增 toast 導入
// import { Invoice_Create_Schema } from "@/app/actions/Create/Create_Invoice/schema";
// import { createInvoice_action } from "@/app/actions/Create/Create_Invoice";
// import { Payment_Methods_checkbox } from "../fatchdata/payment_methods";

// interface ProductData {
//   id: string;
//   description: string;
//   price: number;
//   stock: number;
//   product_price_record_id: string;
//   name: string;
// }

// interface StudentData {
//   id: string;
//   name: string;
//   school: string;
//   grade: number;
//   student_parent_data_id: string;
//   Parent_data?: {
//     username: string;
//     nickname: string;
//   };
// }

// const Invoice_Create_Form = () => {
//   const [isPending, startTransition] = useTransition();
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [GetproductData, setGetproductData] = useState<ProductData[]>([]);
//   const [showProductList, setShowProductList] = useState(false);
//   const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);
//   const [GetStudent, setGetStudent] = useState<StudentData[]>([]);
//   const [showStudentList, setShowStudentList] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState<boolean>(true);

//   // Fetch product and student data
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [productResponse, studentResponse] = await Promise.all([
//           fetch("/api/Product_Lists"),
//           fetch("/api/student/Student_AllLists"),
//         ]);

//         if (!productResponse.ok) {
//           throw new Error("無法載入產品資料");
//         }
//         const productData = await productResponse.json();
//         const transformedProductData = productData.map((product: ProductData) => ({
//           ...product,
//           price: Number(product.price),
//         }));
//         setGetproductData(transformedProductData);

//         if (!studentResponse.ok) {
//           throw new Error("無法載入學生資料");
//         }
//         const studentData = await studentResponse.json();
//         setGetStudent(studentData);
//       } catch (error: unknown) {
//         console.error("載入錯誤:", error);
//         setError(error instanceof Error ? error.message : "無法載入資料");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const invoice_create_form = useForm<z.infer<typeof Invoice_Create_Schema>>({
//     resolver: zodResolver(Invoice_Create_Schema),
//     defaultValues: {
//       title: "",
//       content: [],
//       studentname: "",
//       student_id: "",
//       price: 0,
//       PaymentMethods: [],
//       Invoice_id: "",
//       servetype: "",
//       DB: 0,
//       adminFee: 0,
//     },
//   });

//   // Update form content and price
//   useEffect(() => {
//     const content = selectedProducts.map(
//       (product) => `${product.name} | 價格: ${product.price} | 庫存: ${product.stock}`
//     );
//     const totalPrice = selectedProducts.reduce((sum, product) => sum + Number(product.price), 0);
//     invoice_create_form.setValue("content", content, { shouldValidate: true });
//     invoice_create_form.setValue("price", totalPrice, { shouldValidate: true });
//   }, [selectedProducts, invoice_create_form]);

//   const handleAddProduct = (product: ProductData) => {
//     setSelectedProducts((prev) => {
//       if (prev.some((p) => p.id === product.id)) {
//         return prev;
//       }
//       return [...prev, product];
//     });
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((product) => product.id !== productId));
//   };

//   const handleSelectStudent = (student: StudentData) => {
//     invoice_create_form.setValue("studentname", student.name, { shouldValidate: true });
//     invoice_create_form.setValue("student_id", student.id, { shouldValidate: true });
//     setShowStudentList(false);
//     setSearchTerm("");
//   };

//   const filteredStudents = GetStudent.filter((student) =>
//     [
//       student.name,
//       student.school,
//       String(student.grade),
//       student.Parent_data?.username || "",
//       student.Parent_data?.nickname || "",
//     ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const invoice_create_form_onSubmit = (values: z.infer<typeof Invoice_Create_Schema>) => {
//     console.log("-- create invoice -- : ", values, "-- End --");
//     setError("");
//     setSuccess("");
//     startTransition(() => {
//       createInvoice_action(values).then((result) => {
//         if (result.data) {
//           setSuccess("發票創建成功");
//           toast.success("發票創建成功"); // 使用 toast 顯示成功訊息
//           invoice_create_form.reset();
//           setSelectedProducts([]); // 清空已選產品
//         } else {
//           setError(result.error || "創建發票失敗");
//           toast.error(result.error || "創建發票失敗"); // 使用 toast 顯示錯誤
//         }
//       });
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center">
//         <p className="text-[#e7915b] text-lg">正在加載...</p>
//       </div>
//     );
//   }

//   if (error && !GetproductData.length && !GetStudent.length) {
//     return (
//       <div className="flex justify-center items-center">
//         <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-2xl mx-auto">
//       <h2 className="text-xl font-bold tracking-tight text-[#e7915b] mb-6">
//         創建新發票
//       </h2>
//       <Form {...invoice_create_form}>
//         <form
//           onSubmit={invoice_create_form.handleSubmit(invoice_create_form_onSubmit)}
//           className="space-y-6"
//         >
//           {/* <FormSuccess message={success} /> 恢復 FormSuccess */}
//           {error && <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>} {/* 顯示錯誤訊息 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* 標題 */}
//             <FormField
//               control={invoice_create_form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#e7915b] font-medium">標題</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="輸入發票標題"
//                       className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />
//             {/* 商品code碼 */}
//             <FormField
//               control={invoice_create_form.control}
//               name="Invoice_id"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#e7915b] font-medium">商品識別碼</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="輸入商品識別碼"
//                       className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />
//             {/* 學生選擇 */}
//             <div className="relative">
//               <FormField
//                 control={invoice_create_form.control}
//                 name="studentname"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-[#e7915b] font-medium">學生名稱</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         disabled={isPending}
//                         placeholder="點擊選擇學生"
//                         onClick={() => setShowStudentList(true)}
//                         readOnly
//                         className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                       />
//                     </FormControl>
//                     <FormMessage className="text-red-500" />
//                   </FormItem>
//                 )}
//               />
//               {showStudentList && (
//                 <div className="absolute z-10 mt-2 w-full bg-white border border-[#e7915b] rounded-lg shadow-lg max-h-96 overflow-y-auto">
//                   <div className="p-3">
//                     <Input
//                       type="text"
//                       placeholder="搜尋學生（姓名、學校、年級、父母用戶名或暱稱）"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                     />
//                   </div>
//                   {filteredStudents.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="w-full border-collapse">
//                         <thead>
//                           <tr className="bg-[#e7915b] text-white">
//                             <th className="p-3 text-left">姓名</th>
//                             <th className="p-3 text-left">學校</th>
//                             <th className="p-3 text-left">年級</th>
//                             <th className="p-3 text-left">父母用戶名</th>
//                             <th className="p-3 text-left">父母暱稱</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {filteredStudents.map((student) => (
//                             <tr
//                               key={student.id}
//                               className="border-b border-[#e7915b]/20 hover:bg-[#e7915b]/10 cursor-pointer"
//                               onClick={() => handleSelectStudent(student)}
//                             >
//                               <td className="p-3 text-gray-900">{student.name || "無"}</td>
//                               <td className="p-3 text-gray-900">{student.school || "無"}</td>
//                               <td className="p-3 text-gray-900">{student.grade || "無"}</td>
//                               <td className="p-3 text-gray-900">{student.Parent_data?.username || "無"}</td>
//                               <td className="p-3 text-gray-900">{student.Parent_data?.nickname || "無"}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <p className="p-3 text-gray-900 text-center">無匹配學生</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* 價格相關字段 */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <FormField
//               control={invoice_create_form.control}
//               name="price"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#e7915b] font-medium">價錢</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       value={field.value ?? ""}
//                       disabled
//                       placeholder="自動計算價格"
//                       type="number"
//                       className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={invoice_create_form.control}
//               name="DB"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#e7915b] font-medium">折扣價錢</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       value={field.value ?? ""}
//                       placeholder="輸入折扣"
//                       type="number"
//                       disabled={isPending}
//                       className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                       onChange={(e) => field.onChange(Number(e.target.value) || 0)}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={invoice_create_form.control}
//               name="adminFee"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-[#e7915b] font-medium">雜項/行政費</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       value={field.value ?? ""}
//                       placeholder="輸入費用"
//                       type="number"
//                       disabled={isPending}
//                       className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
//                       onChange={(e) => field.onChange(Number(e.target.value) || 0)}
//                     />
//                   </FormControl>
//                   <FormMessage className="text-red-500" />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* 已選產品 */}
//           <div className="bg-white p-4 rounded-lg border border-[#e7915b]/20">
//             <h3 className="text-lg font-semibold text-[#e7915b] mb-3">已選產品</h3>
//             {selectedProducts.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-[#e7915b] text-white">
//                       <th className="p-3 text-left">產品名稱</th>
//                       <th className="p-3 text-left">價格</th>
//                       <th className="p-3 text-left">庫存</th>
//                       <th className="p-3 text-left">操作</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedProducts.map((product) => (
//                       <tr key={product.id} className="border-b border-[#e7915b]/20">
//                         <td className="p-3 text-gray-900">{product.name || "無"}</td>
//                         <td className="p-3 text-gray-900">{product.price ?? "無"}</td>
//                         <td className="p-3 text-gray-900">{product.stock ?? "無"}</td>
//                         <td className="p-3">
//                           <Button
//                             type="button"
//                             variant="destructive"
//                             onClick={() => handleRemoveProduct(product.id)}
//                             disabled={isPending}
//                             className="bg-red-500 hover:bg-red-600 text-white"
//                           >
//                             移除
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-gray-900">尚未選擇產品</p>
//             )}
//           </div>
//           {/* 支付方式 */}
// <div className="bg-white p-4 rounded-lg border border-[#e7915b]/20">
//   <h3 className="text-lg font-semibold text-[#e7915b] mb-3">支付方式</h3>
//   <FormField
//     control={invoice_create_form.control}
//     name="PaymentMethods"
//     render={({ field: { value, onChange, disabled } }) => (
//       <FormItem>
//         <FormControl>
//           <Payment_Methods_checkbox
//             field={{
//               control: invoice_create_form.control,
//               name: "PaymentMethods",
//               value: value ?? [], // 確保傳遞空陣列作為預設值
//               onChange,
//               disabled,
//             }}
//           />
//         </FormControl>
//         <FormMessage className="text-red-500" />
//       </FormItem>
//     )}
//   />
// </div>
//           {/* 產品列表 */}
//           <div className="bg-white p-4 rounded-lg border border-[#e7915b]/20">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold text-[#e7915b]">產品列表</h3>
//               <Button
//                 type="button"
//                 onClick={() => setShowProductList(!showProductList)}
//                 disabled={isPending}
//                 className="bg-[#e7915b] hover:bg-cyan-200 hover:text-gray-900 text-white transition-colors duration-300"
//               >
//                 {showProductList ? "隱藏列表" : "顯示產品列表"}
//               </Button>
//             </div>
//             {showProductList && GetproductData.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-[#e7915b] text-white">
//                       <th className="p-3 text-left">名稱</th>
//                       <th className="p-3 text-left">價格</th>
//                       <th className="p-3 text-left">庫存</th>
//                       <th className="p-3 text-left">操作</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {GetproductData.map((product) => (
//                       <tr key={product.id} className="border-b border-[#e7915b]/20">
//                         <td className="p-3 text-gray-900">{product.name || "無"}</td>
//                         <td className="p-3 text-gray-900">{product.price ?? "無"}</td>
//                         <td className="p-3 text-gray-900">{product.stock ?? "無"}</td>
//                         <td className="p-3">
//                           <Button
//                             type="button"
//                             onClick={() => handleAddProduct(product)}
//                             disabled={
//                               isPending ||
//                               selectedProducts.some((p) => p.id === product.id)
//                             }
//                             className="bg-[#e7915b] hover:bg-cyan-200 hover:text-gray-900 text-white transition-colors duration-300"
//                           >
//                             加入
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : showProductList ? (
//               <p className="text-gray-900">無可用產品</p>
//             ) : null}
//           </div>
//           {/* 表單消息和提交按鈕 */}
//           <div className="flex flex-col space-y-4">
//             {/* <FormSuccess message={success} /> */}
//             {error && <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>}
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="bg-[#e7915b] hover:bg-cyan-200 hover:text-gray-900 text-white w-full md:w-auto self-end transition-colors duration-300 disabled:opacity-50"
//             >
//               {isPending ? "正在提交..." : "創建發票"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default Invoice_Create_Form;



"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { Invoice_Create_Schema } from "@/app/actions/Create/Create_Invoice/schema";
import { createInvoice_action } from "@/app/actions/Create/Create_Invoice";
import { Payment_Methods_checkbox } from "../fatchdata/payment_methods";

interface ProductData {
  id: string;
  description: string;
  price: number;
  stock: number;
  product_price_record_id: string;
  name: string;
}

interface StudentData {
  id: string;
  name: string;
  school: string;
  grade: number;
  student_parent_data_id: string;
  Parent_data?: {
    username: string;
    nickname: string;
  };
}

const Invoice_Create_Form = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [GetproductData, setGetproductData] = useState<ProductData[]>([]);
  const [showProductList, setShowProductList] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductData[]>([]);
  const [GetStudent, setGetStudent] = useState<StudentData[]>([]);
  const [showStudentList, setShowStudentList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch product and student data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productResponse, studentResponse] = await Promise.all([
          fetch("/api/Product_Lists"),
          fetch("/api/student/Student_AllLists"),
        ]);

        if (!productResponse.ok) {
          throw new Error("無法載入產品資料");
        }
        const productData = await productResponse.json();
        const transformedProductData = productData.map((product: ProductData) => ({
          ...product,
          price: Number(product.price),
        }));
        setGetproductData(transformedProductData);

        if (!studentResponse.ok) {
          throw new Error("無法載入學生資料");
        }
        const studentData = await studentResponse.json();
        setGetStudent(studentData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "無法載入資料";
        setError(errorMessage);
        toast.error(errorMessage); // 使用 toast 顯示錯誤
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const invoice_create_form = useForm<z.infer<typeof Invoice_Create_Schema>>({
    resolver: zodResolver(Invoice_Create_Schema),
    defaultValues: {
      title: "",
      content: [],
      studentname: "",
      student_id: "",
      price: 0,
      PaymentMethods: [],
      Invoice_id: "",
      servetype: "",
      DB: 0,
      adminFee: 0,
    },
  });

  // Update form content and price
  useEffect(() => {
    const content = selectedProducts.map(
      (product) => `${product.name} | 價格: ${product.price} | 庫存: ${product.stock}`
    );
    const totalPrice = selectedProducts.reduce((sum, product) => sum + Number(product.price), 0);
    invoice_create_form.setValue("content", content, { shouldValidate: true });
    invoice_create_form.setValue("price", totalPrice, { shouldValidate: true });
  }, [selectedProducts, invoice_create_form]);

  const handleAddProduct = (product: ProductData) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleSelectStudent = (student: StudentData) => {
    invoice_create_form.setValue("studentname", student.name, { shouldValidate: true });
    invoice_create_form.setValue("student_id", student.id, { shouldValidate: true });
    setShowStudentList(false);
    setSearchTerm("");
  };

  const filteredStudents = GetStudent.filter((student) =>
    [
      student.name,
      student.school,
      String(student.grade),
      student.Parent_data?.username || "",
      student.Parent_data?.nickname || "",
    ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const invoice_create_form_onSubmit = (values: z.infer<typeof Invoice_Create_Schema>) => {
    console.log("-- create invoice -- : ", values, "-- End --");
    setError("");
    startTransition(() => {
      createInvoice_action(values).then((result) => {
        if (result.data) {
          toast.success("發票創建成功");
          invoice_create_form.reset();
          setSelectedProducts([]);
        } else {
          const errorMessage = result.error || "創建發票失敗";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      });
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-[#e7915b] text-lg">正在加載...</p>
      </div>
    );
  }

  if (error && !GetproductData.length && !GetStudent.length) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold tracking-tight text-[#e7915b] mb-6">
        創建新發票
      </h2>
      <Form {...invoice_create_form}>
        <form
          onSubmit={invoice_create_form.handleSubmit(invoice_create_form_onSubmit)}
          className="space-y-6"
        >
          {error && <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 標題 */}
            <FormField
              control={invoice_create_form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">標題</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入發票標題"
                      className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {/* 商品code碼 */}
            <FormField
              control={invoice_create_form.control}
              name="Invoice_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">商品識別碼</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="輸入商品識別碼"
                      className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {/* 學生選擇 */}
            <div className="relative">
              <FormField
                control={invoice_create_form.control}
                name="studentname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#e7915b] font-medium">學生名稱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="點擊選擇學生"
                        onClick={() => setShowStudentList(true)}
                        readOnly
                        className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              {showStudentList && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-[#e7915b] rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  <div className="p-3">
                    <Input
                      type="text"
                      placeholder="搜尋學生（姓名、學校、年級、父母用戶名或暱稱）"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                    />
                  </div>
                  {filteredStudents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#e7915b] text-white">
                            <th className="p-3 text-left">姓名</th>
                            <th className="p-3 text-left">學校</th>
                            <th className="p-3 text-left">年級</th>
                            <th className="p-3 text-left">父母用戶名</th>
                            <th className="p-3 text-left">父母暱稱</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr
                              key={student.id}
                              className="border-b border-[#e7915b]/20 hover:bg-[#e7915b]/10 cursor-pointer"
                              onClick={() => handleSelectStudent(student)}
                            >
                              <td className="p-3 text-gray-900">{student.name || "無"}</td>
                              <td className="p-3 text-gray-900">{student.school || "無"}</td>
                              <td className="p-3 text-gray-900">{student.grade || "無"}</td>
                              <td className="p-3 text-gray-900">{student.Parent_data?.username || "無"}</td>
                              <td className="p-3 text-gray-900">{student.Parent_data?.nickname || "無"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-3 text-gray-900 text-center">無匹配學生</p>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* 價格相關字段 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={invoice_create_form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">價錢</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled
                      placeholder="自動計算價格"
                      type="number"
                      className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={invoice_create_form.control}
              name="DB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">折扣價錢</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="輸入折扣"
                      type="number"
                      disabled={isPending}
                      className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={invoice_create_form.control}
              name="adminFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#e7915b] font-medium">雜項/行政費</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="輸入費用"
                      type="number"
                      disabled={isPending}
                      className="border-[#e7915b] focus:border-[#e7915b] focus:ring-[#e7915b] text-gray-900 transition-colors duration-300"
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* 已選產品 */}
          <div className="bg-white p-4 rounded-lg border border-[#e7915b]/20">
            <h3 className="text-lg font-semibold text-[#e7915b] mb-3">已選產品</h3>
            {selectedProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#e7915b] text-white">
                      <th className="p-3 text-left">產品名稱</th>
                      <th className="p-3 text-left">價格</th>
                      <th className="p-3 text-left">庫存</th>
                      <th className="p-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product) => (
                      <tr key={product.id} className="border-b border-[#e7915b]/20">
                        <td className="p-3 text-gray-900">{product.name || "無"}</td>
                        <td className="p-3 text-gray-900">{product.price ?? "無"}</td>
                        <td className="p-3 text-gray-900">{product.stock ?? "無"}</td>
                        <td className="p-3">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleRemoveProduct(product.id)}
                            disabled={isPending}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            移除
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-900">尚未選擇產品</p>
            )}
          </div>
          {/* 支付方式 */}
          <div className="bg-white p-4 rounded-lg border border-[#e7915b]/20">
            <h3 className="text-lg font-semibold text-[#e7915b] mb-3">支付方式</h3>
            <FormField
              control={invoice_create_form.control}
              name="PaymentMethods"
              render={({ field: { value, onChange, disabled } }) => (
                <FormItem>
                  <FormControl>
                    <Payment_Methods_checkbox
                      field={{
                        control: invoice_create_form.control,
                        name: "PaymentMethods",
                        value: value ?? [],
                        onChange,
                        disabled,
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* 產品列表 */}
          <div className="bg-white p-4 rounded-lg border border-[#e7915b]/20">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#e7915b]">產品列表</h3>
              <Button
                type="button"
                onClick={() => setShowProductList(!showProductList)}
                disabled={isPending}
                className="bg-[#e7915b] hover:bg-cyan-200 hover:text-gray-900 text-white transition-colors duration-300"
              >
                {showProductList ? "隱藏列表" : "顯示產品列表"}
              </Button>
            </div>
            {showProductList && GetproductData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#e7915b] text-white">
                      <th className="p-3 text-left">名稱</th>
                      <th className="p-3 text-left">價格</th>
                      <th className="p-3 text-left">庫存</th>
                      <th className="p-3 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GetproductData.map((product) => (
                      <tr key={product.id} className="border-b border-[#e7915b]/20">
                        <td className="p-3 text-gray-900">{product.name || "無"}</td>
                        <td className="p-3 text-gray-900">{product.price ?? "無"}</td>
                        <td className="p-3 text-gray-900">{product.stock ?? "無"}</td>
                        <td className="p-3">
                          <Button
                            type="button"
                            onClick={() => handleAddProduct(product)}
                            disabled={
                              isPending ||
                              selectedProducts.some((p) => p.id === product.id)
                            }
                            className="bg-[#e7915b] hover:bg-cyan-200 hover:text-gray-900 text-white transition-colors duration-300"
                          >
                            加入
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : showProductList ? (
              <p className="text-gray-900">無可用產品</p>
            ) : null}
          </div>
          {/* 表單消息和提交按鈕 */}
          <div className="flex flex-col space-y-4">
            {error && <p className="text-red-500 bg-white p-3 rounded-md">{error}</p>}
            <Button
              disabled={isPending}
              type="submit"
              className="bg-[#e7915b] hover:bg-cyan-200 hover:text-gray-900 text-white w-full md:w-auto self-end transition-colors duration-300 disabled:opacity-50"
            >
              {isPending ? "正在提交..." : "創建發票"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Invoice_Create_Form;