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
    <div className="flex flex-col justify-center items-start w-[240px] border border-[#FFFFFF3D] p-3 gap-3 rounded-2xl">
      <Image src={image} width={56.34} height={64} alt="" />
      <span>{title}</span>
      <p>{description}</p>
    </div>
  );
};
