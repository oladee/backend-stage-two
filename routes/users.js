var express = require('express');
const passport = require('passport');
var router = express.Router();
const User = require('../models/user.model');
const Organisation = require('../models/organisation.model');
const asynchandler = require('express-async-handler')
const userController = require('../controllers/user.controller')

// gets their own record or user record in organisations they belong to or created (PROTECTED)

router.get('/users/:id',passport.authenticate('jwt',{session : false}), asynchandler(userController.getRecord))

// GET all organisations associated with a user (PROTECTED)
router.get('/organisations',passport.authenticate('jwt',{session : false}), asynchandler(userController.getAllOrganisation))

// POST create new organisation (PROTECTED)
router.post('/organisations',passport.authenticate('jwt',{session : false}), asynchandler(userController.createNewOrganisation))

// GET organisation details (PROTECTED)
router.get('/organisations/:orgId',passport.authenticate('jwt',{session : false}), asynchandler(userController.getOrganisationDetails))

// POST add user to an organisation (PROTECTED)
router.post('/organisations/:orgId/users',passport.authenticate('jwt',{session : false}), asynchandler(userController.addUserToOrganisation))

module.exports = router;
