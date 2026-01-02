import React from 'react';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.png"
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
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-normal mb-8 leading-tight">Elevate Your Beauty, <br /> Naturally</h1>
          <p className="text-xl lg:text-2xl text-[#c8cacc] font-montserrat mb-10 max-w-3xl mx-auto leading-relaxed">
            Dermatologically tested, crafted with pure ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/products">
            <Button className="bg-[#d4a574] border-[#D4A574] border-2 font-montserrat !text-black hover:bg-[#e5b687] px-12 py-6 text-xl font-medium rounded-none">
              Explore Products
            </Button>
            </Link>
            <Link href="/shop">
            <Button variant="outline" className="!border-[#D4A574] border-2 font-montserrat text-white hover:bg-[#D4A574] hover:text-black px-12 py-6 text-xl font-medium rounded-none">
              Shop Now
            </Button>
            </Link>
          </div>
          <Link href="/contact">
          <div className="mt-10 flex items-center justify-center space-x-3 cursor-pointer">
              <SquareArrowOutUpRight className="size-5" />
            <span className="text-white text-base font-montserrat font-medium">Dermatology Partner</span>
          </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;