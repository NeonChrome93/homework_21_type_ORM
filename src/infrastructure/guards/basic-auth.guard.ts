import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

const users = {
    login: 'admin',
    password: 'qwerty',
};

@Injectable()
export class BasicAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const encode = Buffer.from(`${users.login}:${users.password}`, 'utf-8').toString('base64');
        if (request.headers.authorization === `Basic ${encode}`) {
            return true;
        } else throw new UnauthorizedException();
    }
}
