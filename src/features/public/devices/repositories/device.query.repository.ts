import { Injectable } from '@nestjs/common';
import { DeviceViewModel } from '../api/models/output/device-output.model';
import { DataSource } from 'typeorm';
import { Device } from '../domain/device.entity';

@Injectable()
export class DevicesQueryRepository {
    constructor(private dataSource: DataSource) {}
    async findAllUserDevices(userId: string): Promise<DeviceViewModel[]> {
        const query = `
            SELECT * FROM 
            public.devices
            WHERE "userId" = $1
            `;

        const getDevices = await this.dataSource.query(query, [userId]);

        return getDevices.map(item => {
            return { ip: item.ip, title: item.title, lastActiveDate: item.lastActiveDate, deviceId: item.deviceId };
        });
    }

    async findDevice(deviceId: string): Promise<Device | null> {
        const query = `
            SELECT * FROM 
            public.devices
            WHERE "deviceId" = $1
            `;

        const getDevices = await this.dataSource.query(query, [deviceId]);
        console.log('getDevices', getDevices);
        return getDevices[0] || null;
    }
}
