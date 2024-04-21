import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { EmailAdapter } from '../../adapters/email.adapter';
import { UserRepository } from '../../../../admin/users/repositories/user-repository';

export class ResendingCodeCommand {
    constructor(public email: string) {}
}

@CommandHandler(ResendingCodeCommand)
export class ResendingCodeUseCase implements ICommandHandler<ResendingCodeCommand> {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly emailService: EmailAdapter,
    ) {}

    //переотправка кода
    async execute(command: ResendingCodeCommand): Promise<boolean> {
        const user = await this.usersRepository.readUserByEmail(command.email);
        if (!user) return false;
        const newCode = randomUUID();
        await this.usersRepository.updateConfirmationCode(user.id, newCode);
        try {
            await this.emailService.sendEmail(user.email, newCode, 'It is your code');
        } catch (e) {
            console.log('code resending email error', e);
        }
        return true;
    }
}
