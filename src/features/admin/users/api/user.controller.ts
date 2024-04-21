import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserCreateModelDto, UsersQueryType } from './models/input/user.input.model';
import { BasicAuthGuard } from '../../../../infrastructure/guards/basic-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/delete-user.command';
import { getQueryUserPagination } from '../../../../utils/pagination';
import { UsersQueryRepository } from '../repositories/user.query.repository';

@Controller('sa/users')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) {}

    @Get()
    @UseGuards(BasicAuthGuard)
    async getUsers(@Query() queryDto: UsersQueryType) {
        const pagination = getQueryUserPagination(queryDto);
        const { sortBy, sortDirection, searchLoginTerm, searchEmailTerm, pageSize, pageNumber } = pagination;
        const arr = await this.usersQueryRepository.getUsers(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm,
        );
        //SQL выбровка уже идет
        return arr;
    }

    @Post()
    @HttpCode(201)
    @UseGuards(BasicAuthGuard)
    async createUser(@Body() userDto: UserCreateModelDto) {
        const newUser = await this.commandBus.execute(new CreateUserCommand(userDto));
        return newUser;
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(BasicAuthGuard)
    async deleteUserById(@Param('id') userId: string) {
        const idDeleted = await this.commandBus.execute(new DeleteUserCommand(userId));
        if (!idDeleted) {
            throw new NotFoundException('user not found');
        } else return idDeleted;
    }
}
