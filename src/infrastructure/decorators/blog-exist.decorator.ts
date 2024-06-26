import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../../features/admin/blogs/repositories/blog.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsBlogExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly blogRepository: BlogRepository) {}
    async validate(blogId: any, args: ValidationArguments) {
        const blog = await this.blogRepository.readBlogsId(blogId);
        console.log(blog);
        return !!blog;
    }
}

export function IsBlogExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsBlogExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBlogExistConstraint,
        });
    };
}

// async createPostByBlogId(@Param('blogId',new ValidationPipe({ - для params можно юзать так
//     transform: true,
//     transformOptions: {enableImplicitConversion: true},
//     forbidNonWhitelisted: true
// })) blogId: BlogIdDto, @Body() postDto: createPostByBlogIdDto) {
//     const post = await this.postService.createPost({...postDto, blogId : blogId as unknown as string})
