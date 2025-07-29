'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  label: string;
  field: string;
  type?: string;
}

export default function InputGroup({ label, field, type = 'text' }: Props) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <Label htmlFor={field}>{label}</Label>
      <Input id={field} {...register(field)} type={type} className="mt-2" />
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[field]?.message as string}
        </p>
      )}
    </div>
  );
}
