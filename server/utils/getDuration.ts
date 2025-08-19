import mp3Duration from "mp3-duration";

export async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    mp3Duration(filePath, (err, duration) => {
      if (err) return reject(err);
      if (!duration) return reject(new Error("Invalid duration"));

      resolve(duration);
    });
  });
}
