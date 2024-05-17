import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './config/app.settings';
import { config } from './config/configuration';

//const configeFile = config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    appSettings(app);
    await app.listen(config().apiSettings.PORT);
    console.log('port', config().apiSettings.PORT);
}

bootstrap();
