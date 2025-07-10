'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const formData = new FormData();

    // Required hidden fields for CF7 (use actual values from your live form)
    formData.append('_wpcf7', '14');
    formData.append('_wpcf7_version', '5.9.3'); // Adjust to match your Contact Form 7 version
    formData.append('_wpcf7_locale', 'en_US');
    formData.append('_wpcf7_unit_tag', 'wpcf7-f14-o1'); // Inspect form source to get the correct unit tag
    formData.append('_wpcf7_container_post', '0');

    // Append form field values with exact field names used in CF7
    formData.append('first-name', (form.elements.namedItem("first-name") as HTMLInputElement).value);
    formData.append('last-name', (form.elements.namedItem("last-name") as HTMLInputElement).value);
    formData.append('email', (form.elements.namedItem("email") as HTMLInputElement).value);
    formData.append('message', (form.elements.namedItem("message") as HTMLTextAreaElement).value);

    try {
      const res = await fetch(`https://nchsltdadmin.com/wp-json/contact-form-7/v1/contact-forms/14/feedback`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.status === "mail_sent") {
        setSubmitted(true);
      } else {
        alert("❌ Submission failed: " + result.message);
      }
    } catch (err) {
      alert("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-10 lg:py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-8 text-center">
        <h2 className="text-3xl font-playfair">Initiate Private Inquiry</h2>

        {submitted ? (
          <p className="text-green-500">Your message has been received. We respond only to verified parties.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" name="first-name" type="text" required placeholder="First Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" name="last-name" type="text" required placeholder="Last Name" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required placeholder="Your confidential inquiry..." className="h-30" />
            </div>

            <Button
              variant="outline"
              type="submit"
              size="lg"
              className="w-full text-black"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Secure Message"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
