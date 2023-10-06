import React from "react";
interface props {
  src: string;
  alt: string;
}

const Avatar = ({ src, alt }: props) => {
  return (
    <div className="flex -space-x-2">
      <img
        className="inline-block rounded-full"
        src={src}
        alt={alt}
        width={24}
        height={24}
      />
    </div>
  );
};

export default Avatar;
