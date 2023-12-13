"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import EventItem from "@/components/event/EventItem";
import React, { useState } from "react";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import { contractAddress } from "@/lib/contract";
import { TicketX__factory } from "@/lib/typechain";
import { useEvents } from "@/context/EventContext";
import type { EventData } from "@/context/EventContext";
import useSWR from "swr";
import { BigNumber } from "ethers";
export default function Inventory() {
  const [selectedTab, setSelectedTab] = useState(false);
  const { events, setEvents } = useEvents();
  const { signer } = useWeb3ModalSigner();
  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  const { data, error, isLoading } = useSWR("tickets", async () => {
    try {
      const tickets = await mainContract.viewUserTickets();
      console.log(tickets);
      const eventsCheck = tickets.every((ticket) => {
        const event = events.find(
          (event) => event.id === ticket.eventId.toNumber()
        );
        return event;
      });
      if (!events || !eventsCheck) {
        const events = await mainContract.viewAllEvents();
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
      }
      return tickets;
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  });
  function handleValidate(id: BigNumber) {
    console.log(id);
  }
  console.log(data);

  return (
    <div className="min-h-screen ">
      <Navigation />
      <div className="py-8 md:px-36">
        <div className="flex gap-8 mt-16">
          <button
            className={selectedTab === false ? "btn btn-primary" : "btn"}
            onClick={() => setSelectedTab(false)}
          >
            My Tickets
          </button>
          <button
            className={selectedTab === true ? "btn btn-primary" : "btn"}
            onClick={() => setSelectedTab(true)}
          >
            Used Tickets
          </button>
        </div>
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-14 gap-y-8 mt-16">
            {data.some((ticket) => ticket.isUsed === selectedTab) &&
              data.map(
                (ticket) =>
                  ticket.isUsed === selectedTab && (
                    <EventItem
                      event={
                        events.find(
                          (event) =>
                            event.id === ticket.eventId.toNumber() &&
                            ticket.isUsed === selectedTab
                        )!
                      }
                      imageOverlay={"#" + ticket.id}
                      key={ticket.id.toNumber()}
                      buttonText={selectedTab === false ? "Validate" : "Used"}
                      isButtonDisabled={selectedTab === true}
                      buttonOnClick={() => {}}
                    />
                  )
              )}
          </div>
        )}
        {(error || !data || isLoading) && (
          <div className="mt-10 w-full flex justify-center">
            <span className="loading loading-dots loading-lg text-primary"></span>
          </div>
        )}
      </div>
      <Footer />
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
