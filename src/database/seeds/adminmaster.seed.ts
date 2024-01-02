import { Factory, Seeder } from "typeorm-seeding"
import { AdminMaster } from "src/adminmaster/admin-master.entity"

export class CreateAdminMaster implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(AdminMaster)().create()
  }
}