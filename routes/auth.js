const router = require('express').Router()
const asynchandler = require('express-async-handler')
const authController = require('../controllers/auth.controller')

router.post('/register',asynchandler(authController.register))


router.post('/login', asynchandler(authController.login))



module.exports = router