import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

router.get('/', (req, res) => res.render('index', { title: 'Home' }))

router.get('/about', (req, res) => res.render('about', { title: 'About' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }))

// router.get('/success', (req, res) => res.render('success', { title: 'Response' }))

router.post('/send-email', async (req, res) => {
  
  const { email, message } = req.body;

  if (!email || !message) {
    const response = res.status(400).send('success', {errorMessage: 'Email and message are required'})
    return response
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'cristiankhan23@gmail.com',
      pass: 'xpdd jwja gjkg plnr'
    }
  })

  const info = await transporter.sendMail({
    from: 'cristiankhan23@gmail.com',
    to: 'cristiankhan23@gmail.com',
    subject: 'New message of NodeJS app',
    text: `The user with email ${email} says:\n\n${message}`
  })
  
  res.render('success', {title: 'Response', successMessage: true})
})

export default router