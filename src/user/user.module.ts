import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserIdCheckMiddwlare } from 'src/middlewares/user-id-check.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {

    configure(consumer: MiddlewareConsumer){
        consumer.apply(UserIdCheckMiddwlare).forRoutes({
            path: 'users/:id',
            method: RequestMethod.ALL
        })
    }

}
