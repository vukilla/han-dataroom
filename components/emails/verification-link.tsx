import React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const VerificationLinkEmail = ({
  email = "user@example.com",
  url = "https://example.com",
}: {
  email?: string;
  url?: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Papermark</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Text className="text-2xl font-bold tracking-tighter">
                Papermark
              </Text>
            </Section>
            <Heading className="mx-0 my-7 p-0 text-xl font-semibold text-black">
              Sign in to your account
            </Heading>
            <Text className="text-sm leading-6 text-neutral-600">
              Click the button below to sign in to your Papermark account. This
              link will expire in 24 hours.
            </Text>
            <Section className="my-6 text-center">
              <Button
                className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white no-underline"
                href={url}
              >
                Sign in to Papermark
              </Button>
            </Section>
            <Text className="text-sm leading-6 text-neutral-600">
              Or copy and paste this URL into your browser:
            </Text>
            <Text
              className="max-w-[500px] break-all text-xs text-neutral-500"
              style={{ wordBreak: "break-all" }}
            >
              {url}
            </Text>
            <Text className="mt-4 text-sm leading-5 text-neutral-500">
              If you didn&apos;t request this email, you can safely ignore it.
            </Text>
            <Hr className="my-6" />
            <Section className="text-gray-400">
              <Text className="text-xs text-neutral-500">
                Papermark, Inc.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationLinkEmail;
