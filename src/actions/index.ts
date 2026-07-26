import { ActionError, defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { z } from "astro/zod";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const server = {
  sendContactEmail: defineAction({
    accept: "form",
    input: z.object({
      inquiryType: z.string().min(1),
      message: z.string().min(1),
      name: z.string().min(1),
      company: z.string().min(1),
      email: z.string().email(),
      tel: z.string().optional(),
      lang: z.string().optional().default("en"),
    }),
    handler: async ({ inquiryType, message, name, company, email, tel, lang }) => {
      const safeInquiryType = escapeHtml(inquiryType);
      const safeName = escapeHtml(name);
      const safeCompany = escapeHtml(company);
      const safeEmail = escapeHtml(email);
      const safeTel = tel ? escapeHtml(tel) : "Not provided";
      const safeMessage = escapeHtml(message);
      const safeLang = lang ? escapeHtml(lang) : "en";

      const htmlBody = `
<h2>New Contact Form Submission</h2>
<p><strong>Inquiry Type:</strong> ${safeInquiryType}</p>
<p><strong>Name:</strong> ${safeName}</p>
<p><strong>Company:</strong> ${safeCompany}</p>
<p><strong>Email:</strong> ${safeEmail}</p>
<p><strong>Phone:</strong> ${safeTel}</p>
<p><strong>Language:</strong> ${safeLang}</p>
<hr>
<h3>Message</h3>
<p>${safeMessage}</p>
`.trim();

      const textBody = `
New Contact Form Submission

Inquiry Type: ${inquiryType}
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${tel ?? "Not provided"}
Language: ${lang ?? "en"}

Message
${message}
`.trim();

      try {
        await env.EMAIL.send({
          from: {
            email: "onboarding@carere.dev",
            name: "Carere Contact Form",
          },
          to: "contact@carere.dev",
          subject: `[Contact Form] ${inquiryType} from ${name} (${company})`.replace(
            /[\r\n]+/g,
            " ",
          ),
          replyTo: email,
          html: htmlBody,
          text: textBody,
        });
      } catch (error) {
        console.error("Sending email failed", error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Failed to send email",
        });
      }

      return { success: true };
    },
  }),
};
