import * as Faker from "faker"
import { define } from "typeorm-seeding"
import { College } from "src/college/college.entity"
define(College, (faker: typeof Faker) => {
  const college = new College()
  college.name = faker.random.word(); 
  college.code = faker.random.word();
  return college;
})