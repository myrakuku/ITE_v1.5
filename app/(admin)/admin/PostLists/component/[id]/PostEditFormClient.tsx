// app/(admin)/admin/PostLists/[id]/edit/PostEditClient.tsx
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

// Zod 驗證 schema（與新增頁相同）
const schema = z.object({
  Title: z.string().min(1, "標題不能為空"),
  SupTitle: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  video_urls: z.array(z.string().url("必須為有效的 URL").optional()).optional(),
  relatedCourses: z.string().optional(),
});

type FormInput = z.infer<typeof schema>;

interface PostEditClientProps {
  initialData: {
    id: string;
    Title: string | null;
    SupTitle: string | null;
    content: string | null;
    author: string | null;
    img_url: string[];
    video_url: string[];
    relatedCourses: string | null;
  };
}

export default function PostEditClient({ initialData }: PostEditClientProps) {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>(initialData.video_url || []);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      Title: initialData.Title || "",
      SupTitle: initialData.SupTitle || "",
      content: initialData.content || "",
      author: initialData.author || "",
      relatedCourses: initialData.relatedCourses || "",
      // video_urls 不需要設 defaultValues，因為我們用 state 管理
    },
  });

  // 圖片拖放區域
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

  // 標記既有圖片為刪除
  const removeExistingImage = (url: string) => {
    if (filesToDelete.includes(url)) {
      // 取消刪除
      setFilesToDelete((prev) => prev.filter((u) => u !== url));
    } else {
      setFilesToDelete((prev) => [...prev, url]);
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

  // 移除新上傳的圖片預覽
  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormInput) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // 基本文字欄位
      formData.append("Title", data.Title);
      if (data.SupTitle?.trim()) formData.append("SupTitle", data.SupTitle.trim());
      if (data.content?.trim()) formData.append("content", data.content.trim());
      if (data.author?.trim()) formData.append("author", data.author.trim());

      // 相關課程
      if (data.relatedCourses?.trim()) {
        formData.append("relatedCourses", data.relatedCourses.trim());
      }

      // 重要：告訴後端這是更新動作
      formData.append("id", initialData.id);

      // 新增的圖片檔案
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // 影片 URL（全部重新送）
      videoUrls.forEach((url) => {
        formData.append("video_urls", url);
      });

      // 要刪除的既有圖片 URL
      filesToDelete.forEach((url, idx) => {
        formData.append(`delete_${idx}`, url);
      });

      await createPostAdmin(formData);

      toast.success("文章更新成功");
      router.push("/admin/PostLists");
      router.refresh();
    } catch (error: any) {
      console.error("更新文章失敗:", error);
      toast.error(error.message || "更新失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
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

      {/* 相關課程 */}
      <div>
        <label className="block text-sm font-medium mb-2">相關課程</label>
        <textarea
          {...register("relatedCourses")}
          placeholder="可輸入相關課程名稱、說明或直接貼上 URL，每門課程可換行分隔"
          rows={6}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 圖片管理區域 */}
      <div className="space-y-6">
        <label className="block text-lg font-semibold">圖片管理</label>

        {/* 現有圖片 */}
        {initialData.img_url.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-3">現有圖片：</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {initialData.img_url.map((url, index) => {
                const isMarkedDelete = filesToDelete.includes(url);
                return (
                  <div key={index} className={`relative group ${isMarkedDelete ? "opacity-60" : ""}`}>
                    <Image
                      src={url}
                      alt={`現有圖片 ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                        isMarkedDelete ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}
                    >
                      {isMarkedDelete ? "取消刪除" : "標記刪除"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 新上傳圖片 Dropzone */}
        <div
          {...getImageRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isImageDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getImageInputProps()} />
          <p className="text-gray-600">
            {isImageDragActive ? "放入圖片..." : "拖曳圖片至此，或點擊選擇新增圖片"}
          </p>
          <p className="text-sm text-gray-500 mt-1">支援 JPG, PNG, GIF, WebP</p>
        </div>

        {/* 新上傳圖片預覽 */}
        {imageFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">新上傳圖片 ({imageFiles.length} 張)</p>
            <div className="grid grid-cols-3 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 影片連結管理 */}
      <div className="space-y-6">
        <label className="block text-lg font-semibold">影片連結</label>

        {/* 現有影片 */}
        {videoUrls.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-3">現有影片連結：</p>
            <div className="space-y-2">
              {videoUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm truncate flex-1 mr-4">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeVideoUrl(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新增影片輸入 */}
        <div className="flex space-x-4">
          <input
            type="url"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addVideoUrl())}
            placeholder="輸入影片 URL（例如 YouTube、Vimeo）"
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
      </div>

      {/* 操作按鈕 */}
      <div className="flex justify-end space-x-4 pt-8 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "儲存中..." : "儲存變更"}
        </button>
      </div>
    </form>
  );
}