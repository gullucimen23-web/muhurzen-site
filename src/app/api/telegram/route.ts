import { NextResponse } from "next/server";

type TelegramPayload = {
  type?: "new_order" | "payment_notified";
  orderId?: string;
  name?: string;
  phone?: string;
  city?: string;
  intentTitle?: string;
  amount?: number;
  paymentStatus?: string;
};

function buildMessage(body: TelegramPayload) {
  const title =
    body.type === "payment_notified"
      ? "💸 MuhurZen Ödeme Bildirimi"
      : "🔥 Yeni MuhurZen Siparişi";

  const paymentText =
    body.type === "payment_notified"
      ? "Müşteri ödeme yaptığını bildirdi. Banka hesabından kontrol et."
      : "Yeni sipariş oluşturuldu. Ödeme bekleniyor.";

  return `${title}

${paymentText}

Sipariş No:
${body.orderId || "-"}

Ad Soyad: ${body.name || "-"}
Telefon: ${body.phone || "-"}
Şehir: ${body.city || "-"}

Niyet: ${body.intentTitle || "-"}
Tutar: ${body.amount || 1490} TL
Ödeme Durumu: ${body.paymentStatus || "-"}

Admin Panel:
https://muhurzen.com/admin`;
}

export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { success: false, error: "Telegram environment variables are missing." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as TelegramPayload;
    const text = buildMessage(body);

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      return NextResponse.json(
        { success: false, error: errorText },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram notification error:", error);
    return NextResponse.json(
      { success: false, error: "Telegram notification failed." },
      { status: 500 }
    );
  }
}
