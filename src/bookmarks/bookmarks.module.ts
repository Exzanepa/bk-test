import { Module, forwardRef } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CollectionsModule } from '../collections/collections.module';

@Module({
  imports: [AuthModule, UsersModule, forwardRef(() => CollectionsModule)],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}