import React from "react";
import Container from "./ui/Container";

type Props = {
  title: string;
  description: string;
};

const HeroSection = (props: Props) => {
  const { title, description } = props;
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
      <Container className="container">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mt-4 text-center max-w-2xl mx-auto">
          {description}
        </p>
      </Container>
    </div>
  );
};

export default HeroSection;
