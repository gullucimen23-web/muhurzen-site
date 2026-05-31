import { NextResponse } from "next/server";

type TelegramPayload = {
  type?: "new_order" | "payment_notified" | "receipt_uploaded" | "status_changed";
  orderId?: string;
  name?: string;
  phone?: string;
  city?: string;
  intentTitle?: string;
  amount?: number;
  paymentStatus?: string;
  orderStatus?: string;
};

function buildMessage(body: TelegramPayload) {
  const titles = {
    new_order: "🔥 Yeni MuhurZen Siparişi",
    payment_notified: "💸 MuhurZen Ödeme Bildirimi",
    receipt_uploaded: "🧾 MuhurZen Dekont Yüklendi",
    status_changed: "📦 MuhurZen Sipariş Durumu Güncellendi",
  };

  const title = titles[body.type || "new_order"] || titles.new_order;

  const helper =
    body.type === "payment_notified"
      ? "Müşteri ödeme yaptığını bildirdi. Banka hesabından kontrol et."
      : body.type === "receipt_uploaded"
        ? "Müşteri dekont yükledi. Admin panelden kontrol edebilirsin."
        : body.type === "status_changed"
          ? "Sipariş durumu güncellendi."
          : "Yeni sipariş oluşturuldu. Ödeme bekleniyor.";

  return `${title}

${helper}

Sipariş No:
${body.orderId || "-"}

Ad Soyad: ${body.name || "-"}
Telefon: ${body.phone || "-"}
Şehir: ${body.city || "-"}

Niyet: ${body.intentTitle || "-"}
Tutar: ${body.amount || 1490} TL
Ödeme Durumu: ${body.paymentStatus || "-"}
Sipariş Durumu: ${body.orderStatus || "-"}

Admin Panel:
https://mühürzen.com/admin`;
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      return NextResponse.json({ success: false, error: errorText }, { status: 500 });
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
