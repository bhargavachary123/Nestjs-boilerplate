import { UserMaster } from 'src/usermaster/user-master.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';

export enum SType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

@Entity()
export class StudentMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  currentyear: number;

  @Column({ nullable: true })
  CGPA: string;

  @Column({
    type: 'enum',
    enum: SType,
    default: SType.ACTIVE
  })
  status: SType;

  @CreateDateColumn() // Use @CreateDateColumn for createdon
  createdon: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @UpdateDateColumn() // Use @UpdateDateColumn for updatedon
  updatedon: Date;

  @OneToOne(() => UserMaster, (usermaster) => usermaster.student)
  @JoinColumn({ name: 'usermasterId' })
  usermaster: UserMaster;
}
