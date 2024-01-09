import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => res.render('index', { title: 'Init page' }))

router.get('/about', (req, res) => res.render('about', { title: 'About page' }))

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact page' }))

export default router