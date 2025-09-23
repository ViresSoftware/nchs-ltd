import { z } from "zod"

export const entityTypes = ["Individual", "Company"] as const

// --- Base object (kept as pure ZodObject so .extend works) ---
const baseObject = z.object({
  erc_20_wallet: z.string().optional(),
  trc_20_wallet: z.string().optional(),
  btc_wallet: z.string().optional(),
  entity_type: z.enum(entityTypes),
  company_name: z.string().min(1, "Company name is required"),
  country_registered: z.string().min(1, "Country is required"),
  dob_or_incorporation: z.string().min(1, "Date is required"),
  mailing_address: z.string().min(1, "Mailing address is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  auth_email: z.string().email("Invalid email"),
  business_type: z.string().min(1, "Business type is required"),
  description: z.string().min(1, "Description is required"),
  trading_experience: z.string().optional(),

  passport_file: z.custom<File>((file) => file instanceof File, {
    message: "Passport file is required",
  }),
  certificate_file: z.custom<File>((file) => file instanceof File).optional(),
})

// --- Company schema ---
const companySchema = baseObject.extend({
  entity_type: z.literal("Company"),
  registration_number: z.string().min(1, "Registration number is required"),
  website: z.string().min(1, "Website is required"),
  authorized_name: z.string().min(1, "Authorized name is required"),
  title: z.string().min(1, "Title is required"),
  passport_number: z.string().min(1, "Passport number is required"),
  authorized_contact: z.string().min(1, "Authorized contact is required"),
  certificate_file: z.custom<File>((file) => file instanceof File, {
    message: "Certificate file is required",
  }),
})

// --- Individual schema ---
const individualSchema = baseObject.extend({
  entity_type: z.literal("Individual"),
  registration_number: z.string().optional(),
  website: z.string().optional(),
  authorized_name: z.string().optional(),
  title: z.string().optional(),
  passport_number: z.string().optional(),
  authorized_contact: z.string().optional(),
})

// --- Final discriminated union + refine for wallet check ---
export const formSchema = z
  .discriminatedUnion("entity_type", [companySchema, individualSchema])
  .refine(
    (data) =>
      data.erc_20_wallet?.trim() ||
      data.trc_20_wallet?.trim() ||
      data.btc_wallet?.trim(),
    {
      message: "At least one wallet address is required",
      path: ["erc_20_wallet"], // choose one field to display the error
    }
  )

// --- Types ---
export type FormSchema = z.infer<typeof formSchema>
export type CompanyFormSchema = z.infer<typeof companySchema>
export type IndividualFormSchema = z.infer<typeof individualSchema>
