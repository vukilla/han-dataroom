import { waitUntil } from "@vercel/functions";

import { sendEmail } from "@/lib/resend";

import VerificationLinkEmail from "@/components/emails/verification-link";

export const sendVerificationRequestEmail = async (params: {
  email: string;
  url: string;
}) => {
  const { url, email } = params;

  const emailTemplate = VerificationLinkEmail({
    email,
    url,
  });

  // Use waitUntil to send email in background after response is sent
  waitUntil(
    sendEmail({
      to: email as string,
      system: true,
      subject: "Sign in to Papermark",
      react: emailTemplate,
      test: process.env.NODE_ENV === "development",
    }).catch((e) => {
      console.error("Failed to send verification email:", e);
    }),
  );
};
