import Hero from "@/components/hero";
import Company from "@/components/company"; 
import Commodities from "@/components/commodities";
import Privacy from "@/components/privacy";
import ContactForm from "@/components/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Company />
      <Commodities />
      <Privacy />
      <ContactForm />
    </>
  );
}
