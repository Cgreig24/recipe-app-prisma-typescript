//import prisma from "./db";
const prisma = require("../db/index");

const newUser = {
  email: "test@user.com",
  password: "testtest",
  username: "testUser",
};

prisma.user
  .create({ data: newUser })
  .then((user) => {
    console.log("Success! New user added");
    console.log(user);
  })
  .catch((error) => {
    console.log("Something went wrong");
    console.log(error);
  });
