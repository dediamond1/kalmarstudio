import { Button } from "@/components/ui/button";
import Image from "next/image";
import { unsplashImages } from "@/lib/unsplash";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <Image
          src={unsplashImages.hero.url}
          alt="Custom Apparel Printing"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Premium Custom Apparel
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            High-quality printing on premium garments with fast turnaround
          </p>
          <Button size="lg" className="px-8 py-6 text-lg">
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
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
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-lg bg-white shadow-sm"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Our Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unsplashImages.gallery.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

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
