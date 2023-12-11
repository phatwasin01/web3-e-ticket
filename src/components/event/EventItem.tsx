import React from "react";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import type { EventData } from "@/context/EventContext";
import moment from "moment";
moment.locale("th");
interface EventItemProps {
  imageOverlay?: string;
  event: EventData;
  isButtonDisabled?: boolean;
  buttonText?: string;
  buttonOnClick?: () => void;
}

export default function EventItem({
  event,
  buttonText,
  buttonOnClick,
  isButtonDisabled,
  imageOverlay,
}: EventItemProps) {
  return (
    <div className="p-4 w-full max-w-[232px]" key={event.id}>
      <div className="overflow-hidden">
        <div className="w-full relative">
          <Image
            src={event.imageCoverUri}
            alt={event.name}
            width={232}
            height={232}
          />
          <div className="absolute bottom-0 right-0 p-2">
            <p className="text-white text-opacity-80">{imageOverlay}</p>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg mb-2 text-white text-opacity-80">
            {event.name}
          </h2>
          <p className="text-white text-md font-normal text-opacity-80">
            {moment(event.dateTimestamp * 1000).format("LL")}
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
