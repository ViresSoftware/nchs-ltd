import Hero from "@/components/home/heroImage";
import Company from "@/components/company";
import Stats from "@/components/stats";
import Commodities from "@/components/commodities";
import Privacy from "@/components/privacy";
import ContactForm from "@/components/form/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Company />
      <Stats />
      <Commodities />
      <Privacy />
      <ContactForm />
    </>
  );
}
