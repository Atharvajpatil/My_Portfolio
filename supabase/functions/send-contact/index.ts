// Edge function: send-contact
// Sends a contact form submission to Atharva's inbox via Resend.
// Falls back gracefully: if RESEND_API_KEY isn't configured, it returns a clear
// status so the frontend can still confirm the message was saved to the database.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const INBOX = "f20260168@hyderabad.bits-pilani.ac.in";
const FROM = "Portfolio <onboarding@resend.dev>";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ error: "Name, email, and message are all required." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: "Invalid sender email address." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");

  if (!apiKey) {
    // No email key configured — tell the client the email wasn't sent but
    // the DB save (done client-side) is the source of truth.
    return new Response(
      JSON.stringify({
        sent: false,
        note: "Email forwarding is not configured yet. Message was saved to the database.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [INBOX],
        reply_to: email,
        subject: `Portfolio contact — ${name}`,
        text: `New message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\n---\n${message}\n---`,
        html: `<div style="font-family:Inter,sans-serif;color:#1e293b;max-width:560px;margin:0 auto;padding:24px;">
  <h2 style="margin:0 0 16px;font-size:18px;">New portfolio message</h2>
  <table style="width:100%;font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#64748b;width:80px;">Name</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#4f46e5;text-decoration:none;">${escapeHtml(email)}</a></td></tr>
  </table>
  <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />
  <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
  <hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0;" />
  <p style="font-size:12px;color:#94a3b8;margin:0;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
</div>`,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", res.status, errText);
      return new Response(
        JSON.stringify({
          sent: false,
          note: "Email service returned an error. Message was saved to the database.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ sent: true, note: "Message emailed to inbox." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-contact error:", err);
    return new Response(
      JSON.stringify({
        sent: false,
        note: "Could not reach the email service. Message was saved to the database.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
