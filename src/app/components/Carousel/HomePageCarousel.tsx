import { useTheme } from "next-themes";
import Image from "next/image";

const carouselItemDescriptions = [
  {
    title: "Brand",
    description: "Your on chain identity",
    darkImage: "/bonfida/bonfida-green.svg",
    lightImage: "/bonfida/bonfida-purple.svg",
  },
  {
    title: "Share",
    description: "Share all your links with ease",
    darkImage: "/share/share-green.svg",
    lightImage: "/share/share-purple.svg",
  },
  {
    title: "Verify",
    description: "Peace of mind with verified links",
    darkImage: "/shield/shield-green.svg",
    lightImage: "/shield/shield-purple.svg",
  },
  {
    title: "Standout",
    description: "Standout from the crowd",
    darkImage: "/megaphone/megaphone-green.svg",
    lightImage: "/megaphone/megaphone-purple.svg",
  },
  {
    title: "Integrate",
    description: "Easily integrate link share",
    darkImage: "/connect/connect-green.svg",
    lightImage: "/connect/connect-purple.svg",
  },
];

export const HomePageCarousel = () => {
  const { theme } = useTheme();

  return (
    <div className="flex gap-3">
      {carouselItemDescriptions.map((item) => {
        return (
          <HomePageCarouseltem
            title={item.title}
            description={item.description}
            image={theme === "dark" ? item.darkImage : item.lightImage}
            key={item.title}
          />
        );
      })}
    </div>
  );
};

const HomePageCarouseltem = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <div className="flex flex-col justify-center items-start w-[235px] border border-primary-border p-5 gap-3 rounded-2xl bg-carousel-item-bg">
      <Image src={image} width={56.34} height={64} alt="" />
      <span className="text-2xl text-primary-text font-semibold">{title}</span>
      <p className="text-base text-primary-text font-medium">{description}</p>
    </div>
  );
};
