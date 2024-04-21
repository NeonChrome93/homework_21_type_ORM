import { Device } from '../domain/device.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DevicesRepository {
    constructor(private dataSource: DataSource) {}

    async createDevice(device: Device): Promise<Device> {
        const resultDevice = await this.dataSource.query(
            `INSERT INTO public.devices(
          "deviceId" ,ip, "userId", title, "lastActiveDate")
        VALUES ($1, $2, $3, $4, $5) returning 'deviceId'`,
            [device.deviceId, device.ip, device.userId, device.title, device.lastActiveDate],
        );
        return resultDevice[0];
    }

    async isDeviceExistByUserIdAndDeviceId(deviceId: string, userId: string): Promise<boolean> {
        const query = `SELECT FROM public.devices
			  WHERE "deviceId" = $1 AND "userId" = $2`;
        const result = await this.dataSource.query(query, [deviceId, userId]);
        if (!result) return false;
        return true;
    }

    async updateDeviceLastActiveDate(deviceId: string, lastActiveDate: string): Promise<boolean> {
        const query = `UPDATE public.devices
                       SET "lastActiveDate" = $1
                       WHERE "deviceId" = $2`;
        const update = await this.dataSource.query(query, [lastActiveDate, deviceId]);
        if (!update) return false;
        return true;
    }

    async deleteDeviceExpectCurrent(userId: string, deviceId: string): Promise<boolean> {
        const query = `DELETE FROM public.devices
			  WHERE NOT "deviceId" = $1`;
        const deleted = await this.dataSource.query(query, [deviceId]);
        if (!deleted) return false;
        return true;
    }

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        const query = `DELETE FROM public.devices
			  WHERE "deviceId" = $1`;
        const deleted = await this.dataSource.query(query, [deviceId]);
        if (!deleted) return false;
        return true;
    }
}
