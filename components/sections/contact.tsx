import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s talk systems—migrations, platforms, or hard backend problems."
      description="Use the form below (API-backed route handler). Wire Resend or another provider with env vars on Vercel when you’re ready for real mail delivery."
    >
      <Reveal>
        <ContactForm />
      </Reveal>
    </Section>
  );
}
