import InputGroup from '../InputGroup'

export default function Step2Contact() {
  return (
    <>
      <InputGroup label="Mailing Address" field="mailing_address" />
      <InputGroup label="Phone" field="phone" />
      <InputGroup label="Email" field="auth_email" />
      <InputGroup label="Website" field="website" />
    </>
  )
}
