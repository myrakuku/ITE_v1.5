// // app/actions/Admin_Post/post-admin.ts
// "use server";

// import { auth } from "@/auth";
// import { revalidatePath } from "next/cache";
// import { prisma } from "@/lib/prisma";
// import type { PostAdminCreateInput, PostAdminUpdateInput } from "@/types/post-admin";
// import { uploadToOSS, uploadMultipleToOSS, deleteFromOSS } from "@/lib/oss";

// const ADMIN_ROLE = "ADMIN";

// async function ensureAdmin() {
//   const session = await auth();
  
//   if (!session?.user?.id || session.user.role !== ADMIN_ROLE) {
//     throw new Error("未授權：僅限管理員操作");
//   }

//   return session.user;
// }

// // // 辅助函数：从 FormData 中提取文件
// // function extractFilesFromFormData(formData: FormData): {
// //   imageFiles: File[];
// //   videoFiles: File[];
// //   otherData: Record<string, string>;
// // } {
// //   const imageFiles: File[] = [];
// //   const videoFiles: File[] = [];
// //   const otherData: Record<string, string> = {};

// //   for (const [key, value] of Array.from(formData.entries())) {
// //     if (value instanceof File) {
// //       if (value.size > 0) {
// //         const fileType = value.type;
// //         if (fileType.startsWith('image/')) {
// //           imageFiles.push(value);
// //         } else if (fileType.startsWith('video/')) {
// //           videoFiles.push(value);
// //         }
// //       }
// //     } else if (typeof value === 'string') {
// //       otherData[key] = value;
// //     }
// //   }

// //   return { imageFiles, videoFiles, otherData };
// // }

// // // 辅助函数：处理文件上传到 OSS
// // async function processFileUploads(
// //   imageFiles: File[],
// //   videoFiles: File[],
// //   existingImageUrls: string[] = [],
// //   existingVideoUrls: string[] = []
// // ): Promise<{ img_url: string[]; video_url: string[] }> {
// //   const newImageUrls: string[] = [];
// //   const newVideoUrls: string[] = [];

// //   try {
// //     // 上传图片文件
// //     if (imageFiles.length > 0) {
// //       const uploadedImageUrls = await uploadMultipleToOSS(imageFiles);
// //       newImageUrls.push(...uploadedImageUrls);
// //     }

// //     // 上传视频文件
// //     if (videoFiles.length > 0) {
// //       const uploadedVideoUrls = await uploadMultipleToOSS(videoFiles);
// //       newVideoUrls.push(...uploadedVideoUrls);
// //     }
// //   } catch (error) {
// //     console.error("文件上传失败:", error);
// //     throw new Error("文件上传失败，请稍后重试");
// //   }

// //   return {
// //     img_url: [...existingImageUrls, ...newImageUrls],
// //     video_url: [...existingVideoUrls, ...newVideoUrls]
// //   };
// // }

// // // 创建 Post（支持文件上传）
// // export async function createPostAdmin(
// //   formData: FormData
// // ): Promise<any> {
// //   await ensureAdmin();

// //   try {
// //     // 从 FormData 中提取数据
// //     const { imageFiles, videoFiles, otherData } = extractFilesFromFormData(formData);
    
// //     // 验证必要字段
// //     if (!otherData.Title?.trim()) {
// //       throw new Error("标题不能为空");
// //     }

// //     // 处理文件上传到 OSS
// //     const { img_url, video_url } = await processFileUploads(imageFiles, videoFiles);

// //     // 创建文章
// //     const post = await prisma.postAdmin.create({
// //       data: {
// //         Title: otherData.Title || null,
// //         SupTitle: otherData.SupTitle || null,
// //         content: otherData.content || null,
// //         img_url,
// //         video_url,
// //         author: otherData.author || null,
// //       },
// //     });

// //     revalidatePath("/admin/PostLists");
// //     return {
// //       success: true,
// //       data: post,
// //       message: "文章创建成功"
// //     };
// //   } catch (error: any) {
// //     console.error("创建文章失败:", error);
// //     throw new Error(error.message || "创建文章失败，请稍后重试");
// //   }
// // }

// // app/actions/Admin_Post/post-admin.ts (關鍵修正部分)

// function extractFilesFromFormData(formData: FormData): {
//   imageFiles: File[];
//   videoUrls: string[];        // 新增：直接提取 URL 陣列
//   otherData: Record<string, any>;
//   id?: string;                // 若有 id（更新時）
//   filesToDelete: string[];
// } {
//   const imageFiles: File[] = [];
//   const videoUrls: string[] = [];
//   const otherData: Record<string, any> = {};
//   const filesToDelete: string[] = [];

//   for (const [key, value] of Array.from(formData.entries())) {
//     if (value instanceof File) {
//       if (value.size > 0 && value.type.startsWith('image/')) {
//         imageFiles.push(value);
//       }
//     } else if (typeof value === 'string') {
//       if (key.startsWith('delete_')) {
//         filesToDelete.push(value);
//       } else if (key === 'video_urls') {
//         videoUrls.push(value); // 收集多個相同 key
//       } else {
//         otherData[key] = value;
//       }
//     }
//   }

//   return { imageFiles, videoUrls, otherData, filesToDelete, id: otherData.id };
// }

// // 處理上傳（僅圖片）
// async function processFileUploads(
//   imageFiles: File[],
//   existingImageUrls: string[] = []
// ): Promise<{ img_url: string[]; video_url: string[] }> {
//   const newImageUrls: string[] = [];

//   if (imageFiles.length > 0) {
//     const uploadedImageUrls = await uploadMultipleToOSS(imageFiles);
//     newImageUrls.push(...uploadedImageUrls);
//   }

//   return {
//     img_url: [...existingImageUrls, ...newImageUrls],
//     video_url: [] // 後續會合併直接傳入的 videoUrls
//   };
// }

// // createPostAdmin（統一處理新建與更新）
// export async function createPostAdmin(formData: FormData): Promise<any> {
//   await ensureAdmin();

//   try {
//     const { imageFiles, videoUrls, otherData, filesToDelete, id } = extractFilesFromFormData(formData);

//     if (!otherData.Title?.trim()) {
//       throw new Error("標題不能為空");
//     }

//     let img_url: string[] = [];
//     let video_url: string[] = videoUrls; // 直接使用輸入的 URL

//     if (id) {
//       // 更新模式
//       const existingPost = await prisma.postAdmin.findUnique({
//         where: { id },
//         select: { img_url: true, video_url: true }
//       });

//       if (!existingPost) {
//         throw new Error("文章不存在");
//       }

//       // 處理圖片刪除與上傳
//       if (filesToDelete.length > 0) {
//         await deleteFromOSS(filesToDelete);
//       }

//       const { img_url: newImgUrls } = await processFileUploads(imageFiles, existingPost.img_url.filter(url => !filesToDelete.includes(url)));
//       img_url = newImgUrls;

//       // video_url 直接覆蓋為新輸入的陣列
//       video_url = videoUrls.length > 0 ? videoUrls : existingPost.video_url;

//       const post = await prisma.postAdmin.update({
//         where: { id },
//         data: {
//           Title: otherData.Title,
//           SupTitle: otherData.SupTitle || undefined,
//           content: otherData.content || undefined,
//           img_url,
//           video_url,
//           author: otherData.author || undefined,
//         },
//       });

//       revalidatePath("/admin/PostLists");
//       revalidatePath(`/admin/PostLists/${id}`);
//       return { success: true, data: post, message: "文章更新成功" };
//     } else {
//       // 新建模式
//       const { img_url: newImgUrls } = await processFileUploads(imageFiles);
//       img_url = newImgUrls;

//       const post = await prisma.postAdmin.create({
//         data: {
//           Title: otherData.Title,
//           SupTitle: otherData.SupTitle || null,
//           content: otherData.content || null,
//           img_url,
//           video_url,
//           author: otherData.author || null,
//         },
//       });

//       revalidatePath("/admin/PostLists");
//       return { success: true, data: post, message: "文章建立成功" };
//     }
//   } catch (error: any) {
//     console.error("操作失敗:", error);
//     throw new Error(error.message || "操作失敗，請稍後重試");
//   }
// }


// // 更新 Post（支持文件上传）
// export async function updatePostAdmin(
//   id: string,
//   formData: FormData,
//   filesToDelete?: string[]
// ): Promise<any> {
//   await ensureAdmin();

//   try {
//     // 验证 ID
//     if (!id || typeof id !== 'string') {
//       throw new Error("无效的文章 ID");
//     }

//     // 获取现有文章数据
//     const existingPost = await prisma.postAdmin.findUnique({
//       where: { id },
//       select: { img_url: true, video_url: true }
//     });

//     if (!existingPost) {
//       throw new Error("文章不存在");
//     }

//     // 如果有要删除的文件，从 OSS 删除
//     if (filesToDelete && filesToDelete.length > 0) {
//       await deleteFromOSS(filesToDelete);
      
//       // 从现有 URL 中移除已删除的文件
//       existingPost.img_url = existingPost.img_url.filter(url => !filesToDelete.includes(url));
//       existingPost.video_url = existingPost.video_url.filter(url => !filesToDelete.includes(url));
//     }

//     // 从 FormData 中提取数据
//     const { imageFiles, otherData } = extractFilesFromFormData(formData);

//     // 处理新文件上传到 OSS
//     const { img_url, video_url } = await processFileUploads(
//       imageFiles, 

//       existingPost.img_url, 

//     );

//     // 更新文章
//     const post = await prisma.postAdmin.update({
//       where: { id },
//       data: {
//         Title: otherData.Title || undefined,
//         SupTitle: otherData.SupTitle || undefined,
//         content: otherData.content || undefined,
//         img_url,
//         video_url,
//         author: otherData.author || undefined,
//       },
//     });

//     revalidatePath("/admin/PostLists");
//     revalidatePath(`/admin/PostLists/${id}`);
    
//     return {
//       success: true,
//       data: post,
//       message: "文章更新成功"
//     };
//   } catch (error: any) {
//     console.error("更新文章失败:", error);
//     throw new Error(error.message || "更新文章失败，请稍后重试");
//   }
// }

// // 简单更新（仅更新文本数据，不处理文件）
// export async function simpleUpdatePostAdmin(data: PostAdminUpdateInput): Promise<any> {
//   await ensureAdmin();

//   const { id, ...updateData } = data;

//   try {
//     const post = await prisma.postAdmin.update({
//       where: { id },
//       data: {
//         Title: updateData.Title ?? undefined,
//         SupTitle: updateData.SupTitle ?? undefined,
//         content: updateData.content ?? undefined,
//         author: updateData.author ?? undefined,
//         img_url: updateData.img_url,
//         video_url: updateData.video_url,
//       },
//     });

//     revalidatePath("/admin/PostLists");
//     revalidatePath(`/admin/PostLists/${id}`);
    
//     return {
//       success: true,
//       data: post,
//       message: "文章更新成功"
//     };
//   } catch (error: any) {
//     console.error("更新文章失败:", error);
//     throw new Error(error.message || "更新文章失败");
//   }
// }

// // 删除 Post（同时删除 OSS 文件）
// export async function deletePostAdmin(id: string): Promise<{ success: boolean; message: string }> {
//   await ensureAdmin();

//   try {
//     // 先获取文章数据，以获取要删除的文件 URL
//     const post = await prisma.postAdmin.findUnique({
//       where: { id },
//       select: { img_url: true, video_url: true }
//     });

//     // 从 OSS 删除文件
//     if (post) {
//       const allUrls = [...post.img_url, ...post.video_url];
//       if (allUrls.length > 0) {
//         await deleteFromOSS(allUrls);
//       }
//     }

//     // 删除数据库记录
//     await prisma.postAdmin.delete({
//       where: { id },
//     });

//     revalidatePath("/admin/PostLists");
    
//     return {
//       success: true,
//       message: "文章删除成功"
//     };
//   } catch (error: any) {
//     console.error("删除文章失败:", error);
//     throw new Error("删除文章失败，请稍后重试");
//   }
// }

// // 获取所有 Posts（支持分页与搜索）
// // app/actions/Admin_Post/post-admin.ts
// export async function getPostAdmins({
//   page = 1,
//   limit = 10,
//   search = "",
// }: {
//   page?: number;
//   limit?: number;
//   search?: string;
// } = {}) {
//   try {
//     const skip = (page - 1) * limit;

//     const where = search
//       ? {
//           OR: [
//             { Title: { contains: search, mode: "insensitive" as const } },
//             { SupTitle: { contains: search, mode: "insensitive" as const } },
//             { content: { contains: search, mode: "insensitive" as const } },
//             { author: { contains: search, mode: "insensitive" as const } },
//           ],
//         }
//       : {};

//     const [posts, total] = await Promise.all([
//       prisma.postAdmin.findMany({
//         where,
//         skip,
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       }),
//       prisma.postAdmin.count({ where }),
//     ]);

//     // 格式化日期
//     const formattedPosts = posts.map(post => ({
//       ...post,
//       formattedCreatedAt: `${post.createdAt.getFullYear()}/${String(post.createdAt.getMonth() + 1).padStart(2, '0')}/${String(post.createdAt.getDate()).padStart(2, '0')}`
//     }));

//     return { 
//       success: true, 
//       data: {
//         posts: formattedPosts,
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit)
//       }
//     };
//   } catch (error: any) {
//     console.error("獲取文章列表失敗:", error);
//     return { 
//       success: false, 
//       error: "獲取文章列表失敗",
//       data: { posts: [], total: 0, page, limit, totalPages: 0 }
//     };
//   }
// }

// // 获取单一 Post
// export async function getPostAdminById(id: string) {
//   try {
//     // 验证 id
//     if (!id || typeof id !== 'string') {
//       throw new Error("无效的文章 ID");
//     }
    
//     const post = await prisma.postAdmin.findUnique({
//       where: { id },
//     });

//     if (!post) {
//       throw new Error("文章不存在");
//     }
    
//     return {
//       success: true,
//       data: post
//     };
//   } catch (error: any) {
//     console.error("获取文章失败:", error);
//     throw new Error(error.message || "获取文章失败");
//   }
// }

// // 批次删除
// export async function deleteMultiplePostAdmins(ids: string[]): Promise<{ success: boolean; message: string }> {
//   await ensureAdmin();

//   try {
//     if (!ids || ids.length === 0) {
//       throw new Error("未选择要删除的文章");
//     }

//     // 获取所有要删除的文章的文件 URL
//     const posts = await prisma.postAdmin.findMany({
//       where: { id: { in: ids } },
//       select: { img_url: true, video_url: true }
//     });

//     // 从 OSS 删除所有文件
//     const allUrls = posts.flatMap(post => [...post.img_url, ...post.video_url]);
//     if (allUrls.length > 0) {
//       await deleteFromOSS(allUrls);
//     }

//     // 删除数据库记录
//     await prisma.postAdmin.deleteMany({
//       where: { id: { in: ids } },
//     });

//     revalidatePath("/admin/PostLists");
    
//     return {
//       success: true,
//       message: `已成功删除 ${ids.length} 篇文章`
//     };
//   } catch (error: any) {
//     console.error("批量删除文章失败:", error);
//     throw new Error("批量删除文章失败，请稍后重试");
//   }
// }

// // 上传文件到 OSS（独立接口，可选）
// export async function uploadFiles(formData: FormData): Promise<{ success: boolean; urls: string[]; message?: string }> {
//   await ensureAdmin();

//   try {
//     const { imageFiles} = extractFilesFromFormData(formData);
//     const allFiles = [...imageFiles, ];
    
//     if (allFiles.length === 0) {
//       return {
//         success: false,
//         urls: [],
//         message: "未选择任何文件"
//       };
//     }

//     const urls = await uploadMultipleToOSS(allFiles);
    
//     return {
//       success: true,
//       urls,
//       message: `成功上传 ${urls.length} 个文件`
//     };
//   } catch (error: any) {
//     console.error("文件上传失败:", error);
//     return {
//       success: false,
//       urls: [],
//       message: error.message || "文件上传失败"
//     };
//   }
// }




"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";           // 正確：僅快取相關
import { redirect } from "next/navigation";         // 正確：導航相關
import { prisma } from "@/lib/prisma";
import type { PostAdminUpdateInput } from "@/types/post-admin";
import { uploadMultipleToOSS, deleteFromOSS } from "@/lib/oss";

const ADMIN_ROLE = "ADMIN";

async function ensureAdmin() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== ADMIN_ROLE) {
    throw new Error("未授權：僅限管理員操作");
  }

  return session.user;
}

function extractFilesFromFormData(formData: FormData): {
  imageFiles: File[];
  videoUrls: string[];
  otherData: Record<string, any>;
  id?: string;
  filesToDelete: string[];
} {
  const imageFiles: File[] = [];
  const videoUrls: string[] = [];
  const otherData: Record<string, any> = {};
  const filesToDelete: string[] = [];

  for (const [key, value] of Array.from(formData.entries())) {
    if (value instanceof File) {
      if (value.size > 0 && value.type.startsWith("image/")) {
        imageFiles.push(value);
      }
    } else if (typeof value === "string") {
      if (key.startsWith("delete_")) {
        filesToDelete.push(value.trim());
      } else if (key === "video_urls") {
        if (value.trim()) videoUrls.push(value.trim());
      } else {
        otherData[key] = value;
      }
    }
  }

  return { imageFiles, videoUrls, otherData, filesToDelete, id: otherData.id };
}

async function processFileUploads(
  imageFiles: File[],
  existingImageUrls: string[] = []
): Promise<{ img_url: string[] }> {
  const newImageUrls: string[] = [];

  if (imageFiles.length > 0) {
    const uploadedImageUrls = await uploadMultipleToOSS(imageFiles);
    newImageUrls.push(...uploadedImageUrls);
  }

  return {
    img_url: [...existingImageUrls, ...newImageUrls],
  };
}

// 統一處理新建與更新
export async function createPostAdmin(formData: FormData): Promise<any> {
  await ensureAdmin();

  try {
    const { imageFiles, videoUrls, otherData, filesToDelete, id } =
      extractFilesFromFormData(formData);

    if (!otherData.Title?.trim()) {
      throw new Error("標題不能為空");
    }

    let img_url: string[] = [];
    const cleanedVideoUrls = videoUrls.filter(Boolean);

    if (id) {
      // 更新模式
      const existingPost = await prisma.postAdmin.findUnique({
        where: { id },
        select: { img_url: true, video_url: true },
      });

      if (!existingPost) {
        throw new Error("文章不存在");
      }

      // 處理刪除檔案
      if (filesToDelete.length > 0) {
        await deleteFromOSS(filesToDelete);
      }

      const remainingImages = existingPost.img_url.filter(
        (url) => !filesToDelete.includes(url)
      );

      const { img_url: newImgUrls } = await processFileUploads(
        imageFiles,
        remainingImages
      );
      img_url = newImgUrls;

      // video_url：有新輸入則覆蓋，否則保留原有
      const finalVideoUrls =
        cleanedVideoUrls.length > 0 ? cleanedVideoUrls : existingPost.video_url;

      const post = await prisma.postAdmin.update({
        where: { id },
        data: {
          Title: otherData.Title,
          SupTitle: otherData.SupTitle || undefined,
          content: otherData.content || undefined,
          img_url,
          video_url: finalVideoUrls,
          author: otherData.author || undefined,
        },
      });

      revalidatePath("/admin/PostLists");
      revalidatePath(`/admin/PostLists/${id}`);
      redirect("/admin/PostLists"); // 強制導航，確保列表即時更新
    } else {
      // 新建模式
      const { img_url: newImgUrls } = await processFileUploads(imageFiles);
      img_url = newImgUrls;

      const post = await prisma.postAdmin.create({
        data: {
          Title: otherData.Title,
          SupTitle: otherData.SupTitle || null,
          content: otherData.content || null,
          img_url,
          video_url: cleanedVideoUrls,
          author: otherData.author || null,
        },
      });

      revalidatePath("/admin/PostLists");
      redirect("/admin/PostLists"); // 同上
    }
  } catch (error: any) {
    console.error("操作失敗:", error);
    throw new Error(error.message || "操作失敗，請稍後重試");
  }
}

// 簡單文字更新（不涉及檔案）
export async function simpleUpdatePostAdmin(
  data: PostAdminUpdateInput
): Promise<any> {
  await ensureAdmin();

  const { id, ...updateData } = data;

  try {
    const post = await prisma.postAdmin.update({
      where: { id },
      data: {
        Title: updateData.Title ?? undefined,
        SupTitle: updateData.SupTitle ?? undefined,
        content: updateData.content ?? undefined,
        author: updateData.author ?? undefined,
        img_url: updateData.img_url ?? undefined,
        video_url: updateData.video_url ?? undefined,
      },
    });

    revalidatePath("/admin/PostLists");
    revalidatePath(`/admin/PostLists/${id}`);
    redirect("/admin/PostLists"); // 若從編輯頁呼叫，導回列表以即時更新

    return { success: true, data: post, message: "文章更新成功" };
  } catch (error: any) {
    console.error("更新文章失敗:", error);
    throw new Error(error.message || "更新文章失敗");
  }
}

// 刪除單篇文章
export async function deletePostAdmin(
  id: string
): Promise<{ success: boolean; message: string }> {
  await ensureAdmin();

  try {
    const post = await prisma.postAdmin.findUnique({
      where: { id },
      select: { img_url: true, video_url: true },
    });

    if (post) {
      const allUrls = [...post.img_url, ...post.video_url];
      if (allUrls.length > 0) {
        await deleteFromOSS(allUrls);
      }
    }

    await prisma.postAdmin.delete({
      where: { id },
    });

    revalidatePath("/Posts");
    redirect("/admin/PostLists"); // 刪除後導回列表

    return { success: true, message: "文章刪除成功" };
  } catch (error: any) {
    console.error("刪除文章失敗:", error);
    throw new Error("刪除文章失敗，請稍後重試");
  }
}

// 批次刪除
export async function deleteMultiplePostAdmins(
  ids: string[]
): Promise<{ success: boolean; message: string }> {
  await ensureAdmin();

  try {
    if (!ids || ids.length === 0) {
      throw new Error("未選擇要刪除的文章");
    }

    const posts = await prisma.postAdmin.findMany({
      where: { id: { in: ids } },
      select: { img_url: true, video_url: true },
    });

    const allUrls = posts.flatMap((post) => [...post.img_url, ...post.video_url]);
    if (allUrls.length > 0) {
      await deleteFromOSS(allUrls);
    }

    await prisma.postAdmin.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/PostLists");
    redirect("/admin/PostLists"); // 批次刪除後導回列表

    return {
      success: true,
      message: `已成功刪除 ${ids.length} 篇文章`,
    };
  } catch (error: any) {
    console.error("批量刪除文章失敗:", error);
    throw new Error("批量刪除文章失敗，請稍後重試");
  }
}

// 獲取文章列表（分頁 + 搜尋）
export async function getPostAdmins({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { Title: { contains: search, mode: "insensitive" as const } },
            { SupTitle: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
            { author: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [posts, total] = await Promise.all([
      prisma.postAdmin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.postAdmin.count({ where }),
    ]);

    const formattedPosts = posts.map((post) => ({
      ...post,
      formattedCreatedAt: `${post.createdAt.getFullYear()}/${String(
        post.createdAt.getMonth() + 1
      ).padStart(2, "0")}/${String(post.createdAt.getDate()).padStart(2, "0")}`,
    }));

    return {
      success: true,
      data: {
        posts: formattedPosts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("獲取文章列表失敗:", error);
    return {
      success: false,
      error: "獲取文章列表失敗",
      data: { posts: [], total: 0, page, limit, totalPages: 0 },
    };
  }
}

// 獲取單篇文章
export async function getPostAdminById(id: string) {
  try {
    if (!id || typeof id !== "string") {
      throw new Error("无效的文章 ID");
    }

    const post = await prisma.postAdmin.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Error("文章不存在");
    }

    return {
      success: true,
      data: post,
    };
  } catch (error: any) {
    console.error("获取文章失败:", error);
    throw new Error(error.message || "获取文章失败");
  }
}

// 獨立檔案上傳（僅圖片）
export async function uploadFiles(
  formData: FormData
): Promise<{ success: boolean; urls: string[]; message?: string }> {
  await ensureAdmin();

  try {
    const { imageFiles } = extractFilesFromFormData(formData);

    if (imageFiles.length === 0) {
      return {
        success: false,
        urls: [],
        message: "未選擇任何檔案",
      };
    }

    const urls = await uploadMultipleToOSS(imageFiles);

    return {
      success: true,
      urls,
      message: `成功上傳 ${urls.length} 個檔案`,
    };
  } catch (error: any) {
    console.error("檔案上傳失敗:", error);
    return {
      success: false,
      urls: [],
      message: error.message || "檔案上傳失敗",
    };
  }
}