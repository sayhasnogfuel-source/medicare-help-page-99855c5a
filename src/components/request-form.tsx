import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Lock, ShieldCheck } from "lucide-react";

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(50),
  lastName: z.string().trim().min(1, "Required").max(50),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  email: z.string().trim().email("Enter a valid email").max(100),
  city: z.string().trim().min(1, "Required").max(60),
  state: z.string().trim().min(2, "Required").max(40),
  householdSize: z.string().trim().min(1, "Required").max(3),
  income: z.string().trim().min(1, "Required").max(20),
  hasInsurance: z.enum(["yes", "no"]),
  contactMethod: z.enum(["call", "text", "email"]),
  notes: z.string().max(500).optional(),
});

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-green)]/15">
          <Check className="h-7 w-7 text-[var(--brand-green-deep)]" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-foreground">Thank you!</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          A member of 901 Healthcare will reach out soon to help you review your ACA
          options before the December 15 deadline.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <Input id="firstName" name="firstName" maxLength={50} autoComplete="given-name" />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <Input id="lastName" name="lastName" maxLength={50} autoComplete="family-name" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="phone" label="Phone" error={errors.phone}>
          <Input id="phone" name="phone" type="tel" maxLength={20} autoComplete="tel" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <Input id="email" name="email" type="email" maxLength={100} autoComplete="email" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="city" label="City" error={errors.city}>
          <Input id="city" name="city" maxLength={60} autoComplete="address-level2" />
        </Field>
        <Field id="state" label="State" error={errors.state}>
          <Input id="state" name="state" maxLength={40} autoComplete="address-level1" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="householdSize" label="Household size" error={errors.householdSize}>
          <Input id="householdSize" name="householdSize" type="number" min={1} max={20} placeholder="e.g. 3" />
        </Field>
        <Field id="income" label="Estimated annual income" error={errors.income}>
          <Input id="income" name="income" inputMode="numeric" maxLength={20} placeholder="e.g. $45,000" />
        </Field>
      </div>

      <div className="space-y-2">
        <Label>Do you currently have health insurance?</Label>
        <RadioGroup name="hasInsurance" className="flex gap-6">
          <RadioOption name="hasInsurance" value="yes" label="Yes" />
          <RadioOption name="hasInsurance" value="no" label="No" />
        </RadioGroup>
        {errors.hasInsurance && <p className="text-sm text-destructive">{errors.hasInsurance}</p>}
      </div>

      <div className="space-y-2">
        <Label>Preferred contact method</Label>
        <RadioGroup name="contactMethod" className="flex flex-wrap gap-6">
          <RadioOption name="contactMethod" value="call" label="Call" />
          <RadioOption name="contactMethod" value="text" label="Text" />
          <RadioOption name="contactMethod" value="email" label="Email" />
        </RadioGroup>
        {errors.contactMethod && <p className="text-sm text-destructive">{errors.contactMethod}</p>}
      </div>

      <Field id="notes" label="Notes or questions (optional)" error={errors.notes}>
        <Textarea id="notes" name="notes" maxLength={500} rows={3} placeholder="Tell us anything that would help us help you." />
      </Field>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        We respect your privacy and will only use your information to contact you about
        health coverage help.
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-[var(--brand-green-deep)] text-base font-semibold text-white hover:bg-[var(--brand-green-deep)]/90"
      >
        <ShieldCheck className="mr-1 h-5 w-5" />
        Get Covered Before December 15
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function RadioOption({ name, value, label }: { name: string; value: string; label: string }) {
  const id = `${name}-${value}`;
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  );
}
