import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, code: string, name: string, language: string = 'ca') {
  const emailTemplates = {
    en: {
      subject: "Verification Code – Canyelles i la història del meteorit",
      text: `
Hello ${name},

Thank you for registering at Canyelles i la història del meteorit.

Your verification code is: ${code}
This code expires in 15 minutes.

Enter this code in the application to complete your registration.

This is an automatic email, no reply is needed.
      `,
      html: `
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for registering at <b>Canyelles i la història del meteorit</b>.</p>
        <p>Your verification code is:</p>
        <h2 style="color:#2c3e50; font-size:20px; letter-spacing:2px;">${code}</h2>
        <p>Enter this code in the application to complete your registration.</p>
        <br/>
        <p><i>This is an automatic email, no reply is needed.</i></p>
      `
    },
    ca: {
      subject: "Codi de verificació – Canyelles i la història del meteorit",
      text: `
Hola ${name},

Gràcies per registrar-te a Canyelles i la història del meteorit.

El teu codi de verificació és: ${code}
Aquest codi caduca en 15 minuts.

Introdueix aquest codi a l'aplicació per completar el teu registre.

Aquest és un correu automàtic, no cal respondre.
      `,
      html: `
        <p>Hola <b>${name}</b>,</p>
        <p>Gràcies per registrar-te a <b>Canyelles i la història del meteorit</b>.</p>
        <p>El teu codi de verificació és:</p>
        <h2 style="color:#2c3e50; font-size:20px; letter-spacing:2px;">${code}</h2>
        <p>Introdueix aquest codi a l'aplicació per completar el teu registre.</p>
        <br/>
        <p><i>Aquest és un correu automàtic, no cal respondre.</i></p>
      `
    },
    es: {
      subject: "Código de verificación – Canyelles y la historia del meteorito",
      text: `
Hola ${name},

Gracias por registrarte en Canyelles y la historia del meteorito.

Tu código de verificación es: ${code}
Este código caduca en 15 minutos.

Introduce este código en la aplicación para completar tu registro.

Este es un correo automático, no es necesario responder.
      `,
      html: `
        <p>Hola <b>${name}</b>,</p>
        <p>Gracias por registrarte en <b>Canyelles y la historia del meteorito</b>.</p>
        <p>Tu código de verificación es:</p>
        <h2 style="color:#2c3e50; font-size:20px; letter-spacing:2px;">${code}</h2>
        <p>Introduce este código en la aplicación para completar tu registro.</p>
        <br/>
        <p><i>Este es un correo automático, no es necesario responder.</i></p>
      `
    },
    fr: {
      subject: "Code de vérification – Canyelles et l'histoire de la météorite",
      text: `
Bonjour ${name},

Merci de vous être inscrit à Canyelles et l'histoire de la météorite.

Votre code de vérification est : ${code}
Ce code expire dans 15 minutes.

Entrez ce code dans l'application pour compléter votre inscription.

Ceci est un courriel automatique, aucune réponse n'est nécessaire.
      `,
      html: `
        <p>Bonjour <b>${name}</b>,</p>
        <p>Merci de vous être inscrit à <b>Canyelles et l'histoire de la météorite</b>.</p>
        <p>Votre code de vérification est :</p>
        <h2 style="color:#2c3e50; font-size:20px; letter-spacing:2px;">${code}</h2>
        <p>Entrez ce code dans l'application pour compléter votre inscription.</p>
        <br/>
        <p><i>Ceci est un courriel automatique, aucune réponse n'est nécessaire.</i></p>
      `
    }
  };

  // Default to English if language not found
  const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.en;

  const mailOptions = {
    from: `Canyelles i la història del meteorit <${process.env.SMTP_USER}>`,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendConfirmationEmail(to: string, name: string, language: string = 'ca') {
  const emailTemplates = {
    en: {
      subject: "Registration Confirmation – Canyelles i la història del meteorit",
      text: `
Hello ${name},

Your registration at Canyelles i la història del meteorit has been successfully completed.
You can now start enjoying the experience.

This is an automatic email, no reply is needed.
      `,
      html: `
        <p>Hello <b>${name}</b>,</p>
        <p>Your registration at <b>Canyelles i la història del meteorit</b> has been successfully completed.</p>
        <p>You can now start enjoying the experience.</p>
        <br/>
        <p><i>This is an automatic email, no reply is needed.</i></p>
      `
    },
    ca: {
      subject: "Confirmació de registre – Canyelles i la història del meteorit",
      text: `
Hola ${name},

El teu registre a Canyelles i la història del meteorit s'ha completat correctament.
Ara ja pots començar a gaudir de l'experiència.

Aquest és un correu automàtic, no cal respondre'l.
      `,
      html: `
        <p>Hola <b>${name}</b>,</p>
        <p>El teu registre a <b>Canyelles i la història del meteorit</b> s'ha completat correctament.</p>
        <p>Ara ja pots començar a gaudir de l'experiència.</p>
        <br/>
        <p><i>Aquest és un correu automàtic, no cal respondre'l.</i></p>
      `
    },
    es: {
      subject: "Confirmación de registro – Canyelles y la historia del meteorito",
      text: `
Hola ${name},

Tu registro en Canyelles y la historia del meteorito se ha completado correctamente.
Ahora ya puedes empezar a disfrutar de la experiencia.

Este es un correo automático, no es necesario responder.
      `,
      html: `
        <p>Hola <b>${name}</b>,</p>
        <p>Tu registro en <b>Canyelles y la historia del meteorito</b> se ha completado correctamente.</p>
        <p>Ahora ya puedes empezar a disfrutar de la experiencia.</p>
        <br/>
        <p><i>Este es un correo automático, no es necesario responder.</i></p>
      `
    },
    fr: {
      subject: "Confirmation d'inscription – Canyelles et l'histoire de la météorite",
      text: `
Bonjour ${name},

Votre inscription à Canyelles et l'histoire de la météorite a été effectuée avec succès.
Vous pouvez maintenant commencer à profiter de l'expérience.

Ceci est un courriel automatique, aucune réponse n'est nécessaire.
      `,
      html: `
        <p>Bonjour <b>${name}</b>,</p>
        <p>Votre inscription à <b>Canyelles et l'histoire de la météorite</b> a été effectuée avec succès.</p>
        <p>Vous pouvez maintenant commencer à profiter de l'expérience.</p>
        <br/>
        <p><i>Ceci est un courriel automatique, aucune réponse n'est nécessaire.</i></p>
      `
    }
  };

  // Default to English if language not found
  const template = emailTemplates[language as keyof typeof emailTemplates] || emailTemplates.en;

  const mailOptions = {
    from: `Canyelles i la història del meteorit <${process.env.SMTP_USER}>`,
    to,
    subject: template.subject,
    text: template.text,
    html: template.html,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendResetPasswordEmail(to: string, name: string, resetUrl: string) {
  const mailOptions = {
    from: `Canyelles i la història del meteorit <${process.env.SMTP_USER}>`,
    to,
    subject: "Recuperació de contrasenya – Canyelles i la història del meteorit",
    text: `
Hola ${name},

Hem rebut una sol·licitud per restablir la contrasenya del teu compte a Canyelles i la història del meteorit.

Per crear una contrasenya nova, fes clic en aquest enllaç:
${resetUrl}

L’enllaç caduca en 15 minuts.

Si no has demanat aquest canvi, pots ignorar aquest missatge.

Aquest és un correu automàtic, no cal respondre.
    `,
    html: `
      <p>Hola <b>${name}</b>,</p>
      <p>Hem rebut una sol·licitud per restablir la contrasenya del teu compte a <b>Canyelles i la història del meteorit</b>.</p>
      <p>Per crear una contrasenya nova, fes clic en aquest enllaç:</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>Si no has demanat aquest canvi, pots ignorar aquest missatge.</p>
      <br/>
      <p><i>Aquest és un correu automàtic, no cal respondre.</i></p>
    `,
  };

  await transporter.sendMail(mailOptions);
}