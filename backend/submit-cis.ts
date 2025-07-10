import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
const nodemailer = require('nodemailer')

dotenv.config()

const sql = neon(process.env.DATABASE_URL as string)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const app = new Hono()

// Enable CORS
app.use('/submit-cis', cors())
app.use('/submit-contact', cors())

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

// Utility: Upload file to Supabase Storage
const uploadToSupabase = async (file: File, folder: string) => {
  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = `${folder}/${Date.now()}_${file.name}`
  const { error } = await supabase.storage
    .from('cis-uploads')
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw new Error('Upload failed: ' + error.message)

  const { data } = supabase.storage
    .from('cis-uploads')
    .getPublicUrl(filePath)

  return data.publicUrl
}

// 📄 CIS Form Submission
app.post('/submit-cis', async (c) => {
  try {
    const formData = await c.req.formData()
    const json = formData.get('form')?.toString()
    const data = JSON.parse(json || '{}')

    const passport = formData.get('passport')
    const certificate = formData.get('certificate')

    if (!(passport instanceof File) || !(certificate instanceof File)) {
      return c.json({ success: false, error: 'Missing or invalid file(s)' }, 400)
    }

    const passportUrl = await uploadToSupabase(passport, 'passport')
    const certificateUrl = await uploadToSupabase(certificate, 'certificate')

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
        ${passportUrl}, ${certificateUrl}
      )
    `

    await transporter.sendMail({
      from: `"NCHS CIS Form" <${process.env.MAIL_USER}>`,
      to: 'info@nchsltd.com',
      subject: 'New CIS Form Submission',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New CIS Form Submission</h2>
          <p><strong>Company:</strong> ${data.company_name}</p>
          <p><strong>Entity:</strong> ${data.entity_type}</p>
          <p><strong>Registration #:</strong> ${data.registration_number}</p>
          <p><strong>Authorized:</strong> ${data.authorized_name}</p>
          <p><strong>Email:</strong> ${data.auth_email}</p>
          <p><strong>Passport File:</strong> <a href="${passportUrl}">View</a></p>
          <p><strong>Certificate File:</strong> <a href="${certificateUrl}">View</a></p>
        </div>`
    })

    return c.json({ success: true })
  } catch (err) {
    return c.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// 📩 Contact Form Submission
app.post('/submit-contact', async (c) => {
  try {
    const { first_name, last_name, email, message } = await c.req.json()

    await sql`
      INSERT INTO contact_submissions (first_name, last_name, email, message)
      VALUES (${first_name}, ${last_name}, ${email}, ${message})
    `

    await transporter.sendMail({
      from: `"NCHS Contact Form" <${process.env.MAIL_USER}>`,
      to: 'info@nchsltd.com',
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Support Message</h2>
          <p><strong>Name:</strong> ${first_name} ${last_name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>`
    })

    return c.json({ success: true })
  } catch (err) {
    return c.json({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// 🚀 Start the server
const main = async () => {
  const PORT = Number(process.env.PORT) || 5000
  const HOST = process.env.HOST || 'localhost'
  console.log(`✅ Server running at http://${HOST}:${PORT}`)
  await serve({ fetch: app.fetch, port: PORT })
}

main()
