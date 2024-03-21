import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitService } from './app.service';
import {
  ConfigurationService,
  MessagePatternResponseInterceptor,
  SharedModule,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { UnitSchema } from './mongoDb/schema/schema';
import { UnitController } from './app.controller';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import tunnelConfig from './tunnelConfig';
import tunnel from 'tunnel-ssh';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema }]),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigurationService) => {
        const useTunnel = JSON.parse(
          configService.get('USE_TUNNEL') ?? 'false',
        );
        const mongooseConfig = {
          uri: configService.mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
        if (useTunnel) {
          const { devServerTunnelConfig } = tunnelConfig;
          return new Promise((res, rej) => {
            tunnel(devServerTunnelConfig, async (error, server) => {
              if (server) {
                // lets overwrite default mongouri to use tunnel-ssh
                mongooseConfig.uri = devServerTunnelConfig.mongoDBUri;
                console.log(
                  `tunnel created with host: ${devServerTunnelConfig.host}`,
                );
                res(mongooseConfig);
              } else {
                console.log(
                  `tunnel connection failed with: ${devServerTunnelConfig.host}`,
                );
                console.log(error);
                rej(error);
              }
            });
          });
        }
        return mongooseConfig;
      },
      inject: [ConfigurationService],
    }),
  ],
  controllers: [UnitController],
  providers: [
    UnitService,
    ConfigurationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MessagePatternResponseInterceptor,
    },
    {
      provide: 'HOS_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const port: number = Number(config.get('HOS_MICROSERVICE_PORT'));
        const host = config.get('HOS_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port,
            host,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: 'VEHICLE_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const vehicleServicePort = config.get('VEHICLE_MICROSERVICE_PORT');
        const vehicleServiceHost = config.get('VEHICLE_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: Number(vehicleServicePort),
            host: vehicleServiceHost,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: 'COMPANY_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const companyServicePort = config.get('COMPANY_MICROSERVICE_PORT');
        const companyServiceHost = config.get('COMPANY_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: Number(companyServicePort),
            host: companyServiceHost,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: 'REPORT_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const reportServicePort = config.get('REPORT_MICROSERVICE_PORT');
        const reportServiceHost = config.get('REPORT_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: Number(reportServicePort),
            host: reportServiceHost,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: 'DRIVER_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const driverServicePort = config.get('DRIVER_MICROSERVICE_PORT');
        const driverServiceHost = config.get('DRIVER_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: Number(driverServicePort),
            host: driverServiceHost,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: 'OFFICE_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const officeServicePort = config.get('OFFICE_MICROSERVICE_PORT');
        const officeServiceHost = config.get('OFFICE_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port: Number(officeServicePort),
            host: officeServiceHost,
          },
        });
      },
      inject: [ConfigurationService],
    },
  ],
})
export class AppModule {
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.port);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  /**
   * Normalize port or return an error if port is not valid
   * @param val The port to normalize
   */
  private static normalizePort(val: number | string): number | string {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;

    if (Number.isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    throw new Error(`Port "${val}" is invalid.`);
  }
}
