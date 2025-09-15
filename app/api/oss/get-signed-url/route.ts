// // app/api/oss/get-signed-url/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { auth, UserRole } from "@/auth";
// import { createOssClient } from "@/lib/oss-client";


// export async function POST(req: NextRequest) {
//   try {
//     const session = await auth();
    
//     // 修正 session 檢查
//     if (!session || !session.user || !session.user.role) {
//       return NextResponse.json({ message: "未授權" }, { status: 401 });
//     }

//     // 檢查用戶角色
//     const userRole = session.user.role as UserRole;
//     if (![UserRole.TEACHER, UserRole.ADMIN].includes(userRole)) {
//       return NextResponse.json({ message: "無權限存取" }, { status: 403 });
//     }

//     const { objectKey, fileName } = await req.json();
    
//     if (!objectKey || !fileName) {
//       return NextResponse.json({ message: "缺少必要參數" }, { status: 400 });
//     }

//     const ossClient = createOssClient();
//     const url = ossClient.signatureUrl(objectKey, {
//       expires: 3600,
//       response: {
//         "content-disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
//       },
//     });
    
//     return NextResponse.json({ url });
//   } catch (error) {
//     console.error("生成簽名 URL 失敗:", error);
    
//     if (error instanceof Error && error.message === 'OSS 環境變數未正確設置') {
//       return NextResponse.json({ message: "伺服器配置錯誤" }, { status: 500 });
//     }
    
//     return NextResponse.json({ message: "無法生成簽名 URL" }, { status: 500 });
//   }
// }

// export const dynamic = 'force-dynamic';


import { NextRequest, NextResponse } from "next/server";
import { auth, UserRole } from "@/auth";
import { createOssClient } from "@/lib/oss-client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session || !session.user || !session.user.role) {
      return NextResponse.json({ message: "未授權" }, { status: 401 });
    }

    const userRole = session.user.role as UserRole;
    if (![UserRole.TEACHER, UserRole.ADMIN].includes(userRole)) {
      return NextResponse.json({ message: "無權限存取" }, { status: 403 });
    }

    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    const { objectKey, fileName } = body;

    if (!objectKey || !fileName) {
      return NextResponse.json({ message: "缺少必要參數" }, { status: 400 });
    }

    const ossClient = createOssClient();
    const url = ossClient.signatureUrl(objectKey, {
      expires: 3600,
      response: {
        "content-disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });

    console.log("Generated Signed URL:", url);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("生成簽名 URL 失敗:", error, JSON.stringify(error, null, 2));
    const errorMessage =
      error instanceof Error && error.message === "OSS 環境變數未正確設置"
        ? "伺服器配置錯誤"
        : "無法生成簽名 URL";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";