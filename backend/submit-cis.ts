import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

const sql = neon(process.env.DATABASE_URL as string)
const app = new Hono()

// Enable CORS
app.use('/submit-cis', cors())
app.use('/submit-contact', cors())

// 📄 CIS FORM HANDLER
app.post('/submit-cis', async (c) => {
  try {
    const formData = await c.req.formData()
    const json = formData.get('form')?.toString()
    const data = JSON.parse(json || '{}')

    const passport_file_url = 'https://example.com/passport.pdf' // Replace with uploaded file URL
    const certificate_file_url = 'https://example.com/certificate.pdf'

    await sql`
      INSERT INTO cis_submissions (
        company_name, entity_type, registration_number, country_registered, dob_or_incorporation,
        mailing_address, phone, auth_email, website,
        authorized_name, title, passport_number, authorized_contact,
        bank_name, bank_address, bank_account_name, iban, swift_code,
        business_type, description, trading_experience,
        passport_file_url, certificate_file_url
      ) VALUES (
        ${data.company_name}, ${data.entity_type}, ${data.registration_number}, ${data.country_registered}, ${data.dob_or_incorporation},
        ${data.mailing_address}, ${data.phone}, ${data.auth_email}, ${data.website},
        ${data.authorized_name}, ${data.title}, ${data.passport_number}, ${data.authorized_contact},
        ${data.bank_name}, ${data.bank_address}, ${data.bank_account_name}, ${data.iban}, ${data.swift_code},
        ${data.business_type}, ${data.description}, ${data.trading_experience},
        ${passport_file_url}, ${certificate_file_url}
      )
    `


    return c.json({ success: true })
  } catch (err) {
    return c.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }, 500)
  }
})

// 📩 CONTACT FORM HANDLER
app.post('/submit-contact', async (c) => {
  try {
    const { first_name, last_name, email, message } = await c.req.json()

    await sql`
      INSERT INTO contact_submissions (first_name, last_name, email, message)
      VALUES (${first_name}, ${last_name}, ${email}, ${message})
    `

    return c.json({ success: true })
  } catch (err) {
    return c.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }, 500)
  }
})

const PORT = Number(process.env.PORT) || 5000
console.log(`✅ Starting server on http://localhost:${PORT}`)
serve({ fetch: app.fetch, port: PORT })
