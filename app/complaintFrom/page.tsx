"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import axios, { isAxiosError } from "axios"; // 導入 isAxiosError

// 定義表單數據的TypeScript接口
interface ComplaintFormData {
  appellation: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  complaintTypes: string[];
  complaintOthers?: string;
}

const ComplainFormPage = () => {
  // 使用react-hook-form管理表單
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    defaultValues: {
      complaintTypes: [],
    },
  });

  // 監控"其他"投訴選項是否被選中
  const complaintTypes = watch("complaintTypes");

  // 表單提交處理函數
  const onSubmit: SubmitHandler<ComplaintFormData> = async (data) => {
    try {
      const response = await axios.post("/api/send-complaint-email", data);
      toast.success(response.data.message || "表單已成功提交並發送郵件！");
      console.log("表單數據：", data);
    } catch (error: unknown) {
      console.error("提交表單失敗:", error);
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.error || "提交表單失敗，請稍後重試。"
        );
      } else {
        toast.error("提交表單失敗，請稍後重試。");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* 標題 */}
      <section className="w-48 h-16 flex items-center justify-center">
        <h2 className="text-2xl font-black text-[#001B29]">投訴表格</h2>
      </section>

      {/* 表單 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto mt-10 flex flex-col items-center space-y-6"
      >
        <h3 className="text-xl font-black text-[#001B29]">個人資料</h3>

        {/* 稱謂 */}
        <div className="w-full">
          <p className="text-center mb-2">稱謂*</p>
          <div className="flex justify-center space-x-4">
            {["先生", "太太", "小姐"].map((title) => (
              <label key={title} className="flex items-center space-x-2">
                <input
                  type="radio"
                  value={title}
                  {...register("appellation", { required: "請選擇稱謂" })}
                  className="border-2 border-stone-200 rounded-full w-4 h-4"
                />
                <span>{title}</span>
              </label>
            ))}
          </div>
          {errors.appellation && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.appellation.message}
            </p>
          )}
        </div>

        {/* 姓名 */}
        <div className="w-full">
          <p className="text-center mb-2">姓名*</p>
          <input
            type="text"
            {...register("name", { required: "請輸入姓名" })}
            className="w-full max-w-md mx-auto border-2 border-stone-200 rounded-md p-2"
            placeholder="請輸入姓名"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* 電話號碼 */}
        <div className="w-full">
          <p className="text-center mb-2">電話號碼*</p>
          <input
            type="text"
            {...register("phone", {
              required: "請輸入電話號碼",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "請輸入有效的8位電話號碼",
              },
            })}
            className="w-full max-w-md mx-auto border-2 border-stone-200 rounded-md p-2"
            placeholder="請輸入電話號碼"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* 電郵地址 */}
        <div className="w-full">
          <p className="text-center mb-2">電郵地址*</p>
          <input
            type="email"
            {...register("email", {
              required: "請輸入電郵地址",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "請輸入有效的電郵地址",
              },
            })}
            className="w-full max-w-md mx-auto border-2 border-stone-200 rounded-md p-2"
            placeholder="請輸入電郵地址"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 地址 */}
        <div className="w-full">
          <p className="text-center mb-2">地址</p>
          <input
            type="text"
            {...register("address")}
            className="w-full max-w-md mx-auto border-2 border-stone-200 rounded-md p-2"
            placeholder="請輸入地址"
          />
        </div>

        {/* 投訴性質 */}
        <div className="w-full">
          <p className="text-xl font-black text-[#001B29] text-center mt-10 mb-5">
            投訴性質*
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "complaint_web", label: "網頁" },
              { id: "complaint_public", label: "刊登資料" },
              { id: "complaint_cs", label: "客戶服務" },
              { id: "complaint_fee", label: "收費" },
              { id: "complaint_service", label: "服務適時" },
              { id: "complaint_hr", label: "人事" },
              { id: "complaint_nsl", label: "國安法" },
              { id: "complaint_others", label: "其他" },
            ].map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.id}
                  {...register("complaintTypes", {
                    required: "請選擇至少一項投訴類型",
                  })}
                  className="border-2 border-stone-200 rounded w-4 h-4"
                />
                <span>{option.label}</span>
              </label>
            ))}
            {complaintTypes.includes("complaint_others") && (
              <input
                type="text"
                {...register("complaintOthers", {
                  required: "請註明其他投訴內容",
                })}
                className="w-full max-w-md mx-auto border-2 border-stone-200 rounded-md p-2 mt-2"
                placeholder="請註明其他投訴"
              />
            )}
            {errors.complaintTypes && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errors.complaintTypes.message}
              </p>
            )}
            {errors.complaintOthers && complaintTypes.includes("complaint_others") && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errors.complaintOthers.message}
              </p>
            )}
          </div>
        </div>

        {/* 提交按鈕 */}
        <button
          type="submit"
          className="mt-10 text-white bg-gradient-to-br from-blue-300 via-blue-500 to-blue-950 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          提交
        </button>
      </form>
    </div>
  );
};

export default ComplainFormPage;