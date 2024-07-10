const User = require('../models/user.model')
const Organisation = require('../models/organisation.model')
const bcrypt = require('bcrypt')
const issueJwtUser = require('../utils/issueJwt')

const register = async (req,res,next)=>{
    let errors = []
    const {firstName, lastName, email, password, phone} = req.body
    if(!firstName){
     errors.push({
         field : 'firstName',
         message : "firstName cannot be empty"
     })
    }
    if(!lastName){
     errors.push({
         field : 'lastName',
         message : "lastName cannot be empty"
     })
    }
    if(!email){
     errors.push({
         field : 'email',
         message : "email cannot be empty"
     })
    }
    if(!password){
     errors.push({
         field : 'password',
         message : "password cannot be empty"
     })
    }
    if(email){
     const user = await User.findOne({where : {email}})
     if(user){
         errors.push({
             field : 'email',
             message : "email must be unique"
         })
     }
    }
    if(errors.length > 0){
     res.status(422).send({errors})
    }else{
     try {
         const saltRounds = Number(process.env.SALT_ROUNDS)
     bcrypt.hash(password, saltRounds, async(err, hashPw)=>{
         const organ = await Organisation.create({
             name : `${firstName}'s Organisation`
         })
          await User.create({
             ...req.body, password : hashPw, orgId : organ.id
         })
         .then(async (user)=>{
             await user.addOrganisation(organ, {through : {UserId : user.userId, OrganisationId : organ.OrganisationId}})
             const toBeIssuedJwt = issueJwtUser(user)
             res.status(201).send({
                 status : 'success',
                 message : 'Registration successful',
                 data : {
                     accessToken : toBeIssuedJwt.token,
                     user : {
                         userId : user.userId,
                         firstName : user.firstName,
                         lastName : user.lastName,
                         email : user.email,
                         phone : user.phone,
                         organisation : organ
                     }
                 }
             })
         })
         .catch((err)=>{
             console.log(err)
             res.status(400).send({
                 status: "Bad request",
                 message: "Registration unsuccessful",
                 statusCode: 400
             })
         })
     })
     } catch (error) {
         res.status(400).send({
             status: "Bad request",
             message: "Registration unsuccessful",
             statusCode: 400
         })
     }
    }
 }


 const login = async(req,res,next)=>{
    const {email,password} = req.body
    if(!email || !password){
        if(!email){
            errors.push({
                field : 'email',
                message : "email cannot be empty"
            })
        }
        if(!password){
            errors.push({
                field : 'password',
                message : "password cannot be empty"
            })
        }
        return res.status(422).send({errors})
    }else{
        try {
            const user = await User.findOne({where :{email}})
            if(user){
                const match = bcrypt.compareSync(password, user.password)
                if(match){
                    const toBeIssuedJwt = issueJwtUser(user)
                    res.status(200).send({
                        status : 'success',
                        message : 'Login successful',
                        data : {
                            accessToken : toBeIssuedJwt.token,
                            user : {
                                userId : user.userId,
                                firstName : user.firstName,
                                lastName : user.lastName,
                                email : user.email,
                                phone : user.phone
                            }
                        }
                    })
                }else{
                    return res.status(401).json({
                        status: "Bad request",
                        message: "Authentication failed: Wrong Password",
                        statusCode: 401,
                      });
                }
            }else{
                res.status(401).send({
                    message: "User not found",
                    status: "Bad request",
                    statusCode: 401
                })
            }
        } catch (error) {
            res.status(401).send({
                message: "Authentication failed",
                status: "Bad request",
                statusCode: 401
            })
        }
    }
}


 module.exports = {register, login}