// app/(admin)/admin/PostLists/PostFormClient.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPostAdmin } from "@/app/actions/Admin_Post/post-admin";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import Image from "next/image";

// Zod Schema：新增 video_urls 陣列驗證
const schema = z.object({
  Title: z.string().min(1, "標題不能為空"),
  SupTitle: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  video_urls: z.array(z.string().url("必須為有效的 URL").optional()).optional(),
  // 新增
  relatedCourses: z.string().optional(),
});

type FormInput = z.infer<typeof schema>;

export default function PostFormClient({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>(initialData?.video_url || []);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      Title: initialData?.Title || "",
      SupTitle: initialData?.SupTitle || "",
      content: initialData?.content || "",
      author: initialData?.author || "",
      video_urls: initialData?.video_url || [],
      // 新增
      relatedCourses: initialData?.relatedCourses || "",
    },
  });

  // 圖片 Dropzone
  const onImageDrop = useCallback((acceptedFiles: File[]) => {
    setImageFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onImageDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"] },
    multiple: true,
  });

  // 移除現有圖片（標記為刪除）
  const removeExistingImage = (index: number) => {
    if (initialData?.img_url?.[index]) {
      setFilesToDelete((prev) => [...prev, initialData.img_url[index]]);
    }
  };

  // 新增影片 URL
  const addVideoUrl = () => {
    const trimmed = newVideoUrl.trim();
    if (trimmed && /^https?:\/\//i.test(trimmed)) {
      setVideoUrls((prev) => [...prev, trimmed]);
      setNewVideoUrl("");
    } else {
      toast.error("請輸入有效的 URL（需以 http:// 或 https:// 開頭）");
    }
  };

  // 移除影片 URL
  const removeVideoUrl = (index: number) => {
    setVideoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // 移除新上傳的圖片（預覽用）
  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormInput) => {
    setIsUploading(true);

    try {
      const formData = new FormData();

      // 文字欄位
      formData.append("Title", data.Title);
      if (data.SupTitle) formData.append("SupTitle", data.SupTitle);
      if (data.content) formData.append("content", data.content);
      if (data.author) formData.append("author", data.author);
// 新增：相關課程
      if (data.relatedCourses?.trim()) {
        formData.append("relatedCourses", data.relatedCourses.trim());
      }
      // 新上傳的圖片檔案
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // 影片 URL 陣列（多個相同 key）
      videoUrls.forEach((url) => {
        formData.append("video_urls", url);
      });

      // 要刪除的圖片 URL
      filesToDelete.forEach((url, idx) => {
        formData.append(`delete_${idx}`, url);
      });

      // 更新時傳入 id
      if (initialData?.id) {
        formData.append("id", initialData.id);
      }

      await createPostAdmin(formData);

      toast.success(initialData?.id ? "文章更新成功" : "文章建立成功");
      router.push("/admin/PostLists");
      router.refresh();
    } catch (error: any) {
      console.error("提交失敗:", error);
      toast.error(error.message || "儲存失敗，請重試");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {/* 主標題 */}
      <div>
        <label className="block text-sm font-medium mb-2">主標題 *</label>
        <input
          {...register("Title")}
          placeholder="輸入文章主標題"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.Title && <p className="text-red-600 text-sm mt-1">{errors.Title.message}</p>}
      </div>

      {/* 副標題 */}
      <div>
        <label className="block text-sm font-medium mb-2">副標題</label>
        <input
          {...register("SupTitle")}
          placeholder="輸入文章副標題"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* 作者 */}
      <div>
        <label className="block text-sm font-medium mb-2">作者</label>
        <input
          {...register("author")}
          placeholder="輸入作者名稱"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* 內容 */}
      <div>
        <label className="block text-sm font-medium mb-2">內容</label>
        <textarea
          {...register("content")}
          placeholder="輸入文章內容..."
          rows={12}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 圖片上傳區域 */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold">圖片上傳</label>

        {/* 現有圖片 */}
        {initialData?.img_url && initialData.img_url.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">現有圖片：</p>
            <div className="grid grid-cols-3 gap-4">
              {initialData.img_url.map((url: string, index: number) => {
                const isMarkedForDelete = filesToDelete.includes(url);
                return (
                  <div key={index} className={`relative ${isMarkedForDelete ? "opacity-50" : ""}`}>
                    <Image
                      src={url}
                      alt={`現有圖片 ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      {isMarkedForDelete ? "已標記刪除" : "✕"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dropzone */}
        <div
          {...getImageRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isImageDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getImageInputProps()} />
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">
            {isImageDragActive ? "放入圖片..." : "拖曳圖片至此，或點擊選擇"}
          </p>
          <p className="text-sm text-gray-500 mt-1">支援 JPG, PNG, GIF, WebP</p>
        </div>

        {/* 新上傳圖片預覽 */}
        {imageFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">新上傳圖片 ({imageFiles.length})</p>
            <div className="grid grid-cols-3 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <p className="text-xs truncate mt-1">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 影片 URL 輸入區域 */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold">影片連結（直接輸入 URL）</label>

        {/* 現有影片 URL */}
        {videoUrls.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">現有影片連結：</p>
            <div className="space-y-2">
              {videoUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm truncate flex-1 mr-4">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeVideoUrl(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    刪除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新增 URL 輸入框 */}
        <div className="flex space-x-4">
          <input
            type="url"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVideoUrl())}
            placeholder="輸入影片 URL（例如 YouTube、Vimeo 等）"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addVideoUrl}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            新增
          </button>
        </div>
        <p className="text-sm text-gray-500">支援 YouTube、Vimeo 或任何可直接播放的影片 URL。</p>
      </div>



      {/* 內容之後新增 相關課程 */}
      <div>
        <label className="block text-sm font-medium mb-2">相關課程</label>
        <textarea
          {...register("relatedCourses")}
          placeholder="可輸入相關課程名稱、說明或直接貼上 URL，每門課程可換行分隔&#10;範例：&#10;https://your-site.com/course/python101 - Python 入門課程&#10;進階資料分析實務（內部課程）"
          rows={6}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 提交按鈕 */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={isUploading}
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "處理中..." : initialData?.id ? "更新文章" : "建立文章"}
        </button>
      </div>
    </form>
  );
}