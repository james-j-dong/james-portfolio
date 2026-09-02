import Image, { type ImageProps } from "next/image";

type PictureRendererProps = Omit<ImageProps, "src" | "alt"> & {
    picturePath: string;
    alt?: string;
};

export function PictureRenderer({
    picturePath,
    className,
    alt,
    ...imageProps
}: PictureRendererProps) {
    return (
        <Image
            {...imageProps}
            src={picturePath}
            alt={alt ?? ""}
            className={className ? `grayscale ${className}` : "grayscale"}
        />
    );
}
