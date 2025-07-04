"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrate secure email backend or service
    setSubmitted(true);
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
                <Input id="first-name" type="text" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" type="text" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required placeholder="Your confidential inquiry..."  className="h-30" />
            </div>

            <Button variant="outline" type="submit" size="lg" className="w-full text-black">
              Send Secure Message
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
