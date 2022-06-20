export function makeImagesUrls(images) {
    return images.map((image) => {
        const base64 = Buffer.from(image.data).toString("base64");
        return {
            data: `data:${image.contentType};base64,${base64}`,
            name: image.name,
        };
    });
};

export function makeAvatarUrl(avatar) {
    const base64 = Buffer.from(avatar.data).toString("base64");
    const data = avatar.contentType;

    return `data:${data};base64,${base64}`;
};