// "use server"

// import { db } from "@/lib/db" 
// import { CreateCourseModulSchema } from "./schema"
// import { InputType, ReturnType } from "./types";
// // import { redirect } from "next/navigation";
// import { CreateSafeAction } from "@/lib/create-safe-action";

// const handler = async (data: InputType) : Promise<ReturnType> => { 

//     const {  title,description  ,TeacherId} = data;

//     let coursemodul_data;

//     try {
//         coursemodul_data = await db.courseModul.create({
//             data: {
//                 title,
//                 description,
//                 TeacherId,
//             },
//             }
//         )
        
//         console.log("-- Create coursemodul on server-- : ",coursemodul_data,"-- End --");

//         return{
//             data: coursemodul_data
//         }

//     } catch (error) {
//         console.log("error : ", error , "-- End --")

//         return{ error: error instanceof Error ? error.message : "未知錯誤", }
//     }
// } 

// export const CreateCourseModulAction = CreateSafeAction(CreateCourseModulSchema, handler)

// "use server";

// import { db } from "@/lib/db";
// import { CreateCourseModulSchema } from "./schema";
// import { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import OSS from "ali-oss";

// const ossClient = new OSS({
//   region: process.env.OSS_REGION,
//   accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
//   accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
//   bucket: process.env.OSS_BUCKET,
// });

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { title, description, TeacherId, teaching_materials, originalFileName } = data;

//   let coursemodul_data;

//   try {
//     let teachingMaterialsUrl = "";

//     // 如果有上傳檔案，則將其上傳到阿里雲 OSS
//     if (teaching_materials && originalFileName) {
//       // 將 Base64 字串轉換為 Buffer
//       const base64Data = teaching_materials.replace(/^data:.*?;base64,/, "");
//       const buffer = Buffer.from(base64Data, "base64");

//       // 定義 OSS 中的檔案路徑（例如：course-materials/教師ID/檔案名）
//       const ossPath = `course-materials/${TeacherId}/${Date.now()}-${originalFileName}`;

//       // 上傳到 OSS
//       const result = await ossClient.put(ossPath, buffer);

//       // 獲取檔案的公開訪問 URL
//       teachingMaterialsUrl = result.url;
//     }

//     // 儲存到資料庫
//     coursemodul_data = await db.courseModul.create({
//       data: {
//         title,
//         description,
//         TeacherId,
//         Teaching_Materials: teachingMaterialsUrl, // 儲存 OSS URL
//       },
//     });

//     console.log("-- Create coursemodul on server -- : ", coursemodul_data, "-- End --");

//     return {
//       data: coursemodul_data,
//     };
//   } catch (error) {
//     console.log("error : ", error, "-- End --");
//     return { error: error instanceof Error ? error.message : "未知錯誤" };
//   }
// };

// export const CreateCourseModulAction = CreateSafeAction(CreateCourseModulSchema, handler);


// app/actions/Create/Create_CourseModul/index.ts
"use server";


import { db } from "@/lib/db";
import { CreateCourseModulSchema } from "./schema";
import z from "zod";

export async function CreateCourseModulAction(data: z.infer<typeof CreateCourseModulSchema>) {
  try {
    const validatedData = CreateCourseModulSchema.parse(data);

    const courseModul = await db.courseModul.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        TeacherId: validatedData.TeacherId,
        Teaching_Materials: validatedData.teaching_materials,
        originalFileName: validatedData.originalFileName,
      },
    });

return { success: true, data: courseModul };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "創建課程模組失敗";
    console.error("CreateCourseModulAction Error:", errorMessage, error);
    return { error: errorMessage };
  }
}