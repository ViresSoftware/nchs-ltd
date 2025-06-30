import Hero from "@/components/hero";
import Company from "@/components/company"; 
import Commodities from "@/components/commodities";
import Privacy from "@/components/privacy";
import ContactForm from "@/components/contact";

export default function Home() {
  return (
    <>
      <section id="hero"><Hero /></section>
      <section id="company"><Company /></section>
      <section id="commodities"><Commodities /></section>
      <section id="privacy"><Privacy /></section>
      <section id="contact"><ContactForm /></section>
    </>
  );
}
