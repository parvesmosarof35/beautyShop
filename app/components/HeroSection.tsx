import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { getBaseUrl } from '@/app/store/config/envConfig';

async function getHeroData() {
  try {
    const res = await fetch(`${getBaseUrl()}hero/get-hero-section`, {
      next: { tags: ["Hero"] },
    });

    if (!res.ok) {
      console.error("Failed to fetch hero data", res.status);
      return null;
    }

    const data = await res.json();
    return data?.data;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return null;
  }
}

const HeroSection = async () => {
  const hero = await getHeroData();

  // Default values if API fails or no data
  const defaultHero = {
    title: "Elevate Your Beauty, <br /> Naturally",
    subtitle: "Dermatologically tested, crafted with pure ingredients.",
    backgroundImage: "/images/hero-bg.png",
    primaryButtonText: "Explore Products",
    primaryButtonLink: "/products",
    secondaryButtonText: "Shop Now",
    secondaryButtonLink: "/shop"
  };

  const title = hero?.title || defaultHero.title;
  const subtitle = hero?.subtitle || hero?.description || defaultHero.subtitle;
  const backgroundImage = hero?.backgroundImage || defaultHero.backgroundImage;
  const primaryText = hero?.primaryButtonText || defaultHero.primaryButtonText;
  const primaryLink = hero?.primaryButtonLink || defaultHero.primaryButtonLink;
  const secondaryText = hero?.secondaryButtonText || defaultHero.secondaryButtonText;
  const secondaryLink = hero?.secondaryButtonLink || defaultHero.secondaryButtonLink;

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full">
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt="Lunel Beauty Hero"
            fill
            className="object-cover w-full"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 text-center text-white">
          <h1
            className="text-5xl md:text-6xl lg:text-8xl font-normal mb-8 leading-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-xl lg:text-2xl text-[#c8cacc] font-montserrat mb-10 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href={primaryLink}>
              <Button className="bg-[#d4a574] border-[#D4A574] border-2 font-montserrat !text-black hover:bg-[#e5b687] px-12 py-6 text-xl font-medium rounded-none">
                {primaryText}
              </Button>
            </Link>
            <Link href={secondaryLink}>
              <Button variant="outline" className="!border-[#D4A574] border-2 font-montserrat text-white hover:bg-[#D4A574] hover:text-black px-12 py-6 text-xl font-medium rounded-none">
                {secondaryText}
              </Button>
            </Link>
          </div>
          <Link href="/contact">
            {/* <div className="mt-10 flex items-center justify-center space-x-3 cursor-pointer">
              <SquareArrowOutUpRight className="size-5" />
            <span className="text-white text-base font-montserrat font-medium">Dermatology Partner</span>
          </div> */}
          </Link>
        </div>
      </div>


    </section>
  );
};

export default HeroSection;