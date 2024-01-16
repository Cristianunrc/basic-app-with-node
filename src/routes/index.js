import { Router } from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const router = Router()

router.get('/', (req, res) => res.render('index', { title: 'Home' }))

router.get('/about', (req, res) => res.render('about', { title: 'About' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }))

router.get('/success', (req, res) => res.render('success', {title: 'Response', successMessage: true }))

router.post('/send-email', async (req, res) => {
  
  const { email, message } = req.body;

  if (!email || !message) {
    const response = res.status(400).send({errorMessage: 'Email and message are required'})
    return response
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'New message of NodeJS app',
    text: `The user with email ${email} says:\n\n${message}`
  })
  
  res.redirect('/success')
})

export default router