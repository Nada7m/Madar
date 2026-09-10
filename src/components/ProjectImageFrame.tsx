import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

type ProjectImageFrameProps = {
  src: string;
  alt: string;
  variant: "hero" | "gallery" | "menu";
  loading?: "eager" | "lazy";
  interactive?: boolean;
};

const frameClasses = {
  hero: "aspect-video rounded-2xl",
  gallery: "aspect-[4/3] rounded-xl",
  menu: "aspect-[4/3] rounded-xl",
} as const;

export function ProjectImageFrame({
  src,
  alt,
  variant,
  loading = "lazy",
  interactive = false,
}: ProjectImageFrameProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const isMenu = variant === "menu";

  return (
    <span className={`relative block w-full overflow-hidden bg-muted ${frameClasses[variant]}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-center transition-transform duration-500 ${
            isMenu ? "object-contain" : "object-cover"
          } ${interactive && !isMenu ? "group-hover:scale-[1.02]" : ""}`}
        />
      ) : (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
          <ImageIcon className="h-8 w-8 opacity-50" aria-hidden="true" />
          <span className="text-xs">تعذّر تحميل الصورة</span>
        </span>
      )}
    </span>
  );
}
