import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Package, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">About Kalmar Studio</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Premium custom printing services with a commitment to quality and
          customer satisfaction
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Our Story */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Our Story</h2>
          <div className="space-y-4">
            <p>
              Founded in 2020, Kalmar Studio began as a small print shop with a
              passion for quality craftsmanship.
            </p>
            <p>
              Today, we've grown into a leading provider of custom printing
              services, serving businesses and individuals across Sweden and
              beyond.
            </p>
            <p>
              Our commitment to using premium materials and state-of-the-art
              printing technology sets us apart in the industry.
            </p>
          </div>
        </Card>

        {/* Our Values */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Our Values</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Award className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Quality First</h3>
                <p className="text-muted-foreground text-sm">
                  We never compromise on materials or print quality
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Customer Focus</h3>
                <p className="text-muted-foreground text-sm">
                  Your satisfaction is our top priority
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Package className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Fast Turnaround</h3>
                <p className="text-muted-foreground text-sm">
                  Quick production without sacrificing quality
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Sustainability</h3>
                <p className="text-muted-foreground text-sm">
                  Eco-friendly materials and processes
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              bio: "Printing expert with 15+ years experience",
            },
            {
              name: "Maria Andersson",
              role: "Creative Director",
              bio: "Design specialist and color guru",
            },
            {
              name: "Erik Nilsson",
              role: "Production Manager",
              bio: "Ensures every print meets our standards",
            },
          ].map((member, index) => (
            <Card key={index} className="p-6 space-y-4 text-center">
              <div className="h-24 w-24 mx-auto rounded-full bg-muted" />
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-primary">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg">Get Started With Your Project</Button>
      </div>
    </div>
  );
}
