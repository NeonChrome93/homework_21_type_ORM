import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/db-model';
import { Device } from '../../public/devices/domain/device.entity';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.command';
import { UserController } from './api/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Device])],
    providers: [CreateUserUseCase, DeleteUserUseCase],
    controllers: [UserController],
})
export class AuthModule {}
