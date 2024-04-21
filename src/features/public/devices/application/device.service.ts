import { Injectable } from '@nestjs/common';
import { Device } from '../domain/device.entity';
import { DevicesRepository } from '../repositories/device.repository';
import { DevicesQueryRepository } from '../repositories/device.query.repository';

@Injectable()
export class DevicesService {
    constructor(
        private readonly devicesQueryRepository: DevicesQueryRepository,
        private readonly devicesRepository: DevicesRepository,
    ) {}

    async findDeviceById(deviceId: string): Promise<Device | null> {
        return await this.devicesQueryRepository.findDevice(deviceId);
    }

    async deleteDeviceExceptCurrent(userId: string, deviceId: string) {
        return await this.devicesRepository.deleteDeviceExpectCurrent(userId, deviceId);
    }
}
