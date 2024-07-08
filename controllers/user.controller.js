const User = require('../models/user.model');
const Organisation = require('../models/organisation.model');

const getRecord = async(req,res,next)=>{
    if(req.isAuthenticated()){
      try {
        const userId = req.params.id
        const userDetails = await User.findOne({where : {userId}, attributes : { exclude: ['password', 'createdAt', 'updatedAt', 'id'] }})
        res.status(200).send({
          status : 'success',
          message : 'Welcome',
          data : {
            ...userDetails
          }
        })
      } catch (error) {
        res.send(error)
      }
    }else {
      res.status(401).send('Unauthorized')
    }
  }

  const getAllOrganisation = async(req,res,next)=>{

    try {
      const result = await User.findOne({
        where : {email : req.user.email},
        include : {
          model : Organisation,
          attributes : ['orgId', 'name', 'description'],
          through: {
            attributes: [],  
          },

        },
    })
    res.status(200).send({
      status : 'success',
      message : 'Welcome',
      organisations : [...result.Organisations]
    })
      
    } catch (error) {
      res.status(400).send({
        "status": "Bad Request",
        "message": "Client error",
        "statusCode": 400
    })
    }
}

const createNewOrganisation = async(req,res,next)=>{
    if(req.isAuthenticated()){
      const {name, description} = req.body
      const userId = req.user.userId
      console.log(userId)
      if(!name){
        res.status(422).send({
          field : 'name',
          message : "name cannot be empty"
      })
      }else{
        try {
  
            const organ = await Organisation.create({
                ...req.body,
                name : `${name}'s Organisation`
            })
  
  
            const user = await User.findOne({ where : {firstName : 'oladee'}})
  
            await user.addOrganisation(organ, {through : {UserId : user.userId, OrganisationId : organ.orgId}})
  
            res.status(200).send({
              status : 'success',
              message : 'Organisation created successfully',
              data : {
                orgId : organ.orgId,
                name : organ.name,
                description : organ.description
              }
            })
  
        } catch (error) {
          res.status(400).send({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400
        })
        }
      }
    }
  }
  
  const getOrganisationDetails = async(req,res,next)=>{
    try {
      const orgDetails = await Organisation.findOne({
        where : {orgId : req.params.orgId}, include : {
         model : User,
         through: {
           attributes: [],  
         }
       }
     })
       const newey = orgDetails.Users.filter((x)=> x.userId == req.user.userId)
       if(newey.length > 0 ){
         res.send({
           status : 'success',
           message : 'Welcome',
           data : {
             orgId : orgDetails.orgId,
             name : orgDetails.name,
             description : orgDetails.description
           }
         })
       }else{
         res.status(401).send('Unauthorized')
       }
    } catch (error) {
      res.status(400).send({
        "status": "Bad Request",
        "message": "Client error",
        "statusCode": 400
    })
    }
  }

  const addUserToOrganisation = async (req,res,next)=>{
    const orgId = req.params.orgId
    const {userId} = req.body
    try {
      const orgDetails = await Organisation.findOne({
        where : {orgId}, include : {
         model : User,
         through: {
           attributes: [],  
         }
       }
     })
       const userDetails = await User.findOne({where : {userId}})
       const newey = orgDetails.Users.filter((x)=> x.userId == req.user.userId)
       if(newey.length > 0 ){
        const result = await userDetails.addOrganisation(orgDetails, {through : {UserId : userDetails.userId, OrganisationId : orgDetails.orgId}})
         res.send({
          result,
           status : 'success',
           message: "User added to organisation successfully",
         })
       }else{
         res.status(401).send('Unauthorized')
       }
    } catch (error) {
      res.status(400).send({
        "status": "Bad Request",
        "message": "Client error",
        "statusCode": 400
    })
    }
  }

  module.exports = {getRecord, getAllOrganisation, createNewOrganisation, getOrganisationDetails, addUserToOrganisation}