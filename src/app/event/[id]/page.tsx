"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
export default function Event({ params }: { params: { id: string } }) {
  const [price, setPrice] = useState(600);
  const [quantity, setQuantity] = useState(1);
  const event = [
    {
      id: 1,
      name: "Event 1",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 1",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Event 2",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 2",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Event 3",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 3",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Event 4",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 4",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Event 5",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 5",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "Event 6",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 6",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 7,
      name: "Event 7",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 7",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 8,
      name: "Event 8",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 8",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 9,
      name: "Event 9",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 9",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 10,
      name: "Event 10",
      date: "2022-01-01",
      time: "10:00 AM",
      location: "Location 10",
      image: "https://via.placeholder.com/150",
    },
  ].find((event) => event.id === parseInt(params.id));
  if (!event) {
    return <div>Event not found</div>;
  }
  return (
    <div className="min-h-screen ">
      <Navigation />
      <div className="p-8 md:px-36 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Image
            src={`https://via.placeholder.com/150`}
            alt={"event image"}
            width={470}
            height={470}
          />
          <div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-white text-opacity-80">
                {event.name}
              </h2>
              <div className="flex items-center text-xl font-normal gap-3 mt-4">
                <FaLocationDot />
                <p className="text-white text-opacity-80">{event.location}</p>
              </div>
              <div className="flex items-center text-xl font-normal gap-3 mt-4">
                <FaCalendarAlt />
                <p className="text-white text-xl font-normal text-opacity-80">
                  23 November
                </p>
              </div>
              <div className="border border-slate-100 border-opacity-80 mt-4 p-5 text-xl">
                <p className="text-white text-opacity-80">Price: {price}</p>
                <div className="flex ">
                  <p className="text-white text-opacity-80 mt-4">Amount:</p>
                  <div className="flex items-center justify-evenly">
                    <button
                      className="btn  btn-sm ml-4 rounded-full"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="input input-bordered w-14 ml-4 text-center"
                      value={quantity}
                      disabled
                    />

                    <button
                      className="btn  btn-sm ml-4 rounded-full"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-white text-opacity-80 mt-4">
                  Total Price: {price * quantity}
                </p>
              </div>
              <div className="w-full flex justify-center">
                <button className="btn btn-primary btn-md mt-4">
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
