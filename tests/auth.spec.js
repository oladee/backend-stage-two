const request = require('supertest')
const app = require('../api/index')
describe('Authenticate user into the application', () => {
    it('Should Register User Successfully with Default Organisation', (done) => {

        request(app).post('/auth/register').send({
            firstName : 'tunes',
            lastName  : 'kiddy',
            email : 'lad@gmail.com',
            password : "BAMI1"
        })
        .then((respone)=>{
            expect(respone.body).toHaveProperty('data')
            done()
        })
       
    })
    it('Should Log the user in successfully', (done) => {

        request(app).post('/auth/login').send({
            email : 'lad@gmail.com',
            password : "BAMI1"
        })
        .then((respone)=>{
            expect(respone.body.data).toHaveProperty('accessToken')
            expect(respone.body.data).toHaveProperty('user')
            done()
        })
    })
    it('Should Fail If firstName Field is Missing', (done) => {

        request(app).post('/auth/register').send({
            lastName  : 'kiddy',
            email : 'lade@gmail.com',
            password : "BAMI1"
        })
        .then((respone)=>{
            expect(respone.statusCode).toEqual(422)
            expect(respone.body).toEqual({errors : [
                {
                field : 'firstName',
                message : "firstName cannot be empty"
                }
            ]})
            done()
        })
    })
    it('Should Fail If lastName Field is Missing', (done) => {

        request(app).post('/auth/register').send({
            firstName : 'tunes',
            email : 'lade@gmail.com',
            password : "BAMI1"
        })
        .then((respone)=>{
            expect(respone.statusCode).toEqual(422)
            expect(respone.body).toEqual({errors : [
                {
                field : 'lastName',
                message : "lastName cannot be empty"
                }
            ]})
            done()
        })
    })
    it('Should Fail If email Field is Missing', (done) => {

        request(app).post('/auth/register').send({
            firstName : 'tunes',
            lastName  : 'kiddy',
            password : "BAMI1"
        })
        .then((respone)=>{
            expect(respone.statusCode).toEqual(422)
            expect(respone.body).toEqual({errors : [
                {
                field : 'email',
                message : "email cannot be empty"
                }
            ]})
            done()
        })
    })
    it('Should Fail If password Field is Missing', (done) => {

        request(app).post('/auth/register').send({
            firstName : 'tunes',
            lastName  : 'kiddy',
            email : 'lade@gmail.com',
        })
        .then((respone)=>{
            expect(respone.statusCode).toEqual(422)
            expect(respone.body).toEqual({errors : [
                {
                field : 'password',
                message : "password cannot be empty"
                }
            ]})
            done()
        })
    })
    it("Should Fail if there's Duplicate Email or UserID", (done) => {

        request(app).post('/auth/register').send({
            firstName : 'tunes',
            lastName  : 'kiddy',
            email : 'ladifa@gmail.com',
            password : 'BAMI1'
        })
        .then(()=>{
            request(app).post('/auth/register').send({
                firstName : 'tunes',
                lastName  : 'kiddy',
                email : 'ladifa@gmail.com',
                password : 'BAMI1'
            })
            .then((respone)=>{
                expect(respone.statusCode).toEqual(422)
                expect(respone.body).toEqual({errors : [
                    {
                    field : 'email',
                    message : "email must be unique"
                    }
                ]})
                done()
            })
        })
        
        
    })
  })