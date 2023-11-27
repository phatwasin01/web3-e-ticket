"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import YourTicket from "@/components/YourTicket";
import EventItem from "@/components/event/EventItem";
import React, { useState } from "react";

export default function Inventory() {
  const [selectedTab, setSelectedTab] = useState(0);
  const mockEvents = [
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
  ];
  return (
    <div className="min-h-screen ">
      <Navigation />
      <div className="py-8 md:px-36">
        <div className="flex gap-8 mt-16">
          <button
            className={selectedTab === 0 ? "btn btn-primary" : "btn"}
            onClick={() => setSelectedTab(0)}
          >
            My Tickets
          </button>
          <button
            className={selectedTab === 1 ? "btn btn-primary" : "btn"}
            onClick={() => setSelectedTab(1)}
          >
            Used Tickets
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-14 gap-y-8 mt-16">
          {mockEvents.map((event) => (
            <EventItem
              event={event}
              key={event.id}
              buttonText={selectedTab === 0 ? "Validate" : "Used"}
              isButtonDisabled={selectedTab === 1}
              buttonOnClick={() => {}}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
