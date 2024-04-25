import { UserService } from '../../../admin/users/application/user.service';
import { Injectable } from '@nestjs/common';
import { JwtAdapter } from '../adapters/jwt.adapter';
import { EmailAdapter } from '../adapters/email.adapter';
import { DevicesService } from '../../devices/application/device.service';
import { DevicesRepository } from '../../devices/repositories/device.repository';
import { CommandBus } from '@nestjs/cqrs';
import { UserRepository } from '../../../admin/users/repositories/user-repository';
import { User } from '../../../admin/users/domain/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtAdapter,
        private readonly emailService: EmailAdapter,
        private readonly deviceService: DevicesService,
        private readonly deviceRepository: DevicesRepository,
        private readonly usersRepository: UserRepository,
        private readonly commandBus: CommandBus,
    ) {}

    //пользователь логинится получает токены
    // async login( ip: string, title: string, user: User): Promise<{ accessToken: string, refreshToken: string } | null> {
    //     //const user = await this.userService.checkCredentials(loginOrEmail, password)
    //     console.log('service', user)
    //    // if (!user) return null
    //     const accessToken = this.jwtService.createJWT(user);
    //     const deviceId = randomUUID()
    //     const refreshToken = this.jwtService.generateRefreshToken(user, deviceId);
    //     const lastActiveDate = this.jwtService.lastActiveDate(refreshToken)// взять дату выписки этого токена === lastActiveDate у девайся
    //     await this.commandBus.execute(new CreateDeviceCommand(ip, deviceId, user._id.toString(), title, new Date(lastActiveDate)))
    //     return {
    //         accessToken,
    //         refreshToken
    //     }
    // }

    async refresh(user: User, refreshToken: string): Promise<{ accessToken: string; newRefreshToken: string } | null> {
        const payload = this.jwtService.getPayloadByToken(refreshToken);
        const accessToken = this.jwtService.createJWT(user);
        const newRefreshToken = this.jwtService.generateRefreshToken(user, payload.deviceId);
        const lastActiveDate = this.jwtService.lastActiveDate(newRefreshToken);
        await this.deviceRepository.updateDeviceLastActiveDate(payload.deviceId, lastActiveDate);
        return {
            accessToken,
            newRefreshToken,
        };
    }
}
