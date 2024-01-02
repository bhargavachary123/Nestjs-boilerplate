import { UserMaster } from 'src/usermaster/user-master.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';

@Entity()
export class AdminMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn() // Use @CreateDateColumn for createdon
  createdon: Date;

  @Column({ nullable: true })
  updatedBy:string;

  @UpdateDateColumn() // Use @UpdateDateColumn for updatedon
  updatedon: Date;

  @OneToOne(() => UserMaster, (usermaster) => usermaster.admin)
  @JoinColumn()
  usermaster: UserMaster;

}
