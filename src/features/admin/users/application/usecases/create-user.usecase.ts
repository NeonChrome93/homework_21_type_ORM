import { UserCreateModelDto } from '../../api/models/input/user.input.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserViewModel } from '../../api/models/output/user.output.model';

import { User } from '../../domain/user.entity';
import { UserRepository } from '../../repositories/user-repository';

export class CreateUserCommand {
    constructor(public userCreateModel: UserCreateModelDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(private readonly usersRepository: UserRepository) {}

    async execute(command: CreateUserCommand): Promise<UserViewModel> {
        const newUser = await User.create({ ...command.userCreateModel, isConfirmed: true });
        const createdUserId = await this.usersRepository.createUser(newUser);

        return {
            id: createdUserId,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString(),
        };
    }
}
