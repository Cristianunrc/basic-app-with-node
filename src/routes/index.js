import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

router.get('/', (req, res) => res.render('index', { title: 'Home' }))

router.get('/about', (req, res) => res.render('about', { title: 'About' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact' }))

router.get('/success', (req, res) => res.render('success'))

router.post('/send-email', async (req, res) => {
  const { email, message } = req.body;

  const contentHTML =  `
    <h1>Email information</h1>
    <ul>
      <li>Email: ${email}</li>
    </ul>
    <p>${message}</p>
  `;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // forwardemail.net
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
    subject: 'Website content form',
    text: 'Hello world'
  })

  console.log('Message sent', info.messageId)
  
  res.redirect('success')
})

export default router