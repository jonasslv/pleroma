import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const { name, email, message, captcha } = await request.json();

  // verify captcha
  const verify = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `secret=${import.meta.env.GOOGLE_SECRET_KEY}&response=${captcha}`
    }
  );

    const captchaData = await verify.json();

    if (!captchaData.success) {
        return new Response(
        JSON.stringify({ message: "Captcha Falhou" }),
        { status: 400 }
    );
  } 

  try {
    await resend.emails.send({
      from: "Pleroma Blog <jonas@blogpleroma.com>",
      to: import.meta.env.OWNER_MAIL,
      subject: "Mensagem do Pleroma",
      html: `
        <h2>Nova Mensagem</h2>
        <p><b>Nome:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `
    });

    return new Response(
      JSON.stringify({ message: "Mensagem enviada!" }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Email Falhou" }),
      { status: 500 }
    );
  }
};