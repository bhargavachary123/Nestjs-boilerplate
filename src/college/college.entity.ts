import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserMaster } from 'src/usermaster/user-master.entity';
import { Status } from 'src/enum';

@Entity()
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum:Status,
    default: Status.ACTIVE
  })
  status: Status;

  @Column({ nullable: true })
  updatedby: string;

  @CreateDateColumn() // Use @CreateDateColumn for createdon
  createdon: Date;

  @UpdateDateColumn() // Use @UpdateDateColumn for updatedon
  updatedon: Date;

  @OneToMany(() => UserMaster, (usermaster) => usermaster.college)
  usermasters: UserMaster[]
}
