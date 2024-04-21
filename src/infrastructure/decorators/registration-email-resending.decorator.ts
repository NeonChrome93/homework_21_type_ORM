import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../features/admin/users/repositories/user-repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class RegistrationEmailResendingConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersRepository: UserRepository) {}

    async validate(email: string, args: ValidationArguments) {
        const user = await this.usersRepository.readUserByEmail(email);
        if (!user) {
            return false;
        }
        if (user.isConfirmed) {
            return false;
        }
        return true;
    }
}

export function IfUserExistOrConfirmed(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IfUserExistOrConfirmed',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: RegistrationEmailResendingConstraint,
        });
    };
}

// body('email').custom(async (email: string)=> {
//     const user = await usersRepository.readUserByEmail(email)
//     if(!user) throw new Error("user not exist")
//     if(user.isConfirmed) throw new Error("user already confirmed")
//     return true
//
// }),
