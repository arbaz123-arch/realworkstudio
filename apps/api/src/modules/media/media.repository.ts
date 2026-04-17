export class MediaRepository {
  async createMockUrl(fileName: string): Promise<string> {
    const safeName = fileName.replace(/\s+/g, '-').toLowerCase();
    return Promise.resolve(
      `https://mock-storage.realworkstudio.dev/media/${Date.now()}-${safeName}`
    );
  }
}
