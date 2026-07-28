import { getStorage } from "firebase-admin/storage";

type Bucket = ReturnType<ReturnType<typeof getStorage>["bucket"]>;

export class FirebaseStorageAdapter {
  private bucket: Bucket | null = null;
  private bucketName: string | undefined;

  constructor(bucketName?: string) {
    this.bucketName = bucketName;
  }

  async connect(): Promise<void> {
    const storage = getStorage();
    this.bucket = (this.bucketName
      ? storage.bucket(this.bucketName)
      : storage.bucket()) as unknown as Bucket;
  }

  private getBucket(): Bucket {
    if (!this.bucket) {
      throw new Error("FirebaseStorageAdapter not connected. Call connect() first.");
    }
    return this.bucket;
  }

  async upload(
    path: string,
    data: Buffer | Uint8Array | string,
    contentType?: string,
  ): Promise<{ url: string; path: string }> {
    const file = this.getBucket().file(path);
    const metadata: Record<string, string> = {};
    if (contentType !== undefined) {
      metadata["contentType"] = contentType;
    }
    await file.save(data, { metadata });
    await file.makePublic();
    const expires = new Date("2500-03-01");
    const [url] = await file.getSignedUrl({
      action: "read" as const,
      expires,
    });
    return { path, url };
  }

  async download(path: string): Promise<Buffer> {
    const [data] = await this.getBucket().file(path).download();
    return data;
  }

  async delete(path: string): Promise<boolean> {
    try {
      await this.getBucket().file(path).delete();
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix?: string): Promise<Array<{ name: string; url: string; size: number }>> {
    const options: { prefix?: string } = {};
    if (prefix !== undefined) {
      options.prefix = prefix;
    }
    const result = await this.getBucket().getFiles(options);
    const files = result[0];
    return files.map((file) => ({
      name: file.name,
      size: Number(file.metadata.size ?? 0),
      url: `https://storage.googleapis.com/${this.getBucket().name}/${file.name}`,
    }));
  }

  async exists(path: string): Promise<boolean> {
    const [exists] = await this.getBucket().file(path).exists();
    return exists;
  }
}
