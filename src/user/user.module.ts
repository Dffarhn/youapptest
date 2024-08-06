import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { FilterFieldsMiddleware } from './middleware/userReq.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema, collection:"useryouapp" }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FilterFieldsMiddleware)
      .forRoutes(
        { path: 'api/createProfile', method: RequestMethod.POST },
        { path: 'api/updateProfile', method: RequestMethod.PATCH },
      );
  }
}