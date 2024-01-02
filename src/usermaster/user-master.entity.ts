import { Column, Entity, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdminMaster } from 'src/adminmaster/admin-master.entity';
import { StudentMaster } from 'src/studentmaster/student-master.entity';
import { TeacherMaster } from 'src/teachermaster/teacher-master.entity';
import { College } from 'src/college/college.entity';

export enum RType {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT"
}

@Entity()
export class UserMaster {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({
        type: 'enum',
        enum: RType
    })
    role: RType;

    @Column()
    password: string;

    @Column({ default: null })
    refreshToken: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, unique: true })
    email: string;

    @Column({ nullable: true })
    forgot_pwd_otp: number;

    // @Column({ nullable: true })
    // profilepic: string;

    @CreateDateColumn() // Use @CreateDateColumn for createdon
    createdon: Date;

    @Column({ nullable: true })
    updatedBy: string;

    @UpdateDateColumn() // Use @UpdateDateColumn for updatedon
    updatedon: Date;

    @OneToOne(() => AdminMaster, (admin) => admin.usermaster)
    admin: AdminMaster;

    @OneToOne(() => StudentMaster, (student) => student.usermaster)
    student: StudentMaster;

    @OneToOne(() => TeacherMaster, (teacher) => teacher.usermaster)
    teacher: TeacherMaster;

    @ManyToOne(() => College, (college) => college.usermasters)
    @JoinColumn({ name: 'collegeId' })
    college: College;
}