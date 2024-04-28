import { Device } from '../domain/device.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevicesRepository {
    constructor(private dataSource: DataSource) {}

    async createDevice(device: Device): Promise<Device> {
        // const resultDevice = await this.dataSource.query(
        //     `INSERT INTO public.device(
        //   "deviceId" ,ip, "userId", title, "lastActiveDate")
        // VALUES ($1, $2, $3, $4, $5) returning 'deviceId'`,
        //     [device.deviceId, device.ip, device.userId, device.title, device.lastActiveDate],
        // );
        const resultDevice = await this.dataSource.getRepository(Device).save(device);
        return resultDevice[0];
    }

    async isDeviceExistByUserIdAndDeviceId(deviceId: string, userId: string): Promise<boolean> {
        const query = `SELECT FROM public.device
			  WHERE "deviceId" = $1 AND "userId" = $2`;
        const result = await this.dataSource.query(query, [deviceId, userId]);
        if (!result) return false;
        return true;
    }

    async updateDeviceLastActiveDate(deviceId: string, lastActiveDate: string): Promise<boolean> {
        // const query = `UPDATE public.device
        //                SET "lastActiveDate" = $1
        //                WHERE "deviceId" = $2`;
        const update = await this.dataSource
            .getRepository(Device)
            .update({ deviceId: deviceId }, { lastActiveDate: lastActiveDate });
        if (!update) return false;
        return true;
    }

    async deleteDeviceExpectCurrent(userId: string, deviceId: string): Promise<boolean> {
        // const query = `DELETE FROM public.device
        // WHERE NOT "deviceId" = $1`;
        const deleted = await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(Device)
            .where('deviceId != :deviceId', { deviceId: deviceId })
            .execute();
        if (!deleted) return false;
        return true;
    }

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        // const query = `DELETE FROM public.device
        // WHERE "deviceId" = $1`;
        const deleted = await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(Device)
            .where('deviceId = :deviceId', { deviceId: deviceId })
            .execute();

        if (!deleted) return false;
        return true;
    }
}
