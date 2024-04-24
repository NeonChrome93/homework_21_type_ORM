import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Device } from '../../public/devices/domain/device.entity';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/delete-user.command';
import { UserController } from './api/user.controller';
import { UserRepository } from './repositories/user-repository';
import { UsersQueryRepository } from './repositories/user.query.repository';
import { UserService } from './application/user.service';
import { DevicesService } from '../../public/devices/application/device.service';
import { JwtAdapter } from '../../public/auth/adapters/jwt.adapter';
import { EmailAdapter } from '../../public/auth/adapters/email.adapter';
import { DevicesRepository } from '../../public/devices/repositories/device.repository';
import { DevicesQueryRepository } from '../../public/devices/repositories/device.query.repository';
import { AuthService } from '../../public/auth/application/auth.service';
import { AuthController } from '../../public/auth/api/auth.controller';
import { DeviceController } from '../../public/devices/api/device.controller';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { CreateDeviceUseCase } from '../../public/devices/application/usecases/create-device.usecase';
import { DeleteDeviceUseCase } from '../../public/devices/application/usecases/delete-device.usecase';
import { RegistrationUserUseCase } from '../../public/auth/application/usecases/registration-user.usecase';
import { ConfirmEmailUseCase } from '../../public/auth/application/usecases/confirm-email.usecase';
import { ResendingCodeUseCase } from '../../public/auth/application/usecases/resending-code.usecase';
import { PasswordRecoveryUseCase } from '../../public/auth/application/usecases/password-recovery.usecase';
import { NewPasswordSetUseCase } from '../../public/auth/application/usecases/new-password-set.usecase';
import { AuthLoginUseCase } from '../../public/auth/application/usecases/auth-login.usecase';
import { IsUserAlreadyExistConstraint } from '../../../infrastructure/decorators/user-exist.decorator';
import { RegistrationConfirmCodeConstraint } from '../../../infrastructure/decorators/registration-conformation.decorator';
import { RegistrationEmailResendingConstraint } from '../../../infrastructure/decorators/registration-email-resending.decorator';
import { LocalStrategy } from '../../public/auth/application/local.strategy';

const adapters = [JwtAdapter, EmailAdapter];

const constraints = [
    IsUserAlreadyExistConstraint,
    RegistrationConfirmCodeConstraint,
    RegistrationEmailResendingConstraint,
];

const useCases = [
    CreateUserUseCase,
    DeleteUserUseCase,
    CreateDeviceUseCase,
    DeleteDeviceUseCase,
    RegistrationUserUseCase,
    ConfirmEmailUseCase,
    ResendingCodeUseCase,
    PasswordRecoveryUseCase,
    NewPasswordSetUseCase,
    AuthLoginUseCase,
];

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([User, Device])],
    providers: [
        LocalStrategy,
        UserService,
        DevicesService,
        AuthService,
        UserRepository,
        UsersQueryRepository,
        DevicesRepository,
        DevicesQueryRepository,
        ...adapters,
        ...useCases,
        ...constraints,
    ],
    controllers: [UserController, AuthController, DeviceController],
})
export class AuthModule {}
