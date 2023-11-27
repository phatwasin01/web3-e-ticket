import React from "react";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";
interface EventItemProps {
  event: {
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    image: string;
  };
  isButtonDisabled?: boolean;
  buttonText?: string;
  buttonOnClick?: () => void;
}

export default function EventItem({
  event,
  buttonText,
  buttonOnClick,
  isButtonDisabled,
}: EventItemProps) {
  return (
    <div className="p-4 w-full max-w-[232px]" key={event.id}>
      <div className="overflow-hidden">
        <Image src={event.image} alt={event.name} width={232} height={232} />
        <div className="mt-4">
          <h2 className="text-lg mb-2 text-white text-opacity-80">
            {event.name}
          </h2>
          <p className="text-white text-md font-normal text-opacity-80">
            23 November
          </p>
          <div className="flex items-center text-md font-normal gap-2">
            <FaLocationDot />
            <p className="text-white text-opacity-80">{event.location}</p>
          </div>
          <div className="w-full flex justify-end">
            <button
              className="btn btn-outline btn-sm mt-4 rounded-full"
              onClick={buttonOnClick}
              disabled={isButtonDisabled}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
