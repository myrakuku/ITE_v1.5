// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import axios from 'axios';
// import crypto from 'crypto';
// import dns from 'dns/promises';

// const prisma = new PrismaClient();
// const PAYME_API_URL = process.env.PAYME_API_URL || 'https://api.sandbox.payme.hsbc.com.hk/v1';
// const CLIENT_ID = process.env.PAYME_CLIENT_ID;
// const SECRET_KEY = process.env.PAYME_SECRET_KEY;
// const SIGNING_KEY = process.env.PAYME_SIGNING_KEY;

// // 檢查環境變數
// if (!CLIENT_ID || !SECRET_KEY || !SIGNING_KEY) {
//   console.error('缺少 PayMe 環境變數:', {
//     CLIENT_ID: CLIENT_ID ? 'set' : 'missing',
//     SECRET_KEY: SECRET_KEY ? 'set' : 'missing',
//     SIGNING_KEY: SIGNING_KEY ? 'set' : 'missing',
//   });
//   throw new Error('缺少 PayMe 環境變數');
// }

// // 域名解析檢查函數
// async function checkDomainResolution(hostname: string): Promise<boolean> {
//   try {
//     await dns.lookup(hostname);
//     console.log(`域名解析成功: ${hostname}`);
//     return true;
//   } catch (error) {
//     console.error(`域名解析失敗: ${hostname}`, error);
//     return false;
//   }
// }

// // 簽名函數
// function generateSignedRequest(payload: any): string {
//   if (!SIGNING_KEY) {
//     throw new Error('SIGNING_KEY 未配置');
//   }

//   const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
//   const signature = crypto
//     .createHmac('sha256', Buffer.from(SIGNING_KEY, 'base64'))
//     .update(encodedPayload)
//     .digest('base64');
//   return signature;
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { userId, amount, description, items } = body;

//     console.log('PayMe Request Body:', body);
//     console.log('PayMe API URL:', PAYME_API_URL);

//     if (!userId || !amount || !items || !Array.isArray(items)) {
//       return NextResponse.json({ error: '缺少必要參數' }, { status: 400 });
//     }

//     // 檢查域名解析
//     const hostname = new URL(PAYME_API_URL).hostname;
//     const isDomainResolvable = await checkDomainResolution(hostname);
    
//     if (!isDomainResolvable) {
//       console.error(`無法解析域名: ${hostname}`);
//       return NextResponse.json({ 
//         error: '支付服務暫時不可用，請稍後重試' 
//       }, { status: 503 });
//     }

//     // 創建訂單
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         total: amount,
//         status: 'PENDING',
//         paymentId: null,
//       },
//     });

//     // 創建訂單項目
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       if (!item.productId) {
//         return NextResponse.json({ error: `項目 ${i + 1} 缺少 productId` }, { status: 400 });
//       }
//       await prisma.orderItem.create({
//         data: {
//           orderId: order.id,
//           productId: item.productId,
//           quantity: item.quantity,
//           price: item.real_price,
//         },
//       });
//     }

//     // 根據測試文件，使用特定的金額來觸發不同場景
//     const payload = {
//       clientId: CLIENT_ID,
//       amount: Math.round(amount * 100), // 分為單位
//       currency: 'HKD',
//       description,
//       orderId: order.id,
//       successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/success?orderId=${order.id}`,
//       failureUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/failure?orderId=${order.id}`,
//       // 根據測試需求添加移動端回調
//       appSuccessCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/mobile-success?orderId=${order.id}`,
//       appFailCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/mobile-failure?orderId=${order.id}`,
//     };

//     // 生成簽名
//     const signature = generateSignedRequest(payload);

//     console.log('發送 PayMe 請求:', {
//       url: `${PAYME_API_URL}/payments`,
//       payload,
//       clientId: CLIENT_ID
//     });

//     // 添加重試機制
//     let paymeResponse;
//     let retries = 3;
    
//     while (retries > 0) {
//       try {
//         paymeResponse = await axios.post(
//           `${PAYME_API_URL}/payments`,
//           payload,
//           {
//             headers: {
//               'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64')}`,
//               'Content-Type': 'application/json',
//               'X-Signature': signature,
//             },
//             timeout: 10000, // 10秒超時
//           }
//         );
//         break; // 成功則跳出循環
//       } catch (error: any) {
//         retries--;
//         console.warn(`PayMe API 請求失敗，剩餘重試次數: ${retries}`, error.message);
        
//         if (retries === 0) {
//           throw error; // 重試次數用盡，拋出錯誤
//         }
        
//         // 等待一段時間後重試
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     }

//     if (!paymeResponse) {
//       throw new Error('PayMe API 請求失敗');
//     }

//     const paymentId = paymeResponse.data.paymentId;
//     const paymentUrl = paymeResponse.data.paymentUrl;

//     // 更新訂單支付ID
//     await prisma.order.update({
//       where: { id: order.id },
//       data: { paymentId },
//     });

//     console.log('PayMe Response:', { 
//       paymentUrl, 
//       orderId: order.id,
//       paymentId 
//     });

//     return NextResponse.json({
//       paymentUrl,
//       orderId: order.id,
//       paymentId,
//     });
//   } catch (error: any) {
//     console.error('PayMe 訂單創建失敗:', error);
    
//     // 更具體的錯誤訊息
//     let errorMessage = '訂單創建失敗，請重試';
    
//     if (error.code === 'ENOTFOUND') {
//       errorMessage = '支付服務暫時不可用，請稍後重試';
//     } else if (error.response) {
//       // PayMe API 返回的錯誤
//       errorMessage = `支付服務錯誤: ${error.response.data?.message || '未知錯誤'}`;
//       console.error('PayMe API 錯誤響應:', error.response.data);
//     } else if (error.request) {
//       // 請求發送但無回應
//       errorMessage = '支付服務無回應，請稍後重試';
//     }
    
//     return NextResponse.json({ 
//       error: errorMessage,
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import crypto from 'crypto';
import dns from 'dns/promises';

const prisma = new PrismaClient();
const PAYME_API_URL = process.env.PAYME_API_URL || 'https://api.sandbox.payme.hsbc.com.hk/v1';
const CLIENT_ID = process.env.PAYME_CLIENT_ID;
const SECRET_KEY = process.env.PAYME_SECRET_KEY;
const SIGNING_KEY = process.env.PAYME_SIGNING_KEY;

// 檢查環境變數並提供明確的類型
function getRequiredEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`缺少必要的環境變數: ${name}`);
    throw new Error(`缺少必要的環境變數: ${name}`);
  }
  return value;
}

// 在運行時獲取確定的值
const requiredClientId = getRequiredEnvVar('PAYME_CLIENT_ID', CLIENT_ID);
const requiredSecretKey = getRequiredEnvVar('PAYME_SECRET_KEY', SECRET_KEY);
const requiredSigningKey = getRequiredEnvVar('PAYME_SIGNING_KEY', SIGNING_KEY);

// 定義 PaymePayload 接口
interface PaymePayload {
  clientId: string;
  amount: number;
  currency: string;
  description: string;
  orderId: string;
  successUrl: string;
  failureUrl: string;
  appSuccessCallback: string;
  appFailCallback: string;
}

// 域名解析檢查函數
async function checkDomainResolution(hostname: string): Promise<boolean> {
  try {
    await dns.lookup(hostname);
    console.log(`域名解析成功: ${hostname}`);
    return true;
  } catch (error) {
    console.error(`域名解析失敗: ${hostname}`, error);
    return false;
  }
}

// 簽名函數
function generateSignedRequest(payload: PaymePayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', Buffer.from(requiredSigningKey, 'base64'))
    .update(encodedPayload)
    .digest('base64');
  return signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, description, items } = body;

    console.log('PayMe Request Body:', body);
    console.log('PayMe API URL:', PAYME_API_URL);

    if (!userId || !amount || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 });
    }

    // 檢查域名解析
    const hostname = new URL(PAYME_API_URL).hostname;
    const isDomainResolvable = await checkDomainResolution(hostname);

    if (!isDomainResolvable) {
      console.error(`無法解析域名: ${hostname}`);
      return NextResponse.json({
        error: '支付服務暫時不可用，請稍後重試',
      }, { status: 503 });
    }

    // 創建訂單
    const order = await prisma.order.create({
      data: {
        userId,
        total: amount,
        status: 'PENDING',
        paymentId: null,
      },
    });

    // 創建訂單項目
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId) {
        return NextResponse.json({ error: `項目 ${i + 1} 缺少 productId` }, { status: 400 });
      }
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.real_price,
        },
      });
    }

    // 根據測試文件，使用特定的金額來觸發不同場景
    const payload: PaymePayload = {
      clientId: requiredClientId, // 使用確定的值
      amount: Math.round(amount * 100),
      currency: 'HKD',
      description,
      orderId: order.id,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/success?orderId=${order.id}`,
      failureUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/failure?orderId=${order.id}`,
      appSuccessCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/mobile-success?orderId=${order.id}`,
      appFailCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/payme/mobile-failure?orderId=${order.id}`,
    };

    // 生成簽名
    const signature = generateSignedRequest(payload);

    console.log('發送 PayMe 請求:', {
      url: `${PAYME_API_URL}/payments`,
      payload,
      clientId: requiredClientId,
    });

    // 添加重試機制
    let paymeResponse;
    let retries = 3;

    while (retries > 0) {
      try {
        paymeResponse = await axios.post(
          `${PAYME_API_URL}/payments`,
          payload,
          {
            headers: {
              'Authorization': `Basic ${Buffer.from(`${requiredClientId}:${requiredSecretKey}`).toString('base64')}`,
              'Content-Type': 'application/json',
              'X-Signature': signature,
            },
            timeout: 10000,
          }
        );
        break;
      } catch (error: unknown) {
        retries--;
        console.warn(`PayMe API 請求失敗，剩餘重試次數: ${retries}`, error instanceof Error ? error.message : 'Unknown error');

        if (retries === 0) {
          throw error;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!paymeResponse) {
      throw new Error('PayMe API 請求失敗');
    }

    const paymentId = paymeResponse.data.paymentId;
    const paymentUrl = paymeResponse.data.paymentUrl;

    // 更新訂單支付ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId },
    });

    console.log('PayMe Response:', {
      paymentUrl,
      orderId: order.id,
      paymentId,
    });

    return NextResponse.json({
      paymentUrl,
      orderId: order.id,
      paymentId,
    });
  } catch (error: unknown) {
    console.error('PayMe 訂單創建失敗:', error);

    let errorMessage = '訂單創建失敗，請重試';

    if (error instanceof AxiosError) {
      if (error.code === 'ENOTFOUND') {
        errorMessage = '支付服務暫時不可用，請稍後重試';
      } else if (error.response) {
        errorMessage = `支付服務錯誤: ${error.response.data?.message || '未知錯誤'}`;
        console.error('PayMe API 錯誤響應:', error.response.data);
      } else if (error.request) {
        errorMessage = '支付服務無回應，請稍後重試';
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}