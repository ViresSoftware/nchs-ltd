import InputGroup from '../InputGroup'
import SelectGroup from '../SelectGroup'
import { entityTypes } from '../schema'

export default function Step1BasicInfo() {
  return (
    <>
      <InputGroup label="Full Name / Company Name" field="company_name" />
      <SelectGroup label="Entity Type" field="entity_type" options={entityTypes} />
      <InputGroup label="Registration Number" field="registration_number" />
      <InputGroup label="Country Registered" field="country_registered" />
      <InputGroup label="DOB or Incorporation" field="dob_or_incorporation" />
    </>
  )
}
