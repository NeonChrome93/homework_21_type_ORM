import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Device } from '../../../public/devices/domain/device.entity';
import { Post_likes } from '../../../public/posts/domain/post.lilkes.entity';
import { Comments_likes } from '../../../public/comments/domain/comments.likes.entity';
import { Comments } from '../../../public/comments/domain/comment.entity';
import bcrypt from 'bcrypt';
import { PlayerEntity } from '../../../public/pairQuizGame/domain/player.entity';

export type UserDbModel = {
    login: string;
    email: string;
    passwordSalt: string;
    passwordHash: string;
    createdAt: Date;
    confirmationCode: string;
    isConfirmed: boolean;
    passwordRecoveryCode: string | null;
    expirationDateOfRecoveryCode: Date | null;
};

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ collation: 'C' })
    login: string;
    @Column()
    email: string;
    @Column({ default: null })
    passwordSalt: string;
    @Column()
    passwordHash: string;
    @Column()
    createdAt: Date;
    @Column({ nullable: true })
    confirmationCode: string;
    @Column()
    isConfirmed: boolean;
    @Column({ default: null })
    passwordRecoveryCode: string | null;
    @Column({ default: null })
    expirationDateOfRecoveryCode: Date | null;

    @OneToMany(() => Post_likes, likes => likes.user)
    postLikes: Post_likes[];

    @OneToMany(() => Comments_likes, likes => likes.user)
    commentsLikes: Comments_likes[];

    @OneToMany(() => Device, device => device.user)
    devices: Device[];

    @OneToMany(() => Comments, comment => comment.user)
    comment: Comments[];

    @OneToMany(() => PlayerEntity, player => player.user)
    player: PlayerEntity[];

    static async create({
        email,
        login,
        password,
        isConfirmed,
    }: {
        email: string;
        password: string;
        login: string;
        isConfirmed: boolean;
    }): Promise<User> {
        const user = new User();
        const passwordSalt = await bcrypt.genSalt(10);
        //  const passwordHash = await this.generateHash(userCreateModel.password, passwordSalt)
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        user.login = login;
        user.email = email;
        user.passwordHash = passwordHash;
        user.passwordSalt = passwordSalt;
        user.createdAt = new Date();
        user.confirmationCode = isConfirmed ? null : '123';
        user.isConfirmed = isConfirmed;
        user.passwordRecoveryCode = null;
        user.expirationDateOfRecoveryCode = null;

        return user;
    }
}
