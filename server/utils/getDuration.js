import mp3Duration from 'mp3-duration';

export function getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
        mp3Duration(filePath, (err, duration) => {
            if (err) {
                console.error("Error getting audio duration:", err);
                return reject("Internal server error");
            }
            console.log("Audio duration:", parseInt(duration));
            resolve(parseInt(duration));
        });
    });
}
