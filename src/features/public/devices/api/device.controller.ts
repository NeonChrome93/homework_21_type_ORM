import { Controller, Delete, Get, HttpCode, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAdapter } from '../../auth/adapters/jwt.adapter';

import { UserAll, UserId } from '../../../../infrastructure/decorators/get-user.decorator';

import { AuthSessionTokenGuard } from '../../../../infrastructure/guards/auth-session-token.guard';
import { DeviceId } from '../../../../infrastructure/decorators/get-device.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteDeviceCommand } from '../application/usecases/delete-device.usecase';
//import { DeviceViewModel } from './models/output/device-output.model';
import { User } from '../../../admin/users/domain/db-model';
import { DevicesQueryRepository } from '../repositories/device.query.repository';
import { DevicesService } from '../application/device.service';
import { DeviceViewModel } from './models/output/device-output.model';

@Controller('security/devices')
export class DeviceController {
    constructor(
        private readonly jwtService: JwtAdapter,
        private readonly devicesService: DevicesService,
        private readonly devicesQueryRepository: DevicesQueryRepository,
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    @UseGuards(AuthSessionTokenGuard)
    @HttpCode(200)
    async getDevices(@Req() req: Request, @UserId() userId: string): Promise<DeviceViewModel[]> {
        const devises: DeviceViewModel[] = await this.devicesQueryRepository.findAllUserDevices(userId);
        return devises;
    }

    @Delete()
    @HttpCode(204)
    @UseGuards(AuthSessionTokenGuard)
    async deleteDevicesExcludeCurrent(@UserAll() user: User, @DeviceId() deviceId: string): Promise<void> {
        //console.log(deviceId)
        await this.devicesService.deleteDeviceExceptCurrent(user!.id.toString(), deviceId!.toString());
    }

    @Delete(':deviceId')
    @UseGuards(AuthSessionTokenGuard)
    @HttpCode(204)
    async deleteDeviceById(@Param('deviceId') deviceId: string, @UserAll() user: User, @Res() res: Response) {
        const status = await this.commandBus.execute(new DeleteDeviceCommand(deviceId, user!.id.toString()));
        return res.sendStatus(status);

        // If try to delete the deviceId of other user -найти девайс по девайс если его нет 404, вытащить юзер ид и сравнить юзер
        //ид у девайся с юзер ид в токене если они не равны кинуть 403
        //-> deviceService-> deleteDeviceById
    }
}
