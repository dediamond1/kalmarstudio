import { images } from "@/constants/images";
import Image from "next/image";
import React from "react";

const LogoImage = () => {
  return <Image src={images.logo} alt="logo" width={196} height={56} />;
};

export default LogoImage;
