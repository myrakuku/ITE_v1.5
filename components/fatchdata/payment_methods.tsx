

// "use client";

// import { Checkbox } from "@/components/ui/checkbox";
// import { FormLabel, FormMessage } from "@/components/ui/form";
// import { Control, FieldValues, Path } from "react-hook-form";
// import { useEffect, useState } from "react";
// import { toast } from "sonner"; // 新增 toast 導入以增強錯誤處理

// interface PaymentMethods {
//   id: string;
//   payment_method: string;
// }

// interface PaymentMethodsData<T extends FieldValues> {
//   control: Control<T, any>;
//   name: Path<T>;
//   value: string[] | undefined; // 更新為允許 undefined
//   onChange: (value: string[]) => void;
//   disabled?: boolean;
// }

// export const Payment_Methods_checkbox = <T extends FieldValues>({
//   field,
// }: {
//   field: PaymentMethodsData<T>;
// }) => {
//   const [getPaymentMethodsData, setGetPaymentMethodsData] = useState<PaymentMethods[]>();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | undefined>();

//   useEffect(() => {
//     const fetchPaymentMethodsData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/paymentMethods");
//         if (!response.ok) {
//           throw new Error("無法載入付款方式");
//         }
//         const data = await response.json();
//         setGetPaymentMethodsData(data);
//       } catch (error: unknown) {
//         console.error("載入錯誤:", error);
//         const errorMessage = error instanceof Error ? error.message : "無法載入付款方式";
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPaymentMethodsData();
//   }, []);

//   if (loading) {
//     return <div className="text-[#e7915b]">正在加載付款方式...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   if (!getPaymentMethodsData?.length) {
//     return <div className="text-red-500">無可用的付款方式</div>;
//   }

//   // 確保 field.value 不為 undefined
//   const currentValue = field.value ?? [];

//   return (
//     <div className="space-y-4">
//       <FormLabel className="text-base text-[#e7915b]">付款方式</FormLabel>
//       {getPaymentMethodsData.map((data) => (
//         <div key={data.id} className="flex flex-row items-start space-x-3 space-y-0">
//           <Checkbox
//             id={data.id}
//             checked={currentValue.includes(data.payment_method)}
//             onCheckedChange={(checked) => {
//               const newValue = checked
//                 ? [...currentValue, data.payment_method]
//                 : currentValue.filter((item) => item !== data.payment_method);
//               field.onChange(newValue);
//             }}
//             disabled={field.disabled}
//             className="border-[#e7915b] data-[state=checked]:bg-[#e7915b] data-[state=checked]:border-[#e7915b]"
//           />
//           <FormLabel htmlFor={data.id} className="text-gray-900">
//             {data.payment_method}
//           </FormLabel>
//         </div>
//       ))}
//       <FormMessage className="text-red-500" />
//     </div>
//   );
// };


"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentMethods {
  id: string;
  payment_method: string;
}

interface PaymentMethodsData<T extends FieldValues> {
  control: Control<T, unknown>; // 將 any 改為 unknown
  name: Path<T>;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export const Payment_Methods_checkbox = <T extends FieldValues>({
  field,
}: {
  field: PaymentMethodsData<T>;
}) => {
  const [getPaymentMethodsData, setGetPaymentMethodsData] = useState<PaymentMethods[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchPaymentMethodsData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/paymentMethods");
        if (!response.ok) {
          throw new Error("無法載入付款方式");
        }
        const data = await response.json();
        setGetPaymentMethodsData(data);
      } catch (error: unknown) {
        console.error("載入錯誤:", error);
        const errorMessage = error instanceof Error ? error.message : "無法載入付款方式";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentMethodsData();
  }, []);

  if (loading) {
    return <div className="text-[#e7915b]">正在加載付款方式...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!getPaymentMethodsData?.length) {
    return <div className="text-red-500">無可用的付款方式</div>;
  }

  // 確保 field.value 不為 undefined
  const currentValue = field.value ?? [];

  return (
    <div className="space-y-4">
      <FormLabel className="text-base text-[#e7915b]">付款方式</FormLabel>
      {getPaymentMethodsData.map((data) => (
        <div key={data.id} className="flex flex-row items-start space-x-3 space-y-0">
          <Checkbox
            id={data.id}
            checked={currentValue.includes(data.payment_method)}
            onCheckedChange={(checked) => {
              const newValue = checked
                ? [...currentValue, data.payment_method]
                : currentValue.filter((item) => item !== data.payment_method);
              field.onChange(newValue);
            }}
            disabled={field.disabled}
            className="border-[#e7915b] data-[state=checked]:bg-[#e7915b] data-[state=checked]:border-[#e7915b]"
          />
          <FormLabel htmlFor={data.id} className="text-gray-900">
            {data.payment_method}
          </FormLabel>
        </div>
      ))}
      <FormMessage className="text-red-500" />
    </div>
  );
};