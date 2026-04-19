import { SiteSettingsForm } from "@/components/dashboard/site-settings-form";
import { loadDashboardBundle } from "@/lib/dashboard-load";

export const metadata = {
  title: "Site & chat",
};

export default async function SiteDashboardPage() {
  const bundle = await loadDashboardBundle();
  const { site } = bundle.page;

  return (
    <SiteSettingsForm
      initial={{
        name: site.name,
        role: site.role,
        focus: site.focus,
        heroHeadline: site.hero.headline,
        heroSub: site.hero.sub,
        githubUrl: site.links.github,
        linkedinUrl: site.links.linkedin,
        emailMailto: site.links.email,
        chatContext: bundle.chatContext ?? "",
      }}
    />
  );
}
