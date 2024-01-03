// import { define, factory } from "typeorm-seeding"
// import * as Faker from "faker"
// import { RType, UserMaster } from "src/usermaster/user-master.entity"
// import { hash } from 'bcrypt';
// import { College } from "src/college/college.entity";
// var generator = require('generate-password');

// define(UserMaster, (faker: typeof Faker) => {
//   const username = faker.name.firstName(1);
//   const password = generator.generate({ length: 8, numbers: true, excludeSimilarCharacters: true, strict: true });
//   console.log("\n\n\nyour username:- ", username);
//   console.log("your password:- ", password,"\n\n\n")
//   const userMaster = new UserMaster();
//   userMaster.username = username;
//   userMaster.password = hash(password.trim(), 10);
//   userMaster.role = RType.ADMIN;
//   userMaster.college = factory(College)() as any
//   return userMaster;
// })
