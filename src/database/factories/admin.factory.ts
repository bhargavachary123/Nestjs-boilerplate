// import * as Faker from "faker"
// import { AdminMaster } from "src/adminmaster/admin-master.entity"
// import { UserMaster } from "src/usermaster/user-master.entity"
// import { define, factory } from "typeorm-seeding"

// define(AdminMaster, (faker: typeof Faker) => {
//   const adminMaster = new AdminMaster()
//   adminMaster.name = faker.name.firstName(1);
//   adminMaster.usermaster = factory(UserMaster)({ role: ['ADMIN'] }) as any
//   return adminMaster;
// })
