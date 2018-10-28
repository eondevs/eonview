import { Injectable } from '@angular/core';
import { FilesManagingService } from './filesManaging.service';

@Injectable()
export class DataLoaderService {
  constructor(
    private filesManagingService: FilesManagingService
  ) { }

  async loadData() {
    await this.filesManagingService.loadFiles();
    return;
  }
}
