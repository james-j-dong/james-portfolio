import Image from "next/image";

type PictureRendererProps = {
    picturePath: string;
    width?: number;
    height?: number;
    alt?: string;
};

export function PictureRenderer({ picturePath, width = 300, height = 300, alt}: PictureRendererProps) {
    return (
        <Image
            src={picturePath}
            width={width}
            height={height}
            alt={alt ?? ""}
            className="grayscale"
        />
    );
}
