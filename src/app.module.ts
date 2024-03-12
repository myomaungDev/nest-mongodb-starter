import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:['.env.local']}),
    MongooseModule.forRoot(process.env.DB_URL),
  ],
 
})
export class AppModule {}
