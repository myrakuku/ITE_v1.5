// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// // 初始化 Resend 客戶端
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: Request) {
//   try {
//     // 解析請求中的表單數據
//     const {
//       appellation,
//       name,
//       phone,
//       email,
//       address,
//       complaintTypes,
//       complaintOthers,
//     } = await request.json();

//     // 驗證必填字段
//     if (!appellation || !name || !phone || !email || !complaintTypes.length) {
//       return NextResponse.json(
//         { error: "請填寫所有必填字段" },
//         { status: 400 }
//       );
//     }

//     // 格式化投訴類型
//     const complaintTypesText = complaintTypes.join(", ");
//     const complaintDetails = complaintOthers
//       ? `${complaintTypesText} (其他: ${complaintOthers})`
//       : complaintTypesText;

//     // 構造郵件內容
//     const emailContent = `
//       新投訴表單提交

//       稱謂: ${appellation}
//       姓名: ${name}
//       電話號碼: ${phone}
//       電郵地址: ${email}
//       地址: ${address || "未提供"}
//       投訴性質: ${complaintDetails}
//     `;

//     // 使用 Resend 發送郵件
//     const { data, error } = await resend.emails.send({
//       from: "no-reply@yourdomain.com", // 替換為您的已驗證發送域
//       to: "info@ite.edu.hk",
//       subject: "新投訴表單提交",
//       text: emailContent,
//     });

//     if (error) {
//       console.error("Resend 發送郵件失敗:", error);
//       return NextResponse.json({ error: "發送郵件失敗" }, { status: 500 });
//     }

//     return NextResponse.json({ message: "郵件發送成功" }, { status: 200 });
//   } catch (error) {
//     console.error("處理表單提交失敗:", error);
//     return NextResponse.json(
//       { error: "處理表單提交失敗" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { Resend } from "resend";

// 初始化 Resend 客戶端
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 解析請求中的表單數據
    const {
      appellation,
      name,
      phone,
      email,
      address,
      complaintTypes,
      complaintOthers,
    } = await request.json();

    // 驗證必填字段
    if (!appellation || !name || !phone || !email || !complaintTypes.length) {
      return NextResponse.json(
        { error: "請填寫所有必填字段" },
        { status: 400 }
      );
    }

    // 格式化投訴類型
    const complaintTypesText = complaintTypes.join(", ");
    const complaintDetails = complaintOthers
      ? `${complaintTypesText} (其他: ${complaintOthers})`
      : complaintTypesText;

    // 構造郵件內容
    const emailContent = `
      新投訴表單提交

      稱謂: ${appellation}
      姓名: ${name}
      電話號碼: ${phone}
      電郵地址: ${email}
      地址: ${address || "未提供"}
      投訴性質: ${complaintDetails}
    `;

    // 使用 Resend 發送郵件
    const { error } = await resend.emails.send({
      from: "no-reply@yourdomain.com", // 替換為您的已驗證發送域
      to: "info@ite.edu.hk",
      subject: "新投訴表單提交",
      text: emailContent,
    });

    if (error) {
      console.error("Resend 發送郵件失敗:", error);
      return NextResponse.json({ error: "發送郵件失敗" }, { status: 500 });
    }

    return NextResponse.json({ message: "郵件發送成功" }, { status: 200 });
  } catch (error) {
    console.error("處理表單提交失敗:", error);
    return NextResponse.json(
      { error: "處理表單提交失敗" },
      { status: 500 }
    );
  }
}