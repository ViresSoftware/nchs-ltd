'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormContext } from 'react-hook-form'
import type { FormSchema } from './schema'

export default function FileInputGroup({
  label,
  field,
}: {
  label: string
  field: keyof FormSchema
}) {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<FormSchema>()

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="file"
        accept={
          field === 'passport_file'
            ? '.pdf,.doc,.docx,.jpg,.jpeg,.png,.heic,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/jpg,image/heic'
            : '.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        onChange={(e) => {
          const file = e.target.files?.[0]
          setValue(field, file)
        }}
      />
      {errors[field] && (
        <p className="text-red-500 text-sm">{errors[field]?.message as string}</p>
      )}
    </div>
  )
}
