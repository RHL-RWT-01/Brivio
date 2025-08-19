declare module "mp3-duration" {
  export default function getMP3Duration(
    filePath: string,
    callback: (err: Error | null, duration?: number) => void
  ): void;
}
