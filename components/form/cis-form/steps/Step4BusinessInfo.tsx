import InputGroup from '../InputGroup'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormContext } from 'react-hook-form'

export default function Step4BusinessInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <InputGroup label="Business Type" field="business_type" />
      <div>
        <Label>Description</Label>
        <Textarea className="mt-2" {...register('description')} />
        {errors.description?.message && (
          <p className="text-red-500">{String(errors.description.message)}</p>
        )}
      </div>
      <InputGroup label="Trading Experience" field="trading_experience" />
      <InputGroup label="ERC-20 Wallet Address" field="erc_20_wallet" />
      <InputGroup label="TRC-20 Wallet Address" field="trc_20_wallet" />
    </>
  )
}
