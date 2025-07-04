import Image from "next/image";

interface PageHeaderProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
}

export default function PageHeader({
  backgroundImage,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="relative w-full h-[60vh] flex items-center justify-center text-center overflow-hidden">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title || ""}
          fill
          className="object-cover z-0"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 text-white px-4">
        {title && <h1 className="text-4xl font-bold mb-4">{title}</h1>}
        {description && <p className="text-lg max-w-2xl mx-auto">{description}</p>}
      </div>
    </section>
  );
}