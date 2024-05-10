import * as dotenv from 'dotenv';
dotenv.config();

enum Environments {
    DEVELOPMENT = 'DEVELOPMENT',
    // STAGING = 'STAGING',
    // PRODUCTION = 'PRODUCTION',
    TEST = 'TEST',
}

export type EnvironmentVariable = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (environmentVariables: EnvironmentVariable, currentEnvironment: Environments) => {
    return {
        apiSettings: {
            PORT: Number.parseInt(environmentVariables.PORT || '3000'),
            LOCAL_HOST: environmentVariables.LOCAL_HOST || 'http://localhost:3007',
            PUBLIC_FRIEND_FRONT_URL: environmentVariables.PUBLIC_FRIEND_FRONT_URL,
        },

        databaseSettings: {
            POSTGRES_CONNECTION_URI: environmentVariables.POSTGRES_CONNECTION_URI,
            POSTGRES_CONNECTION_URI_FOR_TESTS: environmentVariables.POSTGRES_CONNECTION_URI_FOR_TESTS,
        },

        environmentSettings: {
            currentEnv: currentEnvironment,
            //isProduction: currentEnvironment === Environments.PRODUCTION,
            //isStaging: currentEnvironment === Environments.STAGING,
            isTesting: currentEnvironment === Environments.TEST,
            isDevelopment: currentEnvironment === Environments.DEVELOPMENT,
        },
    };
};
//растаскивает и сортирует
export const config = () => {
    const environmentVariables = process.env;

    console.log('process.env.ENV =', environmentVariables.ENV);
    const currentEnvironment: Environments = environmentVariables.ENV as Environments;

    return getConfig(environmentVariables, currentEnvironment);
};
// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
//
// export interface DatabaseConfig {
//     database: Partial<TypeOrmModuleOptions>;
// }
//
// export default (): DatabaseConfig => ({
//     database: {
//         type: 'postgres',
//         host: process.env.POSTGRES_HOST,
//         port: parseInt(<string>process.env.POSTGRES_PORT),
//         username: 'postgres',
//         password: 'necron23',
//         database: 'blogs-posts-ORM',
//         entities: [],
//         autoLoadEntities: true,
//         logging: ['query'],
//         synchronize: false,
//     },
// });
