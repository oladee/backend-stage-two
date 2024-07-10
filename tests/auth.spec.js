const request = require('supertest')
const app = require('../api/index')

let accessToken = "";

async function userRegistration() {
  const userData = {
    firstName: "Oladee",
    lastName: "tunes",
    email: "tunes@example.com",
    password: "password123",
    phone: "1234567890",
  };

  await request(app)
    .post("/auth/register")
    .send(userData)
    .expect(201)
    .then((response) => {
      accessToken = response.body.data.accessToken;
    });
}

describe('Auth Endpoints', ()=>{
    describe('POST /auth/register', ()=>{
        it('Should register a new user ', async()=>{
            const userDetails = {
                firstName: "credit",
                lastName: "alert",
                email: "alerts@example.com",
                password: "creditalert",
                phone: "09048488923",
            }

            const expectedOrganisationName = `${userDetails.firstName}'s Organisation`

            const res = await request(app)
            .post("/auth/register")
            .send(userDetails)
            .expect(201);

            const { user, accessToken } = res.body.data;
            expect(res.body.status).toBe("success");

            expect(res.body.data.accessToken).toBeDefined();

            expect(res.body.data.user.email).toBe(userDetails.email);

            expect(user.userId).toBeTruthy();

            expect(user.firstName).toBe(userDetails.firstName);

            expect(user.lastName).toBe(userDetails.lastName);

            expect(user.email).toBe(userDetails.email);

            expect(user.phone).toBe(userDetails.phone);

            expect(accessToken).toBeTruthy();

            expect(user.organisation.name).toBe(expectedOrganisationName);
        })
        it("should fail if required fields are missing", async () => {
            const userDetails = {
              firstName: "creaty",
              lastName: "tidy",
              password: "yarnyarn",
              phone: "8230238023",
            };
      
            const res = await request(app)
            .post("/auth/register")
            .send(userDetails)
            .expect(422)
            expect(res.body.errors[0].field).toBe("email");
            expect(res.body.errors[0].message).toContain("email cannot be empty");
        });

        it('Should fail if duplicate email registration', async()=>{
            await userRegistration()

            const duplicateUserEmail = {
                firstName: "Oladee",
                lastName: "tunes",
                email: "tunes@example.com",
                password: "password123",
                phone: "1234567890",
            }
            
            await request(app)
            .post("/auth/register")
            .send(duplicateUserEmail)
            .expect(422)
            .expect((res) => {
            expect(res.body.errors[0].field).toBe("email");
            expect(res.body.errors[0].message).toContain("email must be unique");
            });
        })
    })

    describe('POST auth/login', ()=>{
        beforeEach(async ()=>{
            await userRegistration()
        })

        it('Should log in user successfully', async()=>{
            const credent = {
                email: "tunes@example.com",
                password: "password123",
            }
            await request(app)
            .post("/auth/login")
            .send(credent)
            .expect(200)
            .expect((res) => {
                const { user, accessToken } = res.body.data;
                expect(user.userId).toBeTruthy();
                expect(user.firstName).toBe("Oladee");
                expect(user.lastName).toBe("tunes");
                expect(user.email).toBe("tunes@example.com");
                expect(accessToken).toBeTruthy();
            });
        })

        it('Should fail is credentials are wrong', async()=>{
            const incorrectCredent = {
                email: "tunes@example.com",
                password: "passwo123",
            }

            await request(app)
            .post("/auth/login")
            .send(incorrectCredent)
            .expect(401)
            .expect((res) => {
                expect(res.body.status).toBe("Bad request");
                expect(res.body.message).toBe(
                    "Authentication failed: Wrong Password"
                );
            });
        })
    })
})

describe('Organisation Endpoints',()=>{
    beforeEach(async()=>{
        await userRegistration()
    })

    describe("POST /api/organisations", () => {
        it("should create a new organisation", async () => {
          const newOrganisation = {
            name: "Candy Organisation",
            description: "Candy or nothing",
          };
    
          await request(app)
            .post("/api/organisations")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(newOrganisation)
            .expect(201)
            .expect((res) => {
              const organisation = res.body.data;
              expect(organisation.orgId).toBeTruthy();
              expect(organisation.name).toBe(newOrganisation.name);
              expect(organisation.description).toBe(newOrganisation.description);
            });
        });
    });

    describe('GET /api/organisations/:orgId',()=>{
        it('Should retrieve organisation details via ID', async()=>{
            let orgId = "";

            const newOrganisationData = {
                name: "New Tumbling Organisation",
                description: "Desc of New Organisation",
            };

            await request(app)
            .post("/api/organisations")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(newOrganisationData)
            .expect(201)
            .then((res) => {
                orgId = res.body.data.orgId;
            });

            await request(app)
            .get(`/api/organisations/${orgId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200)
            .expect((res) => {
                const organisation = res.body.data;
                expect(organisation.orgId).toBe(orgId);
                expect(organisation.name).toBe(newOrganisationData.name);
                expect(organisation.description).toBe(newOrganisationData.description);
            });
        })
        it("should fail if organisation ID does not exist", async () => {
            const nonExistingOrg = "I-dont-exist";
      
            await request(app)
              .get(`/api/organisations/${nonExistingOrg}`)
              .set("Authorization", `Bearer ${accessToken}`)
              .expect(404)
              .expect((res) => {
                expect(res.body.status).toBe("Not Found");
                expect(res.body.message).toBe("Organisation not found");
              });
          });
    })
})