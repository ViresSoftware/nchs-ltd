'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  // Step 0
  company_name: z.string().min(1, 'Required'),
  mailing_address: z.string().min(1, 'Required'),
  country_registered: z.string().min(1, 'Required'),
  registration_number: z.string().min(1, 'Required'),
  website: z.string().url('Invalid URL'),

  // Step 1
  authorized_name: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  auth_email: z.string().email('Invalid email'),
  passport_number: z.string().min(1, 'Required'),

  // Step 2
  bank_name: z.string().min(1, 'Required'),
  bank_address: z.string().min(1, 'Required'),
  bank_account_number: z.string().min(1, 'Required'),
  iban: z.string().min(1, 'Required'),
  bank_officer_email: z.string().email('Invalid email'),

  // Step 3
  lawyer_name: z.string().min(1, 'Required'),
  lawyer_email: z.string().email('Invalid email'),
  contact_name: z.string().min(1, 'Required'),
  contact_email: z.string().email('Invalid email'),

  // Step 4
  description: z.string().min(1, 'Required'),

  // Step 5
  declaration_name: z.string().min(1, 'Required'),
  declaration_company: z.string().min(1, 'Required'),
  declaration_passport: z.string().min(1, 'Required'),

  // Step 6
  passport_file: z
  .instanceof(File, { message: 'Passport file is required' })
  .refine((file) => file.size < 5 * 1024 * 1024, 'Passport file must be under 5MB'),

	certificate_file: z
		.instanceof(File, { message: 'Certificate file is required' })
		.refine((file) => file.size < 5 * 1024 * 1024, 'Certificate file must be under 5MB'),
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
    0: ['company_name', 'mailing_address', 'country_registered', 'registration_number', 'website'],
    1: ['authorized_name', 'title', 'auth_email', 'passport_number'],
    2: ['bank_name', 'bank_address', 'bank_account_number', 'iban', 'bank_officer_email'],
    3: ['lawyer_name', 'lawyer_email', 'contact_name', 'contact_email'],
    4: ['description'],
    5: ['declaration_name', 'declaration_company', 'declaration_passport'],
    6: ['passport_file', 'certificate_file'],
  }

  const onSubmit = async (data: FormSchema) => {
    try {
      const response = await fetch('http://localhost:3000/submit-cis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          passport_file_url: 'https://example.com/passport.pdf', // Replace after upload
          certificate_file_url: 'https://example.com/cert.pdf'    // Replace after upload
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Form submitted successfully!');
      } else {
        alert('❌ Submission failed: ' + result.error);
      }
    } catch (err) {
      alert('❌ Network error');
    }
  };


  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (valid) setStep((s) => s + 1)
  }

  const backStep = () => setStep((s) => Math.max(0, s - 1))

  return (
    <FormProvider {...methods}>
	    <h2 className='text-center text-bold lg:text-3xl mt-10 mb-0'>Client Information Sheet</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
        <p className="text-2xl font-bold">Step {step + 1}</p>

        {/* Step Content */}
        {step === 0 && (
          <div className='space-y-6'>
						<div>
							<Label>Company Name</Label>
							<Input className='mt-3 mb-1' {...register('company_name')} />
							{errors.company_name && <p className="text-red-500">	{errors.company_name.message}</p>}
						</div>
            <div>
							<Label>Mailing Address</Label>
            	<Input className='mt-3 mb-1' {...register('mailing_address')} />
            	{errors.mailing_address && <p className="text-red-500">	{errors.mailing_address.message}</p>}
						</div>

            <div>
							<Label>Country Registered</Label>
            	<Input className='mt-3 mb-1' {...register('country_registered')} />
            	{errors.country_registered && <p className="text-red-500">	{errors.country_registered.message}</p>}
						</div>

            <div>
							<Label>Registration Number</Label>
            	<Input className='mt-3 mb-1' {...register('registration_number')} />
            	{errors.registration_number && <p className="text-red-500">	{errors.registration_number.message}</p>}
						</div>

            <div>
							<Label>Website</Label>
            	<Input className='mt-3 mb-1' {...register('website')} />
            	{errors.website && <p className="text-red-500">	{errors.website.message}</p>}
						</div>
          </div>
        )}

        {step === 1 && (
          <>
            <div>
							<Label>Authorized Name</Label>
            	<Input className='mt-3 mb-1' {...register('authorized_name')} />
            	{errors.authorized_name && <p className="text-red-500">	{errors.authorized_name.message}</p>}
						</div>

            <div>
							<Label>Title</Label>
            	<Input className='mt-3 mb-1' {...register('title')} />
            	{errors.title && <p className="text-red-500">	{errors.title.message}</p>}
						</div>

            <div>
							<Label>Email</Label>
            	<Input className='mt-3 mb-1' {...register('auth_email')} />
            	{errors.auth_email && <p className="text-red-500">	{errors.auth_email.message}</p>}
						</div>

            <div>
							<Label>Passport Number</Label>
            	<Input className='mt-3 mb-1' {...register('passport_number')} />
            	{errors.passport_number && <p className="text-red-500">	{errors.passport_number.message}</p>}
						</div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
							<Label>Bank Name</Label>
            	<Input className='mb-0' {...register('bank_name')} />
            	{errors.bank_name && <p className="text-red-500">	{errors.bank_name.message}</p>}
						</div>

            <div>
							<Label>Bank Address</Label>
            	<Input className='mt-3 mb-1' {...register('bank_address')} />
            	{errors.bank_address && <p className="text-red-500">	{errors.bank_address.message}</p>}
						</div>

            <div>
							<Label>Account Number</Label>
            	<Input className='mt-3 mb-1' {...register('bank_account_number')} />
            	{errors.bank_account_number && <p className="text-red-500">	{errors.bank_account_number.message}</p>}
						</div>

            <div>
							<Label>IBAN</Label>
            	<Input className='mt-3 mb-1' {...register('iban')} />
            	{errors.iban && <p className="text-red-500">	{errors.iban.message}</p>}
						</div>

            <div>
							<Label>Bank Officer Email</Label>
            	<Input className='mt-3 mb-1' {...register('bank_officer_email')} />
            	{errors.bank_officer_email && <p className="text-red-500">	{errors.bank_officer_email.message}</p>}
						</div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
							<Label>Lawyer Name</Label>
            	<Input className='mt-3 mb-1' {...register('lawyer_name')} />
            	{errors.lawyer_name && <p className="text-red-500">	{errors.lawyer_name.message}</p>}
						</div>

            <div>
							<Label>Lawyer Email</Label>
            	<Input className='mt-3 mb-1' {...register('lawyer_email')} />
            	{errors.lawyer_email && <p className="text-red-500">	{errors.lawyer_email.message}</p>}
						</div>

            <div>
							<Label>Contact Name</Label>
            	<Input className='mt-3 mb-1' {...register('contact_name')} />
            	{errors.contact_name && <p className="text-red-500">	{errors.contact_name.message}</p>}
						</div>

            <div>
							<Label>Contact Email</Label>
            	<Input className='mt-3 mb-1' {...register('contact_email')} />
            	{errors.contact_email && <p className="text-red-500">	{errors.contact_email.message}</p>}
						</div>
          </>
        )}

        {step === 4 && (
          <>
            <div>
							<Label>Business Description</Label>
            <Textarea {...register('description')} />
            	{errors.description && <p className="text-red-500">	{errors.description.message}</p>}
						</div>
          </>
        )}

        {step === 5 && (
          <>
            <div>
							<Label>Declaration Name</Label>
            	<Input className='mt-3 mb-1' {...register('declaration_name')} />
            	{errors.declaration_name && <p className="text-red-500">	{errors.declaration_name.message}</p>}
						</div>

            <div>
							<Label>Company</Label>
            	<Input className='mt-3 mb-1' {...register('declaration_company')} />
            	{errors.declaration_company && <p className="text-red-500">	{errors.declaration_company.message}</p>}
						</div>

            <div>
							<Label>Passport Number</Label>
            	<Input className='mt-3 mb-1' {...register('declaration_passport')} />
            	{errors.declaration_passport && <p className="text-red-500">	{errors.declaration_passport.message}</p>}
						</div>
          </>
        )}

        {step === 6 && (
          <>
            <div>
							<Label>Attach Passport</Label>
            	<Input
								type="file"
								onChange={(e) => {
									const file = e.target.files?.[0]
									if (file) {
										setValue('passport_file', file)
									}
								}}
							/>
            	{errors.passport_file && <p className="text-red-500">	{errors.passport_file.message}</p>}
						</div>

            <div>
							<Label>Attach Certificate</Label>
            	<Input
								type="file"
								onChange={(e) => {
									const file = e.target.files?.[0]
									if (file) {
										setValue('certificate_file', file)
									}
								}}
							/>
            	{errors.certificate_file && <p className="text-red-500">	{errors.certificate_file.message}</p>}
						</div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {step > 0 && <Button type="button" variant="outline" onClick={backStep}>Back</Button>}

          {step < 6 ? (
            <Button className='ml-auto' type="button" onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
