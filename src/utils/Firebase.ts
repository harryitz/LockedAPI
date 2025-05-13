import { readFileSync, unlinkSync } from "fs";
import { thumbnailData } from "./Video";
import { createHash } from "crypto";

export const uploadImageToFirebaseStorage = async (userId: string, idToken: string, image: File|Buffer) => {
    try {
        const imageName = `${Date.now()}_vtd182.webp`;

        
        const url = `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${userId}%2Fmoments%2Fthumbnails%2F${imageName}?uploadType=resumable&name=users%2F${userId}%2Fmoments%2Fthumbnails%2F${imageName}`;
        const initHeaders = {
            "content-type": "application/json; charset=UTF-8",
            authorization: `Bearer ${idToken}`,
            "x-goog-upload-protocol": "resumable",
            accept: "*/*",
            "x-goog-upload-command": "start",
            "x-goog-upload-content-length": `${image instanceof Buffer ? image.byteLength : (image as File).size}`,
            "accept-language": "vi-VN,vi;q=0.9",
            "x-firebase-storage-version": "ios/10.13.0",
            "user-agent":
                "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
            "x-goog-upload-content-type": "image/webp",
            "x-firebase-gmpid": "1:641029076083:ios:cc8eb46290d69b234fa609",
        };

        const data = JSON.stringify({
            name: `users/${userId}/moments/thumbnails/${imageName}`,
            contentType: "image/*",
            bucket: "",
            metadata: { creator: userId, visibility: "private" },
        });

        const response = await fetch(url, {
            method: "POST",
            headers: initHeaders,
            body: data,
        });

        if (!response.ok) {
            throw new Error(`Failed to start upload: ${response.statusText}`);
        }

        const uploadUrl = response.headers.get("X-Goog-Upload-URL");

        // Bước 2: Tải dữ liệu hình ảnh lên thông qua URL resumable trả về từ bước 1
        let imageBuffer;
        if (image instanceof Buffer) {
            imageBuffer = image;
        } else {
            if ('path' in image) {
                imageBuffer = readFileSync(image.path as string);
            } else {
                if (image instanceof File) {
                    const arrayBuffer = await image.arrayBuffer();
                    imageBuffer = Buffer.from(arrayBuffer);
                } else {
                    throw new Error("Invalid image type: expected File or Buffer");
                }
            }
        }

        if (!uploadUrl) {
            throw new Error("Upload URL is null");
        }

        let uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "content-type": "application/octet-stream",
                "x-goog-upload-protocol": "resumable",
                "x-goog-upload-offset": "0",
                "x-goog-upload-command": "upload, finalize",
                "upload-incomplete": "?0",
                "upload-draft-interop-version": "3",
                "user-agent":
                    "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
            },
            body: imageBuffer,
        });

        if (!uploadResponse.ok) {
            throw new Error(
                `Failed to upload image: ${uploadResponse.statusText}`
            );
        }

        // Lấy URL tải về hình ảnh từ Firebase Storage
        const getUrl = `https://firebasestorage.googleapis.com/v0/b/locket-img/o/users%2F${userId}%2Fmoments%2Fthumbnails%2F${imageName}`;
        const getHeaders = {
            "content-type": "application/json; charset=UTF-8",
            authorization: `Bearer ${idToken}`,
        };

        const getResponse = await fetch(getUrl, {
            method: "GET",
            headers: getHeaders,
        });

        if (!getResponse.ok) {
            throw new Error(
                `Failed to get download token: ${getResponse.statusText}`
            );
        }

        const downloadToken = (await getResponse.json()).downloadTokens;

        return `${getUrl}?alt=media&token=${downloadToken}`;
    } catch (error) {
        throw error;
    } finally {
        // Xoá file ảnh tạm
        if ('path' in image && typeof image.path === 'string') {
            unlinkSync(image.path);
        }
    }
};

const uploadThumbnailFromVideo = async (userId: string, idToken: string, video: any) => {
    try {
        const thumbnailBytes = await thumbnailData(
            video,
            "jpeg",
            128,
            75
        ) as Buffer;

        return await uploadImageToFirebaseStorage(
            userId,
            idToken,
            thumbnailBytes
        );
    } catch (error) {
        return null;
    }
};

const uploadVideoToFirebaseStorage = async (userId: string, idToken: string, video: File|Buffer) => {
    try {
        const videoName = `${Date.now()}_vtd182.mp4`;
        let videoSize;
        if (video instanceof File) {
            videoSize = video.size;
        } else if (video instanceof Buffer) {
            videoSize = video.byteLength;
        } else {
            throw new Error("Invalid video type: expected File or Buffer");
        }
        // Giai đoạn 1: Khởi tạo quá trình upload, sẽ nhận lại được URL tạm thời để tải video lên
        const url = `https://firebasestorage.googleapis.com/v0/b/locket-video/o/users%2F${userId}%2Fmoments%2Fvideos%2F${videoName}?uploadType=resumable&name=users%2F${userId}%2Fmoments%2Fvideos%2F${videoName}`;
        const headers = {
            "content-type": "application/json; charset=UTF-8",
            authorization: `Bearer ${idToken}`,
            "x-goog-upload-protocol": "resumable",
            accept: "*/*",
            "x-goog-upload-command": "start",
            "x-goog-upload-content-length": `${videoSize}`,
            "accept-language": "vi-VN,vi;q=0.9",
            "x-firebase-storage-version": "ios/10.13.0",
            "user-agent":
                "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
            "x-goog-upload-content-type": "video/mp4",
            "x-firebase-gmpid": "1:641029076083:ios:cc8eb46290d69b234fa609",
        };

        const data = JSON.stringify({
            name: `users/${userId}/moments/videos/${videoName}`,
            contentType: "video/mp4",
            bucket: "",
            metadata: { creator: userId, visibility: "private" },
        });

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: data,
        });

        if (!response.ok) {
            throw new Error(`Failed to start upload: ${response.statusText}`);
        }

        // Giai đoạn 2: Tải video lên thông qua URL resumable trả về từ bước 1
        const uploadUrl = response.headers.get("X-Goog-Upload-URL");
        if (!uploadUrl) {
            throw new Error("Upload URL is null");
        }
        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "content-type": "application/octet-stream",
                "x-goog-upload-protocol": "resumable",
                "x-goog-upload-offset": "0",
                "x-goog-upload-command": "upload, finalize",
                "upload-incomplete": "?0",
                "upload-draft-interop-version": "3",
                "user-agent":
                    "com.locket.Locket/1.43.1 iPhone/17.3 hw/iPhone15_3 (GTMSUF/1)",
            },
            body: video,
        });

        if (!uploadResponse.ok) {
            throw new Error(
                `Failed to upload video: ${uploadResponse.statusText}`
            );
        }

        // Giai đoạn 3: Lấy URL của video đã tải lên và download token. download token này sẽ quyết định quyền truy cập vào video
        const getUrl = `https://firebasestorage.googleapis.com/v0/b/locket-video/o/users%2F${userId}%2Fmoments%2Fvideos%2F${videoName}`;
        const getHeaders = {
            "content-type": "application/json; charset=UTF-8",
            authorization: `Bearer ${idToken}`,
        };

        const getResponse = await fetch(getUrl, {
            method: "GET",
            headers: getHeaders,
        });
        const downloadToken = (await getResponse.json()).downloadTokens;

        return `${getUrl}?alt=media&token=${downloadToken}`;
    } catch (error) {
        throw error;
    }
};

const postVideoToLocket = async (idToken: string, videoUrl: string, thumbnailUrl: string, caption: string) => {
    try {
        const postHeaders = {
            "content-type": "application/json",
            authorization: `Bearer ${idToken}`,
        };

        const data = {
            data: {
                thumbnail_url: thumbnailUrl,
                video_url: videoUrl,
                md5: createHash("md5").update(videoUrl).digest("hex"),
                recipients: [],
                analytics: {
                    experiments: {
                        flag_4: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "43",
                        },
                        flag_10: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "505",
                        },
                        flag_23: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "400",
                        },
                        flag_22: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "1203",
                        },
                        flag_19: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "52",
                        },
                        flag_18: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "1203",
                        },
                        flag_16: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "303",
                        },
                        flag_15: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "501",
                        },
                        flag_14: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "500",
                        },
                        flag_25: {
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                            value: "23",
                        },
                    },
                    amplitude: {
                        device_id: "BF5D1FD7-9E4D-4F8B-AB68-B89ED20398A6",
                        session_id: {
                            value: "1722437166613",
                            "@type":
                                "type.googleapis.com/google.protobuf.Int64Value",
                        },
                    },
                    google_analytics: {
                        app_instance_id: "5BDC04DA16FF4B0C9CA14FFB9C502900",
                    },
                    platform: "ios",
                },
                sent_to_all: true,
                caption: caption,
                overlays: [
                    {
                        data: {
                            text: caption,
                            text_color: "#FFFFFFE6",
                            type: "standard",
                            max_lines: {
                                "@type":
                                    "type.googleapis.com/google.protobuf.Int64Value",
                                value: "4",
                            },
                            background: {
                                material_blur: "ultra_thin",
                                colors: [],
                            },
                        },
                        alt_text: caption,
                        overlay_id: "caption:standard",
                        overlay_type: "caption",
                    },
                ],
            },
        };

        const response = await fetch("https://api.locketcamera.com/postMomentV2", {
            method: "POST",
            headers: postHeaders,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create post: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
};

export const postVideo = async (userId: string, idToken: string, video: any, caption: string) => {
    try {
        let videoAsBuffer: Buffer;
        if (video instanceof Buffer) {
            videoAsBuffer = video;
        } else if (video instanceof File) {
            const arrayBuffer = await video.arrayBuffer();
            videoAsBuffer = Buffer.from(arrayBuffer);
        } else {
            throw new Error("Invalid video type: expected File or Buffer");
        }
        const thumbnailUrl = await uploadThumbnailFromVideo(
            userId,
            idToken,
            video
        );

        if (!thumbnailUrl) {
            throw new Error("Failed to upload thumbnail");
        }

        const videoUrl = await uploadVideoToFirebaseStorage(
            userId,
            idToken,
            videoAsBuffer
        );

        if (!videoUrl) {
            throw new Error("Failed to upload video");
        }

        return await postVideoToLocket(idToken, videoUrl, thumbnailUrl, caption);
    } catch (error) {
        throw error;
    } finally {
        if ('path' in video && typeof video.path === 'string') {
            unlinkSync(video.path);
        }
    }
};