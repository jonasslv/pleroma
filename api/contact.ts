import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, captcha } = await req.body;

  
  // verify captcha
  const verify = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `secret=${process.env.GOOGLE_SECRET_KEY}&response=${captcha}`
    }
  );

  const captchaData = await verify.json();

  if (!captchaData.success) {
    return res.status(400).json({ success:false, message: "Erro no Captcha, tente novamente!" });
  }

  try {
    await resend.emails.send({
      from: "Pleroma Blog <jonas@blogpleroma.com>",
      to: process.env.OWNER_MAIL ?? "",
      subject: "Mensagem do Pleroma",
      html: `
        <h2>Nova Mensagem</h2>
        <p><b>Nome:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p>${message}</p>
      `
    });

    return res.status(200).json({ success:true, message: "Mensagem Enviada!" });

  } catch (error) {
    return res.status(500).json({ success:false, message: "Email Falhou!" });
  }
};