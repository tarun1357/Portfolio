import { Achievements } from "@/components/sections/achievements";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { SystemDesignSection } from "@/components/sections/system-design";
import { getPageData } from "@/lib/page-data";

export const revalidate = 60;

export default async function Home() {
  const data = await getPageData();
  const primaryRole = data.experience[0];

  return (
    <>
      <Hero site={data.site} />
      <About />
      {primaryRole ? <Experience role={primaryRole} /> : null}
      <SystemDesignSection cards={data.systemDesign} />
      <Projects projects={data.projects} />
      <Stack stackGroups={data.stackGroups} />
      <Achievements achievements={data.achievements} />
      <Contact />
    </>
  );
}
