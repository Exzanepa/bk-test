import { Module, forwardRef } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { BookmarksModule } from '../bookmarks/bookmarks.module';

@Module({
  imports: [AuthModule, UsersModule, forwardRef(() => BookmarksModule)],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}