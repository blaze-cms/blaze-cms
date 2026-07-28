export interface StorageAdapter {
  upload(
    path: string,
    data: Buffer | Uint8Array | string,
    contentType?: string,
  ): Promise<{ url: string; path: string }>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<boolean>;
  list(prefix?: string): Promise<Array<{ name: string; url: string; size: number }>>;
  exists(path: string): Promise<boolean>;
}
