import InputGroup from '../InputGroup'

export default function Step3AuthorizedSignatory() {
  return (
    <>
      <InputGroup label="Authorized Name" field="authorized_name" />
      <InputGroup label="Title / Position" field="title" />
      <InputGroup label="Passport or ID Number" field="passport_number" />
      <InputGroup label="Contact Details" field="authorized_contact" />
    </>
  )
}
