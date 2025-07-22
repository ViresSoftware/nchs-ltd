import Hero from "@/components/home/heroImage";
import Company from "@/components/company";
import Stats from "@/components/stats";
import Commodities from "@/components/commodities";
import Privacy from "@/components/privacy";
import ContactForm from "@/components/form/contact";
import RestrictedContent from "@/components/form/RestrictedContent";

export default function Home() {
  return (
    <>
      <RestrictedContent>
        <Hero />
        <Company />
        <Stats />
        <Commodities />
        <Privacy />
        <ContactForm />
      </RestrictedContent>
    </>
  );
}
