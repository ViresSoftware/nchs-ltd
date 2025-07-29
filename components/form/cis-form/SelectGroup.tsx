'use client';

import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface Props {
  label: string;
  field: string;
  options: string[];
}

export default function SelectGroup({ label, field, options }: Props) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(field);

  return (
    <div>
      <Label>{label}</Label>
      <Select value={value as string} onValueChange={(val) => setValue(field, val)}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]?.message as string}</p>
      )}
    </div>
  );
}
