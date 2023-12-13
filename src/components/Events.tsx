"use client";
import React from "react";
import EventItem from "./event/EventItem";
import { useRouter } from "next/navigation";
import {
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from "@web3modal/ethers5/react";
import useSWR from "swr";
import { contractAddress } from "@/lib/contract";
import { TicketX__factory } from "@/lib/typechain";
import { useEvents } from "@/context/EventContext";
import type { EventData } from "@/context/EventContext";

export default function Events() {
  const { isConnected } = useWeb3ModalAccount();
  const { signer } = useWeb3ModalSigner();
  const router = useRouter();
  const { events, setEvents } = useEvents();
  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  const { data, error, isLoading } = useSWR("events", async () => {
    try {
      const events = await mainContract.viewOpenEvents();
      console.log("=================");
      console.log(events);
      const mockEvents: EventData[] = events.map((event) => ({
        id: event.id.toNumber(),
        name: event.name,
        dateTimestamp: event.dateTimestamp.toNumber(),
        location: event.location,
        imageCoverUri: event.imageCoverUri,
        ticketLimit: event.ticketLimit.toNumber(),
        ticketsIssued: event.ticketsIssued.toNumber(),
        ticketPrice: event.ticketPrice.toNumber(),
        isClosed: event.isClosed,
      }));
      setEvents(mockEvents);
      return mockEvents;
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  });
  const handleClick = (id: number) => {
    router.push(`/event/${id}`);
  };
  return (
    <div>
      {events && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-14 gap-y-8">
          {events.map((event) => (
            <EventItem
              event={event}
              key={event.id}
              buttonText="Buy Ticket"
              buttonOnClick={() => {
                handleClick(event.id);
              }}
            />
          ))}
        </div>
      )}
      {(error || !data || isLoading || !isConnected || !events) && (
        <div className="mt-10 w-full flex justify-center">
          <span className="loading loading-dots loading-lg text-primary"></span>
        </div>
      )}
    </div>
  );
}
