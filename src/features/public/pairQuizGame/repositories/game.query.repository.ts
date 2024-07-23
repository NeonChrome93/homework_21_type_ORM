import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../domain/game.entity';

@Injectable()
export class GameQueryRepository {
    constructor(@InjectRepository(GameEntity) public gameQueryRepository: Repository<GameEntity>) {}

    async currentGame() {}

    async gameById() {}
}
