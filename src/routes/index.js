import { Router } from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import validator from 'validator'
import rateLimit from 'express-rate-limit'

dotenv.config()

const router = Router()

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2,
  message: 'Too many email requests, please try again after a few minutes'
})

router.get('/', (req, res) => res.render('index', { title: 'Home' }))

router.get('/projects', (req, res) => res.render('projects', { title: 'Projects' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact', siteKey: process.env.RECAPTCHA_SITE_KEY }))

router.get('/success', (req, res) => res.render('success', {title: 'Response', successMessage: true }))

router.get('/tech-stack', (req, res) => res.render('tech-stack', {title: 'Technologies'}))

router.post('/send-email', emailLimiter, async (req, res) => {  
  const { email, message } = req.body;
  const validEmail = validator.isEmail(email)

  if (!email || !validEmail) {
    return res.status(400).render('contact', {
      title: 'Contact',
      errorMessage: 'Email is required or invalid email address'
    })
  }

  const sanitizedMessage = validator.escape(message)
  if (!sanitizedMessage || sanitizedMessage.trim() == "") {
    return res.status(400).render('contact', {
      title: 'Contact',
      errorMessage: 'Message is required'
    })
  }

  try {
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
      to: process.env.EMAIL_MANAGER,
      subject: 'New message from your web site',
      text: `The user with email ${email} says:\n\n${message}`
    })
    res.redirect('/success')
  } catch (error) {
    return res.status(500).render('contact', {
      title: 'Contact',
      errorMessage: 'An error ocurred while sending the email. Please try again'
    })
  }
})

export default router