'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const entityTypes = ['Individual', 'Company'] as const

const schema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  entity_type: z.enum(entityTypes, {
    errorMap: () => ({ message: 'Entity type is required' }),
  }),
  registration_number: z.string().optional(),
  country_registered: z.string().min(1, 'Country is required'),
  dob_or_incorporation: z.string().min(1, 'Date is required'),
  mailing_address: z.string().min(1, 'Mailing address is required'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  auth_email: z.string().email('Invalid email'),
  website: z.string().optional().or(z.literal('')),
  authorized_name: z.string().optional(),
  title: z.string().optional(),
  passport_number: z.string().optional(),
  authorized_contact: z.string().optional(),
  bank_name: z.string().min(1, 'Bank name is required'),
  bank_address: z.string().min(1, 'Bank address is required'),
  bank_account_name: z.string().min(1, 'Account name is required'),
  iban: z.string().min(1, 'IBAN is required'),
  swift_code: z.string().min(1, 'SWIFT code is required'),
  business_type: z.string().min(1, 'Business type is required'),
  description: z.string().min(1, 'Description is required'),
  trading_experience: z.string().optional(),
  passport_file: z.instanceof(File, { message: 'Passport file is required' }),
  certificate_file: z.instanceof(File).optional(),
}).superRefine((data, ctx) => {
  if (data.entity_type === 'Company') {
    const requiredFields = [
      { key: 'registration_number', message: 'Registration number is required' },
      { key: 'website', message: 'Website is required' },
      { key: 'authorized_name', message: 'Authorized name is required' },
      { key: 'title', message: 'Title is required' },
      { key: 'passport_number', message: 'Passport number is required' },
      { key: 'authorized_contact', message: 'Authorized contact is required' },
      { key: 'certificate_file', message: 'Certificate file is required' },
    ]

    for (const { key, message } of requiredFields) {
      const value = data[key as keyof typeof data]
      const isMissing = key === 'certificate_file'
        ? !(value instanceof File)
        : !value || (typeof value === 'string' && !value.trim())

      if (isMissing) {
        ctx.addIssue({ path: [key], code: z.ZodIssueCode.custom, message })
      }
    }
  }
})

type FormSchema = z.infer<typeof schema>

export default function CISForm() {
  const [step, setStep] = useState(0)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = methods

  const entityType = watch('entity_type')

  useEffect(() => {
    setStep(0)
  }, [entityType])

  const fullSteps = useMemo(() => [
    'Basic Identification',
    'Contact Information',
    ...(entityType === 'Individual' ? [] : ['Authorized Signatory']),
    'Banking Details',
    'Business Info',
    'Document Uploads',
  ], [entityType])

  const stepFields: Record<number, (keyof FormSchema)[]> = useMemo(() => {
    let i = 0
    const fields: Record<number, (keyof FormSchema)[]> = {}
    fields[i++] = ['company_name', 'entity_type', 'registration_number', 'country_registered', 'dob_or_incorporation']
    fields[i++] = ['mailing_address', 'phone', 'auth_email', 'website']
    if (entityType !== 'Individual') fields[i++] = ['authorized_name', 'title', 'passport_number', 'authorized_contact']
    fields[i++] = ['bank_name', 'bank_address', 'bank_account_name', 'iban', 'swift_code']
    fields[i++] = ['business_type', 'description', 'trading_experience']
    fields[i++] = ['passport_file', 'certificate_file']
    return fields
  }, [entityType])

  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) {
      setMessage('')
      setStep((s) => s + 1)
    }
  }

  const backStep = () => {
    if (step === fullSteps.length - 1) {
      setValue('passport_file', undefined as unknown as File)
      setValue('certificate_file', undefined)
    }
    setMessage('')
    setStep((s) => Math.max(0, s - 1))
  }

  const onSubmit = async (data: FormSchema) => {
    setSubmitting(true)
    setMessage('')

    const isValid = await trigger()
    if (!isValid) {
      const firstError = Object.keys(errors)[0]
      const el = document.querySelector(`[name="${firstError}"]`) as HTMLElement
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.focus()
      }
      setMessage('❌ Please complete all required fields for your entity type.')
      setSubmitting(false)
      return
    }

    const formData = new FormData()
    Object.entries({
      '_wpcf7': '13',
      '_wpcf7_version': '5.9.3',
      '_wpcf7_locale': 'en_US',
      '_wpcf7_unit_tag': 'wpcf7-f13-o1',
      '_wpcf7_container_post': '0',
      'company-name': data.company_name,
      'entity-type': data.entity_type,
      'registration-number': data.registration_number || '',
      'country-registered': data.country_registered,
      'dob-or-incorporation': data.dob_or_incorporation,
      'mailing-address': data.mailing_address,
      'phone': data.phone,
      'auth-email': data.auth_email,
      'website': data.website || '',
      'authorized-name': data.authorized_name || '',
      'title': data.title || '',
      'passport-number': data.passport_number || '',
      'authorized-contact': data.authorized_contact || '',
      'bank-name': data.bank_name,
      'bank-address': data.bank_address,
      'bank-account-name': data.bank_account_name,
      'iban': data.iban,
      'swift-code': data.swift_code,
      'business-type': data.business_type,
      'description': data.description,
      'trading-experience': data.trading_experience || '',
    }).forEach(([key, val]) => formData.append(key, val))

    formData.append('passport-file', data.passport_file)
    if (data.certificate_file) formData.append('certificate-file', data.certificate_file)

    try {
      const res = await fetch('https://nchsltdadmin.com/wp-json/contact-form-7/v1/contact-forms/13/feedback', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      setMessage(result.status === 'mail_sent'
        ? '✅ Form submitted successfully!'
        : '❌ Submission failed: ' + result.message)
    } catch (err) {
      console.error(err)
      setMessage('❌ Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
        <p className="text-2xl font-bold">{step + 1}. {fullSteps[step]}</p>

        {step === 0 && (
          <>
            <InputGroup label="Full Name / Company Name" field="company_name" />
            <SelectGroup label="Entity Type" field="entity_type" options={entityTypes} />
            <InputGroup label="Registration Number" field="registration_number" />
            <InputGroup label="Country Registered" field="country_registered" />
            <InputGroup label="DOB or Incorporation" field="dob_or_incorporation" />
          </>
        )}

        {step === 1 && (
          <>
            <InputGroup label="Mailing Address" field="mailing_address" />
            <InputGroup label="Phone" field="phone" />
            <InputGroup label="Email" field="auth_email" />
            <InputGroup label="Website" field="website" />
          </>
        )}

        {step === 2 && entityType !== 'Individual' && (
          <>
            <InputGroup label="Authorized Name" field="authorized_name" />
            <InputGroup label="Title / Position" field="title" />
            <InputGroup label="Passport or ID Number" field="passport_number" />
            <InputGroup label="Contact Details" field="authorized_contact" />
          </>
        )}

        {(step === 2 && entityType === 'Individual') || (step === 3 && entityType !== 'Individual') ? (
          <>
            <InputGroup label="Bank Name" field="bank_name" />
            <InputGroup label="Bank Address" field="bank_address" />
            <InputGroup label="Account Name" field="bank_account_name" />
            <InputGroup label="IBAN" field="iban" />
            <InputGroup label="SWIFT Code" field="swift_code" />
          </>
        ) : null}

        {(step === 3 && entityType === 'Individual') || (step === 4 && entityType !== 'Individual') ? (
          <>
            <InputGroup label="Business Type" field="business_type" />
            <div>
              <Label>Description</Label>
              <Textarea className="mt-2" {...register('description')} />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
            <InputGroup label="Trading Experience" field="trading_experience" />
          </>
        ) : null}

        {(step === 4 && entityType === 'Individual') || (step === 5 && entityType !== 'Individual') ? (
          <>
            <FileInputGroup label="Passport File" field="passport_file" />
            <FileInputGroup label="Certificate File" field="certificate_file" />
          </>
        ) : null}
        <div className="flex justify-between pt-4">
          {step > 0 && <Button type="button" onClick={backStep}>Back</Button>}
          {step < fullSteps.length - 1 ? (
            <Button type="button" onClick={nextStep}>Next <ArrowRight className="h-5 w-5" /></Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </div>

        {message && <p className="text-center font-semibold pt-4">{message}</p>}
      </form>
    </FormProvider>
  )
}

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

function FileInputGroup({ label, field }: { label: string, field: keyof FormSchema }) {
  const { setValue, formState: { errors } } = useFormContext<FormSchema>()
  return (
    <div>
      <Label>{label}</Label>
      <Input
        className="mt-2"
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0]
          setValue(field, file)
        }}
      />
      {errors[field] && <p className="text-red-500">{errors[field]?.message as string}</p>}
    </div>
  )
}

function SelectGroup({ label, field, options }: {
  label: string,
  field: keyof FormSchema,
  options: readonly string[]
}) {
  const { setValue, watch, formState: { errors } } = useFormContext<FormSchema>()
  const value = watch(field)

  return (
    <div>
      <Label>{label}</Label>
      <Select value={value as string} onValueChange={(val) => setValue(field, val)}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[field] && <p className="text-red-500">{errors[field]?.message as string}</p>}
    </div>
  )
}