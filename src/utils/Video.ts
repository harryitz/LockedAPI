import { existsSync, mkdirSync, PathLike, readFile, unlink, writeFileSync } from "fs";
import path from "path";
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import ffprobePath from 'ffprobe-static';

if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
} else {
    throw new Error("ffmpegPath is null. Please ensure ffmpeg-static is properly installed.");
}
ffmpeg.setFfprobePath(ffprobePath.path);

const unlinkFile = (filePath: string) => {
    unlink(filePath, (err) => {
    });
};

const createFolderIfNotExist = (folderPath: PathLike) => {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
    }
};

export const thumbnailData = async (
    videoPath: any,
    imageFormat = "jpeg",
    maxWidth = 640,
    quality = 75
) => {
    return new Promise((resolve, reject) => {
        try {
            createFolderIfNotExist(path.join(__dirname, "thumbnails"));
            const tempFilePath = path.join(
                __dirname,
                "thumbnails",
                `thumbnail_${Date.now()}.${imageFormat}`
            );

            const tempFilename = `test.mp4`;
            const tempPath = path.join(__dirname, "temp", tempFilename);

            writeFileSync(tempPath, videoPath);

            ffmpeg(tempPath)
                .on("end", () => {
                    readFile(tempFilePath, (err: any, data: unknown) => {
                        if (err) {
                            reject(err);
                        }

                        unlinkFile(tempFilePath);
                        resolve(data);
                    });
                })
                .on("error", (err: any) => {
                    reject(err);
                })
                .screenshots({
                    timestamps: ["50%"],
                    filename: path.basename(tempFilePath),
                    folder: path.join(__dirname, "thumbnails"),
                    size: `${maxWidth}x?`
                });
        } catch (e) {
            console.log(e);
            
        }
    });
};