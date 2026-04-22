import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Check, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "901 Healthcare — Medicare Help for Turning 65" },
      {
        name: "description",
        content:
          "Turning 65 soon? Get simple, trustworthy help from 901 Healthcare understanding your Medicare next steps.",
      },
    ],
  }),
});

function Index() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-4">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            901 Healthcare
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Turning 65 soon? Medicare is not automatic.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Get simple help understanding your next steps.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Learn when to enroll",
                "Avoid common mistakes",
                "Get help understanding your options",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Check className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
                  </span>
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="p-6 sm:p-8">
            {submitted ? (
              <div className="flex min-h-[20rem] flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Check className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-foreground">Thanks.</h2>
                <p className="mt-2 text-muted-foreground">
                  A member of 901 Healthcare will reach out soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Request Help</h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" required maxLength={50} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" required maxLength={50} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" required maxLength={20} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required maxLength={100} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turn65">When do you turn 65?</Label>
                  <Input id="turn65" name="turn65" type="month" required />
                </div>

                <div className="space-y-2">
                  <Label>Are you still working?</Label>
                  <RadioGroup name="working" required className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="working-yes" />
                      <Label htmlFor="working-yes" className="font-normal">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="working-no" />
                      <Label htmlFor="working-no" className="font-normal">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Preferred contact method</Label>
                  <RadioGroup name="contactMethod" required className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="call" id="contact-call" />
                      <Label htmlFor="contact-call" className="font-normal">
                        Call
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="text" id="contact-text" />
                      <Label htmlFor="contact-text" className="font-normal">
                        Text
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Request Help
                </Button>
              </form>
            )}
          </Card>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 901 Healthcare
        </p>
      </footer>
    </div>
  );
}
