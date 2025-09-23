'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react'

import Step1BasicInfo from './steps/Step1BasicInfo'
import Step2Contact from './steps/Step2Contact'
import Step3AuthorizedSignatory from './steps/Step3AuthorizedSignatory'
import Step4BusinessInfo from './steps/Step4BusinessInfo'
import Step5Documents from './steps/Step5Documents'

import { formSchema, FormSchema } from "./schema"

const STORAGE_KEY = 'cis_form_data'

export default function CISForm() {
  const unsubscribeRef = useRef<() => void | null>(null)
  const [step, setStep] = useState(0)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const storedValues = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const defaultValues = storedValues ? JSON.parse(storedValues) : undefined

  const [entityType, setEntityType] = useState<'Individual' | 'Company'>(
    defaultValues?.entity_type || 'Individual'
  )
  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues,
  })

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    setError,     
    clearErrors,
    formState: { errors },
  } = methods

  // watch entityType field inside the form
  const entityTypeValue = watch('entity_type')

  // when the user changes entityType, reset with new schema
  useEffect(() => {
    if (entityTypeValue && entityTypeValue !== entityType) {
      setEntityType(entityTypeValue as 'Individual' | 'Company')
      reset(methods.getValues())
      setStep(0)
    }
  }, [entityTypeValue])

  // keep saving to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      if (!submitted) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      }
    })
    unsubscribeRef.current = subscription.unsubscribe
    return () => subscription.unsubscribe()
  }, [watch, submitted])

  const fullSteps = useMemo(
    () => [
      'Basic Identification',
      'Contact Information',
      ...(entityType === 'Individual' ? [] : ['Authorized Signatory']),
      'Business Info',
      'Document Uploads',
    ],
    [entityType]
  )

  const stepFields = useMemo(() => {
    let i = 0
    const fields: Record<number, (keyof FormSchema)[]> = {}
    fields[i++] = ['company_name', 'entity_type', 'registration_number', 'country_registered', 'dob_or_incorporation']
    fields[i++] = ['mailing_address', 'phone', 'auth_email', 'website']
    if (entityType !== 'Individual') fields[i++] = ['authorized_name', 'title', 'passport_number', 'authorized_contact']
    fields[i++] = ['business_type', 'description', 'trading_experience', 'erc_20_wallet', 'trc_20_wallet']
    fields[i++] = ['passport_file', 'certificate_file']
    return fields
  }, [entityType])

  const nextStep = async () => {
    const valid = await trigger(stepFields[step])
    if (!valid) return
    if (step === fullSteps.indexOf("Business Info")) {
      const btc = watch("btc_wallet")?.trim()
      const erc = watch("erc_20_wallet")?.trim()
      const trc = watch("trc_20_wallet")?.trim()

      // regex for format checks (simple examples)
      const btcRegex = /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59})$/
      const ethRegex = /^0x[a-fA-F0-9]{40}$/
      const trcRegex = /^T[a-zA-Z0-9]{33}$/

      let hasAtLeastOne = false

      if (btc) {
        hasAtLeastOne = true
        if (!btcRegex.test(btc)) {
          setError("btc_wallet", { type: "manual", message: "Invalid BTC wallet format" })
        }
      } else {
        clearErrors("btc_wallet")
      }

      if (erc) {
        hasAtLeastOne = true
        if (!ethRegex.test(erc)) {
          setError("erc_20_wallet", { type: "manual", message: "Invalid ERC-20 wallet format" })
        }
      } else {
        clearErrors("erc_20_wallet")
      }

      if (trc) {
        hasAtLeastOne = true
        if (!trcRegex.test(trc)) {
          setError("trc_20_wallet", { type: "manual", message: "Invalid TRC-20 wallet format" })
        }
      } else {
        clearErrors("trc_20_wallet")
      }

      if (!hasAtLeastOne) {
        // none filled → add manual error to all three
        setError("btc_wallet", { type: "manual", message: "Fill at least one wallet" })
        setError("erc_20_wallet", { type: "manual", message: "Fill at least one wallet" })
        setError("trc_20_wallet", { type: "manual", message: "Fill at least one wallet" })
        return
      }

      // stop if any format errors exist
      const walletErrors = errors.btc_wallet || errors.erc_20_wallet || errors.trc_20_wallet
      if (walletErrors) return
    }

    setStep((s) => s + 1)
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
      setMessage('❌ Please complete all required fields.')
      setSubmitting(false)
      return
    }

    const formData = new FormData()

    // Add required _wpcf7 hidden fields once
    formData.append('_wpcf7', '13')
    formData.append('_wpcf7_version', '5.9.3')
    formData.append('_wpcf7_locale', 'en_US')
    formData.append('_wpcf7_unit_tag', 'wpcf7-f13-o1')
    formData.append('_wpcf7_container_post', '0')

    Object.entries(data).forEach(([key, val]) => {
      const fieldKey = key.replace(/_/g, '-')
      if (val instanceof File) {
        formData.append(fieldKey, val)
      } else {
        formData.append(fieldKey, val || '')
      }
    })

    try {
      const res = await fetch('https://nchsltdadmin.com/wp-json/contact-form-7/v1/contact-forms/13/feedback', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()

      if (result.status === 'mail_sent') {
        localStorage.removeItem(STORAGE_KEY)
        setSubmitted(true)
        setMessage('✅ Form submitted successfully!')
        unsubscribeRef.current?.()
      } else {
        setMessage('❌ Submission failed: ' + result.message)
      }
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

        {step === 0 && <Step1BasicInfo />}
        {step === 1 && <Step2Contact />}
        {step === 2 && entityType !== 'Individual' && <Step3AuthorizedSignatory />}
        {(step === 2 && entityType === 'Individual') || (step === 3 && entityType !== 'Individual') ? (
          <Step4BusinessInfo />
        ) : null}
        {(step === 3 && entityType === 'Individual') || (step === 4 && entityType !== 'Individual') ? (
          <Step5Documents />
        ) : null}

        <div className="flex justify-between pt-4 gap-4">
          {step > 0 && (
            <Button type="button" onClick={backStep} variant="outline"
              size="lg"
              className="bg-gray-400 text-black"
            >
              <ArrowLeft className="h-5 w-5" />Back
            </Button>
          )}
          {step < fullSteps.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              size="lg"
              variant="outline"
              className={`${step > 0 ? 'flex-1' : 'w-full'} bg-white text-black`}
            >
              Next <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              type="submit" disabled={submitting}
              size="lg"
              variant="outline"
              className={`${step > 0 ? 'flex-1' : 'w-full'} bg-green-500 hover:bg-green-600 border-green-500 text-white`}
            >
              <Rocket className="h-5 w-5"/>{submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </div>
        {message && <p className="text-center font-semibold pt-4">{message}</p>}
      </form>
    </FormProvider>
  )
}
