import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importación necesaria
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { UserService } from './user.service.js';
import { ProductService } from './product.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables estén disponibles en toda la app
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, ProductService],
})
export class AppModule {}
