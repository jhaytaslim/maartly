import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { getErrorMessage } from '../common/utils';

@Injectable()
export class OfflineSyncService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Queue offline data for syncing
   */
  async queueSync(data: {
    userId: string;
    storeId: string;
    entity: string;
    operation: string;
    data: any;
  }) {
    const syncRecord = await this.prisma.offlineSync.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        entity: data.entity,
        operation: data.operation,
        data: JSON.stringify(data.data),
        synced: false,
      },
    });

    return syncRecord;
  }

  /**
   * Process pending sync queue
   */
  async processSyncQueue(userId: string, storeId: string) {
    const pendingSync = await this.prisma.offlineSync.findMany({
      where: {
        userId,
        storeId,
        synced: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const results = {
      total: pendingSync.length,
      successful: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const syncItem of pendingSync) {
      try {
        await this.executeSyncOperation(syncItem);
        
        await this.prisma.offlineSync.update({
          where: { id: syncItem.id },
          data: {
            synced: true,
            syncedAt: new Date(),
          },
        });

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          id: syncItem.id,
          error: getErrorMessage(error),
        });
      }
    }

    return results;
  }

  /**
   * Execute a sync operation
   */
  private async executeSyncOperation(syncItem: any) {
    const data = JSON.parse(syncItem.data);

    switch (syncItem.entity) {
      case 'orders':
        return this.syncOrder(syncItem.operation, data);
      case 'products':
        return this.syncProduct(syncItem.operation, data);
      case 'inventory':
        return this.syncInventory(syncItem.operation, data);
      default:
        throw new Error(`Unknown entity: ${syncItem.entity}`);
    }
  }

  private async syncOrder(operation: string, data: any) {
    switch (operation) {
      case 'create':
        return this.prisma.order.create({ data });
      case 'update':
        return this.prisma.order.update({
          where: { id: data.id },
          data,
        });
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async syncProduct(operation: string, data: any) {
    switch (operation) {
      case 'create':
        return this.prisma.product.create({ data });
      case 'update':
        return this.prisma.product.update({
          where: { id: data.id },
          data,
        });
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async syncInventory(operation: string, data: any) {
    switch (operation) {
      case 'update':
        return this.prisma.inventory.update({
          where: {
            productId_storeId: {
              productId: data.productId,
              storeId: data.storeId,
            },
          },
          data: {
            quantity: data.quantity,
          },
        });
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  /**
   * Get sync-ready data for offline mode
   * Cache essential data for offline access
   */
  async getCachedData(storeId: string) {
    const cacheKey = `offline_data_${storeId}`;
    
    let cachedData = await this.cacheManager.get(cacheKey);

    if (!cachedData) {
      // Get essential data
      const [products, inventory, customers] = await Promise.all([
        this.prisma.product.findMany({
          where: {
            inventory: {
              some: {
                storeId,
              },
            },
          },
          include: {
            category: true,
            inventory: {
              where: { storeId },
            },
          },
        }),
        this.prisma.inventory.findMany({
          where: { storeId },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        }),
        this.prisma.customer.findMany({
          take: 100, // Limit for offline cache
          orderBy: {
            updatedAt: 'desc',
          },
        }),
      ]);

      cachedData = {
        products,
        inventory,
        customers,
        lastSync: new Date(),
      };

      // Cache for 1 hour
      await this.cacheManager.set(cacheKey, cachedData, 3600);
    }

    return cachedData;
  }

  /**
   * Invalidate cache when data changes
   */
  async invalidateCache(storeId: string) {
    const cacheKey = `offline_data_${storeId}`;
    await this.cacheManager.del(cacheKey);
  }
}
