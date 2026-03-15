---
title: Contato
description: Entre em contato comigo!
noIndex: false
hideTOC: false
draft: false
aliases:
  - contact-me
  - contact-us
  - contact
---

![](attachments/selos-oraculares.png)
	Se tem alguma dúvida ou quer conhecer o meu trabalho como Terapeuta Holístico (Oraculista e Astrósofo).


<form id="contact-form" class="form-sleek">

  <!-- Honeypot spam protection -->
  <input type="text" name="bot-field" style="display:none" />

  <input
    type="text"
    id="name"
    name="name"
    required
    class="w-full"
    placeholder="Nome"
  />

  <input
    type="email"
    id="email"
    name="email"
    required
    class="w-full"
    placeholder="Email"
  />

  <textarea
    id="message"
    name="message"
    rows="4"
    required
    class="w-full"
    placeholder="Mensagem"
  ></textarea>

  <div class="g-recaptcha" id="captcha" data-sitekey="6Lf7wYosAAAAACtWUtuN8OQxuLcmvEW7I_3sKgTG"></div>

  <button type="submit" class="btn btn-primary w-full">
    Enviar Mensagem
  </button>
</form>

<script src="https://www.google.com/recaptcha/api.js"></script>

<script>
const form = document.getElementById("contact-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const captcha = grecaptcha.getResponse();

  if (!captcha) {
    alert("Por favor confirme o captcha.");
    return;
  }

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      bot: data.get("bot-field"),
      captcha
    })
  });

  const result = await res.json();
  alert(result.message);

  if(result.success){
    form.reset;
  }
</script>