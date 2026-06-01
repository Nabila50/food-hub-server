import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin(){
    try{

        const adminData = {
            name: "Admin Saheb",
            email: "admin@gmail.com",
            role: UserRole.ADMIN,
            password:"asdf1234",
            image: "https://i.ibb.co/tpywch6Z/7.jpg"
        }
        // check user exist on db or not?
        const existingUser = await prisma.user.findUnique({
            where:{
                email: adminData.email,

            }
        });

        if(existingUser){
            throw new Error("User already exists in DB");
        }

        // ^ signup as an Admin/ create Admin
         const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:5000"
            },
            body: JSON.stringify(adminData)
        })
        console.log(signUpAdmin)

        //* email verification for admin
        if(signUpAdmin.ok){
            console.log("admin creadted")
            await prisma.user.update({
                
                where:{
                    email: adminData.email
                },
                data:{
                    emailVerified: true
                }
               
            })
             console.log("admin role updated!!!")

            console.log("_________Email Verified________")
        };
 

    }catch(error){
       
    }
}

seedAdmin();