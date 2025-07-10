import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
const nodemailer = require('nodemailer')

dotenv.config()

const sql = neon(process.env.DATABASE_URL as string)
const app = new Hono()

// Enable CORS
app.use('/submit-cis', cors())
app.use('/submit-contact', cors())

// 🔑 Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

// 📄 CIS FORM HANDLER
app.post('/submit-cis', async (c) => {
  try {
    const formData = await c.req.formData()
    const json = formData.get('form')?.toString()
    const data = JSON.parse(json || '{}')

    const passport_file_url = 'https://example.com/passport.pdf'
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

    // ✉️ Send email
    await transporter.sendMail({
      from: `"NCHS CIS Form" <${process.env.MAIL_USER}>`,
      to: 'dev@viressoftware.com',
      subject: 'New CIS Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #004085;">New CIS Form Submission</h2>
          <h3>1. Basic Identification</h3>
          <ul>
            <li><strong>Company Name:</strong> ${data.company_name}</li>
            <li><strong>Entity Type:</strong> ${data.entity_type}</li>
            <li><strong>Registration Number:</strong> ${data.registration_number}</li>
            <li><strong>Country Registered:</strong> ${data.country_registered}</li>
            <li><strong>DOB/Incorporation:</strong> ${data.dob_or_incorporation}</li>
          </ul>

          <h3>2. Contact Information</h3>
          <ul>
            <li><strong>Mailing Address:</strong> ${data.mailing_address}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Email:</strong> ${data.auth_email}</li>
            <li><strong>Website:</strong> ${data.website || 'N/A'}</li>
          </ul>

          <h3>3. Authorized Signatory</h3>
          <ul>
            <li><strong>Name:</strong> ${data.authorized_name}</li>
            <li><strong>Title:</strong> ${data.title}</li>
            <li><strong>Passport Number:</strong> ${data.passport_number}</li>
            <li><strong>Authorized Contact:</strong> ${data.authorized_contact}</li>
          </ul>

          <h3>4. Banking Details</h3>
          <ul>
            <li><strong>Bank Name:</strong> ${data.bank_name}</li>
            <li><strong>Bank Address:</strong> ${data.bank_address}</li>
            <li><strong>Account Name:</strong> ${data.bank_account_name}</li>
            <li><strong>IBAN:</strong> ${data.iban}</li>
            <li><strong>SWIFT Code:</strong> ${data.swift_code}</li>
          </ul>

          <h3>5. Business Info</h3>
          <ul>
            <li><strong>Type:</strong> ${data.business_type}</li>
            <li><strong>Description:</strong> ${data.description}</li>
            <li><strong>Trading Experience:</strong> ${data.trading_experience || 'N/A'}</li>
          </ul>

          <h3>6. Documents</h3>
          <ul>
            <li><strong>Passport File:</strong> <a href="${passport_file_url}">View Passport</a></li>
            <li><strong>Certificate File:</strong> <a href="${certificate_file_url}">View Certificate</a></li>
          </ul>
        </div>
      `,
    })

    return c.json({ success: true })
  } catch (err) {
    return c.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, 500)
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

    // ✉️ Email for contact form
    await transporter.sendMail({
      from: `"NCHS Contact Form" <${process.env.MAIL_USER}>`,
      to: 'info@nchsltd.com',
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #004085;">New Contact Message</h2>
          <ul>
            <li><strong>Name:</strong> ${first_name} ${last_name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Message:</strong> <p>${message}</p></li>
          </ul>
        </div>
      `,
    })

    return c.json({ success: true })
  } catch (err) {
    return c.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// Start server with async wrapper
const main = async () => {
  const PORT = Number(process.env.PORT) || 5000
  const HOST = process.env.HOST || 'localhost'
  console.log(`✅ Server running at http://${HOST}:${PORT}`)
  await serve({ fetch: app.fetch, port: PORT })
}

main()
