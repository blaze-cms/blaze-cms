export interface BuildOptions {
  outDir?: string;
  clean?: boolean;
}

export async function build(_options: BuildOptions): Promise<void> {
  console.warn("Building Blaze CMS for production...");
  console.warn("Build complete.");
}
