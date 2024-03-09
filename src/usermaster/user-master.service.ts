import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMaster } from './user-master.entity';
import {
    UserMasterDto,
    PassUpdateUserMasterDto,
    UpdateUserMasterDto,
    ForgotPasswordUserMasterDto,
    VerifyOTPUserMasterDto,
    UpdatePasswordForStudentTeacherDto,
    BulkUpdateUserMasterDto
} from './dto/user-master.dto';
import { hash } from 'bcrypt';
import logger from 'src/loggerfile/logger';
import { College } from 'src/college/college.entity';
import { EmailService } from 'src/email/email';
import { compare } from 'bcrypt';
import * as path from 'path';
import { DataMethodResponseType, NormalMethodResponseType } from 'src/return.formats';

@Injectable()
export class UserMasterService {
    private filepath: string;
    constructor(
        @InjectRepository(UserMaster)
        private readonly userMasterRepository: Repository<UserMaster>,
        private readonly emailservice: EmailService,
    ) {
        this.filepath = path.basename(__filename);
    }

    async create(username: string, userMasterDto: UserMasterDto): Promise<DataMethodResponseType> {
        try {
            logger.debug(`usermaster create started`);
            logger.error(`usermaster create > ${JSON.stringify(userMasterDto)}`);

            const user = await this.userMasterRepository.findOne({ where: { username: userMasterDto.username, college: { id: userMasterDto.collegeId } } });
            if (user)
                throw new BadRequestException("username exits for same college");
            const userMaster = new UserMaster();
            userMaster.username = userMasterDto.username.trim();
            userMaster.password = await hash(userMasterDto.password.trim(), 10);// Hash the password using bcrypt
            userMaster.email = userMasterDto.email || null;
            userMaster.role = userMasterDto.role;
            userMaster.college = { id: userMasterDto.collegeId } as College;
            userMaster.updatedBy = username;

            const result = await this.userMasterRepository.save(userMaster);
            logger.debug(`${this.filepath} > usermaster saved & returned`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster create`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async update(userInfo: { username: string, collegeId: number }, updateUserMasterDto: UpdateUserMasterDto): Promise<DataMethodResponseType> {
        try {
            logger.debug(`usermaster update started`);
            const userdata = await this.userMasterRepository.findOne({ where: { id: updateUserMasterDto.id, college: { id: userInfo.collegeId } } });
            if (userdata == null)
                throw new BadRequestException("username not exits in usermaster table");
            userdata.username = updateUserMasterDto.username.trim();
            userdata.password = await hash(updateUserMasterDto.password.trim(), 10);// Hash the password using bcrypt
            userdata.email = updateUserMasterDto.email;
            userdata.role = updateUserMasterDto.role;
            userdata.updatedBy = userInfo.username;
            const result = await this.userMasterRepository.save(userdata);
            logger.debug(`${this.filepath} > usermaster updated & returned`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster update`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async bulkupdate(userInfo: any, BulkUpdateUserMasterDto: BulkUpdateUserMasterDto): Promise<DataMethodResponseType> {
        try {
            logger.debug(`usermaster bulkupdate started`);
            const userdata = await this.userMasterRepository.findOne({ where: { username: BulkUpdateUserMasterDto.username, college: { id: userInfo.collegeId } } });
            if (userdata == null)
                throw new BadRequestException("username not exits in usermaster table");
            userdata.username = BulkUpdateUserMasterDto.username.trim();
            userdata.password = BulkUpdateUserMasterDto.password != null ? await hash(BulkUpdateUserMasterDto.password.trim(), 10) : userdata.password;// Hash the password using bcrypt
            userdata.email = BulkUpdateUserMasterDto.email || userdata.email;
            userdata.role = BulkUpdateUserMasterDto.role;
            userdata.updatedBy = userInfo.username;
            const result = await this.userMasterRepository.save(userdata);
            logger.debug(`${this.filepath} > usermaster updated & returned`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster update`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async updateEmail(obj: any): Promise<DataMethodResponseType> {
        try {
            logger.debug(`usermaster updateEmail started`);
            const data = await this.userMasterRepository.findOneBy({ id: obj.userId })
            data.email = obj.email;
            const result = await this.userMasterRepository.save(data);
            logger.debug(`${this.filepath} > usermaster updatenew`);
            return { Error: false, payload: result };
        }
        catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster updateEmail`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async updateForgotPassword(forgotpasswordusermasterdto: ForgotPasswordUserMasterDto): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`usermaster updateForgotPassword started`);
            const userdata = await this.userMasterRepository.findOneBy({ email: forgotpasswordusermasterdto.email })
            logger.debug("updating password starting");
            userdata.email = forgotpasswordusermasterdto.email;
            userdata.password = await hash(forgotpasswordusermasterdto.password, 10)
            await this.userMasterRepository.save(userdata);
            logger.debug("password updated");
            logger.debug(`${this.filepath} > usermaster updateForgotPassword`);
            return { Error: false, message: "updated" };
        }
        catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster updateForgotPassword`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async verifyUserAndSendOTP(email: string): Promise<NormalMethodResponseType> {
        try {
            logger.debug("usermaster verifyUserAndSendOTP started");
            const userdata = await this.userMasterRepository.findOneBy({ email: email });
            logger.debug("user found");
            if (userdata) {
                const OTP = Math.floor(100000 + Math.random() * 900000);
                logger.debug("finding user using email");
                const userdata = await this.userMasterRepository.findOneBy({ email: email });
                logger.debug("user using email found");
                const user = userdata.username;
                logger.debug(`otp saveing in usermaster`);
                userdata.forgot_pwd_otp = OTP;
                userdata.updatedBy = null;
                await this.userMasterRepository.save(userdata);
                logger.debug(`otp saved in usermaster`);
                const res = await this.emailservice.sendEmail(user, email, OTP);
                if (res.Error)
                    throw res.message;

                return { Error: false, message: "OTP sent successfully" };
            }
            else {
                throw new BadRequestException("user not found");
            }
        } catch (error) {
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async verifyOTPOfUser(verifyotpusermasterdto: VerifyOTPUserMasterDto): Promise<NormalMethodResponseType> {
        try {
            const currentDate = new Date(); // Get the current date
            const userdata = await this.userMasterRepository.findOneBy({ email: verifyotpusermasterdto.email });
            if (currentDate.getTime() - (userdata.updatedon as Date).getTime() <= 10 * 60 * 1000) {
                if (userdata.forgot_pwd_otp === verifyotpusermasterdto.otp)
                    return { Error: false, message: "OTP verified" };
                else
                    throw new BadRequestException("OTP incorrect");
            } else
                throw new BadRequestException("OTP has been expired");
        }
        catch (error) {
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async sendotptoemail(email: string): Promise<DataMethodResponseType> {
        try {
            logger.debug("usermaster sendotptoemail started");
            const OTP = Math.floor(100000 + Math.random() * 900000);
            logger.debug("finding user using email");
            const userdata = await this.userMasterRepository.findOneBy({ email: email });
            logger.debug("user using email found");
            const user = userdata.username;
            logger.debug(`otp saveing in usermaster`);
            userdata.forgot_pwd_otp = OTP;
            userdata.updatedBy = null;
            await this.userMasterRepository.save(userdata);
            logger.debug(`otp saved in usermaster`);
            const res = await this.emailservice.sendEmail(user, email, OTP);
            if (res.Error)
                throw res.message;

            return { Error: true, payload: res }
        }
        catch (error) {
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async updatePassword(username: string, passUpdateUserMasterDto: PassUpdateUserMasterDto): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`usermaster updatePassword started`);
            const userdata = await this.userMasterRepository.findOne({ where: { username: passUpdateUserMasterDto.username } });
            if (!userdata) {
                logger.debug(`UserMaster with username ${passUpdateUserMasterDto.username} not found.`);
                throw new Error(`UserMaster with username ${passUpdateUserMasterDto.username} not found.`);
            }
            userdata.password = await hash(passUpdateUserMasterDto.password, 10);// Hash the password using bcrypt
            userdata.username = passUpdateUserMasterDto.username;
            userdata.updatedBy = username;
            await this.userMasterRepository.save(userdata);
            logger.debug(`${this.filepath} > returned`);
            return { Error: false, message: "password changed successfully" }
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in changing password`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async updatePasswordForStudentTeacher(username: string, updatePasswordForStudentTeacherDto: UpdatePasswordForStudentTeacherDto): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`usermaster updatePasswordForStudentTeacher started`);
            const userdata = await this.userMasterRepository.findOne({ where: { username: username } });
            if (!userdata) {
                logger.debug(`UserMaster with username ${username} not found.`);
                throw new Error(`UserMaster with username ${username} not found.`);
            }
            if (await compare(updatePasswordForStudentTeacherDto.oldpassword, userdata.password)) {
                userdata.password = await hash(updatePasswordForStudentTeacherDto.newpassword, 10);// Hash the password using bcrypt
                userdata.updatedBy = username;
                await this.userMasterRepository.save(userdata);
                logger.debug(`${this.filepath} > returned`);
                return { Error: false, message: "password changed successfully" }
            } else {
                return { Error: true, message: "Incorrect old password." }
            }
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in changing password`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findAll(): Promise<DataMethodResponseType> {
        try {
            logger.debug("usermaster findAll started");
            const result = await this.userMasterRepository.find();
            logger.debug(`${this.filepath} > returned > ${JSON.stringify(result)}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in findAll usermaster`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findOne(userId: number): Promise<DataMethodResponseType> {
        try {
            logger.debug("usermaster findOne started");
            const result = await this.userMasterRepository.findOneBy({ id: userId });
            logger.debug(`${this.filepath} > returned > ${JSON.stringify(result)}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in findOne usermaster`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async remove(userId: string): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`usermaster remove started`);
            await this.userMasterRepository.delete(userId);
            logger.debug(`${this.filepath} > usermaster removed & returned`);
            return { Error: false, message: "removed" };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in removing usermaster`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findByUsername(username: string): Promise<DataMethodResponseType> {
        try {
            logger.debug(`usermaster findByUsername started`);
            const result = await this.userMasterRepository.findOne({
                where: { username: username }
            });
            if (result == null)
                throw "User not found";
            if (result.role == 'ADMIN') {
                const res = await this.userMasterRepository.findOne({
                    where: { username: username },
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        password: true,
                        college: {
                            id: true,
                            code: true
                        },
                        admin: {
                            id: true,
                            name: true
                        }
                    },
                    relations: { college: true, admin: true }
                });

                const payload = { ...res, name: res.admin.name, id: res.admin.id };

                logger.debug(`${this.filepath} > returned > ${res}`);
                return { Error: false, payload: payload };
            } else if (result.role === 'TEACHER') {
                const res = await this.userMasterRepository.findOne({
                    where: { username: username },
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        password: true,
                        college: {
                            id: true,
                            code: true
                        },
                        teacher: {
                            id: true,
                            name: true
                        }
                    },
                    relations: { teacher: true, college: true }
                });

                const payload = { ...res, name: res.teacher.name, id: res.teacher.id };

                logger.debug(`${this.filepath} > returned > ${res}`);
                return { Error: false, payload: payload };
            } else if (result.role === 'STUDENT') {
                const res = await this.userMasterRepository.findOne({
                    where: { username: username },
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        password: true,
                        college: {
                            id: true,
                            code: true
                        },
                        student: {
                            id: true,
                            name: true,
                            currentyear: true
                        }
                    },
                    relations: { college: true, student: true }
                });

                const payload = { ...res, name: res.student.name, id: res.student.id };

                logger.debug(`${this.filepath} > returned > ${res}`);
                return { Error: false, payload: payload };
            }
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster findByUsername`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async saveRefreshToken(userId: number, refreshToken: string): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`usermaster saveRefreshToken started`);
            const user = await this.userMasterRepository.findOneBy({ id: userId });
            if (user) {
                user.refreshToken = refreshToken;
                await this.userMasterRepository.save(user);
                logger.debug(`${this.filepath} > usermaster RefreshToken saved & returned`);
                return { Error: false, message: "saved" };
            } else {
                logger.debug(`User with ID ${userId} not found. > returned null`);
                return { Error: false, message: null }; // Or return an appropriate response indicating the user is not found.
            }
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in saving refreshtoken usermaster`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async deleteRefreshToken(userId: number): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`usermaster deleteRefreshToken started`)
            const user = await this.userMasterRepository.findOneBy({ id: userId });
            if (user) {
                user.refreshToken = " ";
                await this.userMasterRepository.save(user);
                logger.debug(`${this.filepath} > usermaster RefreshToken removed & returned`);
                return { Error: false, message: "deleted" };
            } else {
                logger.debug(`User with ID ${userId} not found. > returned null`);
                return { Error: false, message: null }; // Or return an appropriate response indicating the user is not found.
            }
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in deleting refresh token usermaster`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findUserIdByRefreshToken(refreshToken: string): Promise<DataMethodResponseType> {
        try {
            logger.debug(`usermaster findUserIdByRefreshToken started`);
            const result = await this.userMasterRepository.findOneBy({ refreshToken: refreshToken });
            logger.debug(`${this.filepath} > returned > ${result}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in usermaster findUserIdByRefreshToken`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }
}
