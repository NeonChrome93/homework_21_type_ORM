import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../admin/users/application/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            usernameField: 'loginOrEmail',
        });
    }

    async validate(loginOrEmail: string, password: string): Promise<any> {
        console.log('credentials', loginOrEmail, password);
        const user = await this.userService.checkCredentials(loginOrEmail, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
