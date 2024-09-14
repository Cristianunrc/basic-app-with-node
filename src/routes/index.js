import { Router } from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import validator from 'validator'
import rateLimit from 'express-rate-limit'

dotenv.config()

const router = Router()

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many email requests, please try again after a few minutes'
})
 
router.get('/', (req, res) => res.render('index', { title: 'Home' }))

router.get('/projects', (req, res) => res.render('projects', { title: 'Projects' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }))

router.get('/success', (req, res) => res.render('success', {title: 'Response', successMessage: true }))

router.post('/send-email', emailLimiter, async (req, res) => {  
  const { email, message } = req.body;
  const validEmail = validator.isEmail(email)

  if (!email || !validEmail) {
    res.status(400).send({errorMessage: 'Invalid email address'})
  }

  const sanitizedMessage = validator.escape(message)
  if (!sanitizedMessage || sanitizedMessage.trim() == "") {
    return res.status(400).send({errorMessage: 'Message is required'})
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
    res.status(500).send({errorMessage: 'An error ocurred while sending the email'})
  }
})

export default router