import { prisma } from "./lib/prisma";

async function run() {
  //^ create user
  // const createUser = await prisma.user.create({
  //     data: {
  //         name: "Noraiz",
  //         email: "noraiz@nawshin.com",

  //     }
  // })
  // console.log("created User", createUser)

  // ! create Provider
  // const createProvider = await prisma.provider.create({
  //     data:{
  //         companyName: "Nabila's Kitchen",
  //         userId: 2
  //     }
  // })
  // console.log("created Provider", createProvider);

  //& create menu
  // const createMenu = await prisma.menu.create({
  //     data:{
  //         title: "Fried Rice with Chicken",
  //         isAvailable: true,
  //         review: "Food quality was very good!",
  //         providerId: 1
  //     }
  // })
  // console.log("create Menu", createMenu);

  // ^ create Profile
//   const createProfile = await prisma.profile.create({
//     data: {
//       bio: "Assistant Chef",
//       dateOfBirth: new Date("2003-09-05"),
//       userId: 2,
//       contanctNumber: "01377728393",
//       image: "okay",
//     },
//   });
//   console.log("create profile", createProfile);

// & Create menuItem

// const menuItemCreate = await prisma.menuItem.create({
//     data:{
//         name: "Chicken Spices",
//         description: "chicken, naga spice, oil, tomato",
//         price: 8.2,
//         isAvailable: true,
//         menuId: 1

//     }
// })
// console.log("MenuItem", menuItemCreate)

// ^ create Review

const reviewFromUser = await prisma.review.create({
    data:{
        rating: 4,
        comment: "it is a very good food",
        userId: 2,
        menuId: 1
    }
})

console.log("reviews", reviewFromUser)

// ? retrive all user

// const users = await prisma.user.findMany({
//     include:{
//         profile: true,
//         provider: true,
//         orders: true,
//         reviews: true
//     }
// });

// console.log("all users", users)
}

run();
