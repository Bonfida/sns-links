import ThemeContext from "@/context/theme";
import Image from "next/image";
import { useContext } from "react";

const carouselItemDescriptions = [
  {
    title: "Brand",
    description: "Your on chain identity",
    darkImage: "/bonfida-green.svg",
    lightImage: "/bonfida-purple.svg",
  },
  {
    title: "Share",
    description: "Share all your links with ease",
    darkImage: "/share-green.svg",
    lightImage: "/share-purple.svg",
  },
  {
    title: "Verify",
    description: "Peace of mind with verified links",
    darkImage: "/shield-green.svg",
    lightImage: "/shield-purple.svg",
  },
  {
    title: "Standout",
    description: "Standout from the crowd",
    darkImage: "/megaphone-green.svg",
    lightImage: "/megaphone-purple.svg",
  },
  {
    title: "Integrate",
    description: "Easily integrate link share",
    darkImage: "/connect-green.svg",
    lightImage: "/connect-purple.svg",
  },
];

export const HomePageCarousel = () => {
  const { theme } = useContext(ThemeContext);

  console.log("themein", theme);
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
  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex flex-col justify-center items-start w-[235px] border border-carousel-border p-5 gap-3 rounded-2xl bg-carousel-item-bg">
      <Image src={image} width={56.34} height={64} alt="" />
      <span className="text-2xl text-carousel-item-text font-semibold">
        {title}
      </span>
      <p className="text-base text-carousel-item-text font-medium">
        {description}
      </p>
    </div>
  );
};
