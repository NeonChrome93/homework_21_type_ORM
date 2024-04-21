import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from '../../../admin/users/domain/db-model';

@Injectable()
export class JwtAdapter {
    // constructor(private readonly jwtService: JwtService)

    createJWT(user: User) {
        //console.log(process.env.ACCESS_TIME);
        //TODO: 10s
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '123', {
            expiresIn: process.env.ACCESS_TIME || '5m',
        });
        return token;
    }
    //
    // ERROR [ExceptionsHandler] "expiresIn" should be a number of seconds or string representing a timespan
    // Error: "expiresIn" should be a number of seconds or string representing a timespan
    // ACCESS_TIME=10s перетащил из старого проекта, и теперь такое выдает

    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123');
            return result.userId;
        } catch (error) {
            return null;
        }
    }

    //jwt.decode - можно достать дату выдачи и сохранить в БД + добавить переменную девайс ID
    generateRefreshToken(user: User, deviceId: string) {
        //deviceId
        return jwt.sign({ userId: user.id, deviceId: deviceId }, process.env.JWT_SECRET || '123', {
            expiresIn: process.env.REFRESH_TIME || '10m',
        });
    }

    getPayloadByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123');
            return result; //\==={userId: user._id, deviceId: deviceId}
        } catch (error) {
            return null;
        }
    }

    lastActiveDate(token: string): string {
        const result: any = jwt.decode(token);
        return new Date(result.iat * 1000).toISOString(); //милесекунды и в строку
        //дата выписки токена это мое последнее посещение, закинуть в девайс репу
    }

    //создать токен с настройками и вернуть токен в куку createCookieToken +
}
