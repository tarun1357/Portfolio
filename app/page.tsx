import { Achievements } from "@/components/sections/achievements";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { SystemDesignSection } from "@/components/sections/system-design";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <SystemDesignSection />
      <Projects />
      <Stack />
      <Achievements />
      <Contact />
    </>
  );
}
