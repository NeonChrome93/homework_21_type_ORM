import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/validation/custom';
import { IfCodeExist } from '../../../../../../infrastructure/decorators/registration-conformation.decorator';
import { IfUserExistOrConfirmed } from '../../../../../../infrastructure/decorators/registration-email-resending.decorator';

export class CodeDto {
    @IfCodeExist({
        message: 'user with this code not exist or already confirmed',
    })
    @IsString()
    @IsNotEmpty()
    code: string;
}

export class EmailDto {
    @IfUserExistOrConfirmed({
        message: 'user with this email not exist or already confirmed',
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}

export class NewPasswordDto {
    @MaxLength(20)
    @MinLength(6)
    @Trim()
    @IsString()
    @IsNotEmpty()
    newPassword: string;
    @IsString()
    @IsNotEmpty()
    recoveryCode: string;
}
