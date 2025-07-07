import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

const sql = neon('postgresql://neondb_owner:npg_lq7siZ3dpWDf@ep-sweet-sea-aenka0uu-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
const app = new Hono()

// ✅ Enable CORS for all origins (during development)
app.use('/submit-cis', cors())

app.post('/submit-cis', async (c) => {
  try {
    const data = await c.req.json()

    await sql`
      INSERT INTO cis_submissions (
        company_name, mailing_address, country_registered, registration_number, website,
        authorized_name, title, auth_email, passport_number,
        bank_name, bank_address, bank_account_number, iban, bank_officer_email,
        lawyer_name, lawyer_email, contact_name, contact_email,
        description,
        declaration_name, declaration_company, declaration_passport,
        passport_file_url, certificate_file_url
      ) VALUES (
        ${data.company_name}, ${data.mailing_address}, ${data.country_registered}, ${data.registration_number}, ${data.website},
        ${data.authorized_name}, ${data.title}, ${data.auth_email}, ${data.passport_number},
        ${data.bank_name}, ${data.bank_address}, ${data.bank_account_number}, ${data.iban}, ${data.bank_officer_email},
        ${data.lawyer_name}, ${data.lawyer_email}, ${data.contact_name}, ${data.contact_email},
        ${data.description},
        ${data.declaration_name}, ${data.declaration_company}, ${data.declaration_passport},
        ${data.passport_file_url}, ${data.certificate_file_url}
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

const PORT = Number(process.env.PORT) || 5000
console.log(`✅ Starting server on http://localhost:${PORT}`)
serve({ fetch: app.fetch, port: PORT })
