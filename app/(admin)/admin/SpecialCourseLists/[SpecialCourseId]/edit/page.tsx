"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { updateSpecialCourse, uploadImageToOSS } from "@/app/actions/Update/updateSpecialCourseMedia";

// === Zod Schema ===
const UpdateSpecialCourseSchema = z.object({
  imgUrl: z.string().url("請輸入有效的圖片 URL").optional().nullable(),
  videoUrl: z.string().url("請輸入有效的影片 URL").optional().nullable(),
  real_price: z.number().min(0, "價格必須大於或等於 0").optional().nullable(),
});

type FormDataType = {
  imgUrl: string | null;
  videoUrl: string | null;
  real_price: number | null;
};

interface SpecialCourseData {
  id: string;
  IMG_URL: any;
  Video_URL: any;
  real_price: number | null;
}

const EditSpecialCourse = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.SpecialCourseId as string;

  const [formData, setFormData] = useState<FormDataType>({
    imgUrl: null,
    videoUrl: null,
    real_price: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<SpecialCourseData | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/SpecialCourse/Get_SpecialCourse_by_ID/${courseId}`, {
          cache: 'no-store',
          next: { revalidate: 0 },
        });
        if (!response.ok) throw new Error(`請求失敗: ${response.status}`);
        const data = await response.json();

        let imgUrl: string | null = null;
        if (typeof data.IMG_URL === 'string') {
          imgUrl = data.IMG_URL;
        } else if (data.IMG_URL?.url) {
          imgUrl = data.IMG_URL.url;
        } else if (Array.isArray(data.IMG_URL?.images)) {
          imgUrl = data.IMG_URL.images[0]?.img_url || null;
        }

        let videoUrl: string | null = null;
        if (typeof data.Video_URL === 'string') {
          videoUrl = data.Video_URL;
        } else if (data.Video_URL?.url) {
          videoUrl = data.Video_URL.url;
        }

        setCourseData(data);
        setFormData({
          imgUrl,
          videoUrl,
          real_price: data.real_price ?? null, // ← 從 API 取 real_price
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : "無法獲取課程數據";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourseData();
  }, [courseId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);

      const result = await uploadImageToOSS(formData);
      if (result.error || !result.url) throw new Error(result.error || "上傳失敗");

      setFormData(prev => ({ ...prev, imgUrl: result.url! }));
      toast.success("圖片上傳成功");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "圖片上傳失敗";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === ""
        ? null
        : name === "real_price"
          ? (isNaN(Number(value)) ? null : Number(value))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const validated = UpdateSpecialCourseSchema.parse(formData);
      const result = await updateSpecialCourse(courseId, validated);
      if (result.error) throw new Error(result.error);

      const updatePayload: Partial<FormDataType> = {
        ...(validated.imgUrl !== undefined && { imgUrl: validated.imgUrl }),
        ...(validated.videoUrl !== undefined && { videoUrl: validated.videoUrl }),
        ...(validated.real_price !== undefined && { real_price: validated.real_price }),
      };

      setCourseData(prev => prev ? { ...prev, ...updatePayload } : null);
      setFormData(prev => ({ ...prev, ...updatePayload }));

      toast.success("更新成功");
      setTimeout(() => router.push("/admin/SpecialCourseLists"), 1500);
    } catch (err) {
      const msg = err instanceof z.ZodError
        ? "輸入錯誤：" + err.errors.map(e => e.message).join(", ")
        : err instanceof Error
        ? err.message
        : "更新失敗";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const hasValidImage = typeof formData.imgUrl === 'string' && formData.imgUrl.trim() !== "";

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">編輯特殊課程</h1>
          <Link
            href="/admin/SpecialCourseLists"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            返回列表
          </Link>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">{error}</div>
        )}

        {isLoading && !courseData ? (
          <div className="text-center py-10">載入中...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-700 rounded-md p-6 shadow-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">上傳圖片 (IMG_URL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
              />
              {hasValidImage && (
                <div className="mt-4">
                  <div className="relative h-48 w-64">
                    <Image
                      src={formData.imgUrl!}
                      alt="課程圖片"
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                    {formData.imgUrl}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">影片網址 (Video_URL)</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl || ""}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">真實價格 (real_price)</label>
              <input
                type="number"
                name="real_price"
                value={formData.real_price ?? ""}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "更新中..." : "確定更新"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSpecialCourse;