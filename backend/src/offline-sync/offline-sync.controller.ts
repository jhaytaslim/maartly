import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OfflineSyncService } from "./offline-sync.service";

@ApiTags("offline-sync")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("offline-sync")
export class OfflineSyncController {
  constructor(private offlineSyncService: OfflineSyncService) {}

  @Post("queue")
  async queueSync(
    @Request() req: any,
    @Body()
    data: {
      entity: string;
      operation: string;
      data: any;
    }
  ) {
    return this.offlineSyncService.queueSync({
      userId: req.user.id,
      storeId: req.user.storeId,
      ...data,
    });
  }

  @Post("process")
  async processSync(@Request() req: any) {
    return this.offlineSyncService.processSyncQueue(
      req.user.id,
      req.user.storeId
    );
  }

  @Get("cached-data")
  async getCachedData(@Request() req: any) {
    return this.offlineSyncService.getCachedData(req.user.storeId);
  }
}
