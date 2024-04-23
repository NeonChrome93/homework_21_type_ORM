import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCreateModelDto } from '../../../../admin/users/api/models/input/user.input.model';
import { UserViewModel } from '../../../../admin/users/api/models/output/user.output.model';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailAdapter } from '../../adapters/email.adapter';
import { UserRepository } from '../../../../admin/users/repositories/user-repository';
import { User } from '../../../../admin/users/domain/db-model';

export class RegistrationUserCommand {
    constructor(public userCreateModel: UserCreateModelDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase implements ICommandHandler<RegistrationUserCommand> {
    constructor(
        private readonly emailService: EmailAdapter,
        private readonly usersRepository: UserRepository,
    ) {}

    async execute(command: RegistrationUserCommand): Promise<UserViewModel | null> {
        //TODO: вынесвытнести в отдельный сервис
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(command.userCreateModel.password, passwordSalt);

        // const newUser: User = {
        //     id: null,
        //     login: command.userCreateModel.login, //valitation not copy in database
        //     email: command.userCreateModel.email, //
        //     passwordHash: passwordHash,
        //     passwordSalt: passwordSalt,
        //     createdAt: new Date(),
        //     confirmationCode: randomUUID(), //generate code UUID //
        //     isConfirmed: false, // by registration
        //     expirationDateOfRecoveryCode: null,
        //     passwordRecoveryCode: null,
        //
        // };

        const newUser = new User();
        newUser.login = command.userCreateModel.login;
        newUser.email = command.userCreateModel.email;
        newUser.passwordHash = passwordHash;
        newUser.passwordSalt = passwordSalt;
        newUser.createdAt = new Date();
        newUser.confirmationCode = randomUUID();
        newUser.isConfirmed = false;
        newUser.expirationDateOfRecoveryCode = null;
        newUser.passwordRecoveryCode = null;
        // const user = new this.UserModel({newUser})
        //this.usersRepository.save()
        await this.usersRepository.createUser(newUser);

        //eventBus.publish(new UserCreatedEvent(email: string))

        try {
            this.emailService.sendEmail(newUser.email, newUser.confirmationCode, 'It is your code');
        } catch (e) {
            console.log('registration user email error', e);
            return null;
        }
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString(),
        };
    }
}
