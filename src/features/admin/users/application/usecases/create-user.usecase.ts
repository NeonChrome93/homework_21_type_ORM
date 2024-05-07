import { UserCreateModelDto } from '../../api/models/input/user.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserViewModel } from '../../api/models/output/user.output.model';
import bcrypt from 'bcrypt';
import { UserDbModel } from '../../domain/user.entity';
import { UserRepository } from '../../repositories/user-repository';

export class CreateUserCommand {
    constructor(public userCreateModel: UserCreateModelDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(private readonly usersRepository: UserRepository) {}

    async execute(command: CreateUserCommand): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10);
        //  const passwordHash = await this.generateHash(userCreateModel.password, passwordSalt)
        const passwordHash = await bcrypt.hash(command.userCreateModel.password, passwordSalt);

        const newUser: UserDbModel = {
            login: command.userCreateModel.login,
            email: command.userCreateModel.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date(),
            confirmationCode: '123',
            isConfirmed: true,
            passwordRecoveryCode: null,
            expirationDateOfRecoveryCode: null,
        };

        const createdUserId = await this.usersRepository.createUser(newUser);

        return {
            id: createdUserId,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString(),
        };
    }
}
