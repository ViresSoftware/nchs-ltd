'use client'

import { useState } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'

// Schema definition
const schema = z.object({
  // Step 1 - Basic Identification
  company_name: z.string().min(1, 'Required'),
  entity_type: z.string().min(1, 'Required'),
  registration_number: z.string().min(1, 'Required'),
  country_registered: z.string().min(1, 'Required'),
  dob_or_incorporation: z.string().min(1, 'Required'),

  // Step 2 - Contact Info
  mailing_address: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  auth_email: z.string().email('Invalid email'),
  website: z.string().url('Invalid URL').optional(),

  // Step 3 - Authorized Signatory
  authorized_name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  passport_number: z.string().min(1, 'Required'),
  authorized_contact: z.string().min(1, 'Required'), // ✅ Added


  // Step 4 - Banking Details
  bank_name: z.string().min(1, 'Required'),
  bank_address: z.string().min(1, 'Required'),
  bank_account_name: z.string().min(1, 'Required'),
  iban: z.string().min(1, 'Required'),
  swift_code: z.string().min(1, 'Required'),

  // Step 5 - Business Info
  business_type: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  trading_experience: z.string().optional(),

  // Step 6 - Documents
  passport_file: z
    .instanceof(File, { message: 'Passport file is required' })
    .refine((file) => file.size < 5 * 1024 * 1024, 'Must be under 5MB'),
  certificate_file: z
    .instanceof(File, { message: 'Certificate file is required' })
    .refine((file) => file.size < 5 * 1024 * 1024, 'Must be under 5MB'),
})

type FormSchema = z.infer<typeof schema>

export default function CISForm() {
  const [step, setStep] = useState(0)
  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = methods

  const stepFields: Record<number, (keyof FormSchema)[]> = {
    0: ['company_name', 'entity_type', 'registration_number', 'country_registered', 'dob_or_incorporation'],
    1: ['mailing_address', 'phone', 'auth_email', 'website'], // ✅ Updated
    2: ['authorized_name', 'title', 'passport_number', 'authorized_contact'],
    3: ['bank_name', 'bank_address', 'bank_account_name', 'iban', 'swift_code'],
    4: ['business_type', 'description', 'trading_experience'],
    5: ['passport_file', 'certificate_file'],
  }

  const onSubmit = async (data: FormSchema) => {
    const formData = new FormData()
    formData.append('passport_file', data.passport_file)
    formData.append('certificate_file', data.certificate_file)
    formData.append('form', JSON.stringify(data))

    try {
      const response = await fetch('http://localhost:5000/submit-cis', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (result.success) alert('✅ Form submitted successfully!')
      else alert('❌ Submission failed: ' + result.error)
    } catch {
      alert('❌ Network error')
    }
  }

  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) setStep((s) => s + 1)
  }

  const backStep = () => setStep((s) => Math.max(0, s - 1))

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
        <p className="text-2xl font-bold">
          {step === 0 && '1. Basic Identification'}
          {step === 1 && '2. Contact Information'}
          {step === 2 && '3. Authorized Signatory Information (for companies)'}
          {step === 3 && '4. Banking Details (sometimes required)'}
          {step === 4 && '5. Business Information'}
          {step === 5 && '6. Identification Documents'}
        </p>
          {/* Step 0 - Basic Identification */}
          {step === 0 && (
            <>
              <InputGroup label="Full Name / Company Name" field="company_name" />
              <InputGroup label="Type (Individual / Company / Trust / etc.)" field="entity_type" />
              <InputGroup label="Registration Number (if company)" field="registration_number" />
              <InputGroup label="Nationality / Country of Incorporation" field="country_registered" />
              <InputGroup label="Date of Birth or Incorporation" field="dob_or_incorporation" />
            </>
          )}

          {/* Step 1 - Contact Information */}
          {step === 1 && (
            <>
              <InputGroup label="Full Address" field="mailing_address" />
              <InputGroup label="Telephone Number" field="phone" />
              <InputGroup label="Email Address" field="auth_email" />
              <InputGroup label="Website (if company)" field="website" />
            </>
          )}

          {/* Step 2 - Authorized Signatory Information (for companies) */}
          {step === 2 && (
            <>
              <InputGroup label="Name of Authorized Signatory" field="authorized_name" />
              <InputGroup label="Title / Position" field="title" />
              <InputGroup label="Passport or ID Number" field="passport_number" />
              <InputGroup label="Contact Details" field="authorized_contact" />
            </>
          )}

          {/* Step 3 - Banking Details (sometimes required) */}
          {step === 3 && (
            <>
              <InputGroup label="Bank Name" field="bank_name" />
              <InputGroup label="Bank Address" field="bank_address" />
              <InputGroup label="Account Name" field="bank_account_name" />
              <InputGroup label="Account Number / IBAN" field="iban" />
              <InputGroup label="SWIFT / BIC Code" field="swift_code" />
            </>
          )}

          {/* Step 4 - Business Information */}
          {step === 4 && (
            <>
              <InputGroup label="Business Type / Sector" field="business_type" />
              <div>
                <Label>Brief Description of Activities</Label>
                <Textarea className="mt-2" {...register('description')} />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>
              <InputGroup label="Trading Experience (if relevant)" field="trading_experience" />
            </>
          )}

          {/* Step 5 - Identification Documents */}
          {step === 5 && (
            <>
              <FileInputGroup label="Copy of Passport / ID" field="passport_file" />
              <FileInputGroup label="Certificate of Incorporation (for companies)" field="certificate_file" />
            </>
          )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {step > 0 && <Button className='text-black' type="button" variant="outline" onClick={backStep}>Back</Button>}
          {step < 5
            ? <Button className="ml-auto" type="button" onClick={nextStep}>Next <ArrowRight className="h-5 w-5" /></Button>
            : <Button type="submit">Submit</Button>}
        </div>
      </form>
    </FormProvider>
  )
}

// Helper: Input group with error
function InputGroup({ label, field }: { label: string, field: keyof FormSchema }) {
  const { register, formState: { errors } } = useFormContext<FormSchema>()
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-2" {...register(field)} />
      {errors[field] && <p className="text-red-500">{errors[field]?.message as string}</p>}
    </div>
  )
}

// Helper: File input
function FileInputGroup({ label, field }: { label: string, field: keyof FormSchema }) {
  const { setValue, formState: { errors } } = useFormContext<FormSchema>()
  return (
    <div>
      <Label>{label}</Label>
      <Input
        className='mt-2 text-left block'
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setValue(field, file)
        }}
      />
      {errors[field] && <p className="text-red-500">{errors[field]?.message as string}</p>}
    </div>
  )
}
