import { Button } from "@/components/ui/button";
import Image from "next/image";
import { unsplashImages } from "@/lib/unsplash";
import Container from "@/components/ui/Container";

export default function Home() {
  const featuresJson = [
    {
      title: "Quality Materials",
      description: "Only the finest fabrics and printing techniques",
      icon: "✨",
    },
    {
      title: "Fast Turnaround",
      description: "Quick production without compromising quality",
      icon: "⚡",
    },
    {
      title: "Eco-Friendly",
      description: "Sustainable materials and processes",
      icon: "🌱",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <Image
          src={unsplashImages.hero.url}
          alt="Custom Apparel Printing"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium Custom Apparel
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            High-quality printing on premium garments with fast turnaround
          </p>
          <Button size="lg" className="px-8 py-6 text-lg cursor-pointer">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <Container className="!my-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresJson.map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-lg bg-[#fbfbfb] shadow-md shadow-[rgba(0,0,0,0.15)] transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[rgba(0,0,0,0.25)]"
            >
              <div className="text-3xl mb-4 transition-transform duration-300 hover:rotate-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-[var(--secondary-color)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Gallery Section */}
        <h2 className="text-3xl font-bold text-center mb-12 mt-20">Our Work</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6 xl:mt-12 h-full w-full relative">
          {unsplashImages.gallery.slice(0, 6).map((image, index) => (
            <a
              key={index}
              className="cursor-pointer md:w-[30%] relative aspect-square rounded-lg overflow-hidden group transition-transform duration-300 ease-in-out"
            >
              <Image
                src={image.url}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover transform transition-transform duration-500 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </Container>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Contact us today to discuss your custom apparel needs
          </p>
          <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
            Contact Us
          </Button>
        </div>
      </section>
    </div>
  );
}
