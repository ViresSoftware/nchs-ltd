import { z } from 'zod'

export const entityTypes = ['Individual', 'Company'] as const

export const schema = z.object({
  erc_20_wallet: z.string().optional(),
  trc_20_wallet: z.string().optional(),
  btc_wallet: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{11,71})$/.test(val);
  }, {
    message: 'Enter a valid Bitcoin wallet address',
  }),

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
  business_type: z.string().min(1, 'Business type is required'),
  description: z.string().min(1, 'Description is required'),
  trading_experience: z.string().optional(),

  passport_file: z.custom<File>((file) => {
    if (!(file instanceof File)) return false
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/heic',
    ]
    return allowed.includes(file.type)
  }, {
    message: 'Passport file must be a PDF, Word document, or image (JPG, PNG, HEIC)',
  }),

  certificate_file: z.custom<File>((file) => {
    if (!(file instanceof File)) return true
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    return allowed.includes(file.type)
  }, {
    message: 'Certificate must be a PDF or Word document',
  }).optional(),

}).superRefine((data, ctx) => {
  // Wallet logic
  const ercValid = data.erc_20_wallet ? /^0x[a-fA-F0-9]{40}$/.test(data.erc_20_wallet) : false;
  const trcValid = data.trc_20_wallet ? /^T[a-zA-Z0-9]{33}$/.test(data.trc_20_wallet) : false;
  const btcValid = data.btc_wallet ? /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{11,71})$/.test(data.btc_wallet) : false;

  if (!ercValid && !trcValid && !btcValid) {
    ctx.addIssue({
      path: ['erc_20_wallet'],
      code: z.ZodIssueCode.custom,
      message: 'Enter a valid ERC-20, TRC-20, or BTC wallet address',
    })
    ctx.addIssue({
      path: ['trc_20_wallet'],
      code: z.ZodIssueCode.custom,
      message: 'Enter a valid ERC-20, TRC-20, or BTC wallet address',
    })
    ctx.addIssue({
      path: ['btc_wallet'],
      code: z.ZodIssueCode.custom,
      message: 'Enter a valid ERC-20, TRC-20, or BTC wallet address',
    })
  }

  // Company-specific fields
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
        ctx.addIssue({
          path: [key],
          code: z.ZodIssueCode.custom,
          message,
        })
      }
    }
  }
})

export type FormSchema = z.infer<typeof schema>
