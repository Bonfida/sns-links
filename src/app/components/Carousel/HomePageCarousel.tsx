import Image from "next/image";

const carouselItemDescriptions = [
  {
    title: "Brand",
    description: "Your on chain identity",
    image: "/bonfida-green.svg",
  },
  {
    title: "Share",
    description: "Share all your links with ease",
    image: "/share-green.svg",
  },
  {
    title: "Verify",
    description: "Peace of mind with verified links",
    image: "/shield-green.svg",
  },
  {
    title: "Standout",
    description: "Standout from the crowd",
    image: "/megaphone-green.svg",
  },
  {
    title: "Integrate",
    description: "Easily integrate link share",
    image: "/connect-green.svg",
  },
];

export const HomePageCarousel = () => {
  return (
    <div className="flex gap-3">
      {carouselItemDescriptions.map((item) => {
        return (
          <HomePageCarouseltem
            title={item.title}
            description={item.description}
            image={item.image}
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
