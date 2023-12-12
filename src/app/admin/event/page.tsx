"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import React, { useState } from "react";
import { useWeb3ModalSigner } from "@web3modal/ethers5/react";
import { contractAddress } from "@/lib/contract";
import { TicketX__factory } from "@/lib/typechain";
import { useEvents } from "@/context/EventContext";
import { createEventFormToWeb3 } from "@/utils/event";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
export default function AdminEvent() {
  const { events, setEvents } = useEvents();
  const { signer } = useWeb3ModalSigner();
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImageCoverUri, setEventImageCoverUri] = useState("");
  const [eventTicketLimit, setEventTicketLimit] = useState(0);
  const [eventTicketPrice, setEventTicketPrice] = useState("0");
  const [txID, setTxID] = useState("");
  const [isTxProcessing, setIsTxProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState("");
  const { data, error, isLoading } = useSWR("ethPrice", async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=thb"
      );
      return response.data.ethereum.thb;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  });
  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  async function handleCreateEvent() {
    if (
      !eventName ||
      !eventLocation ||
      !eventDate ||
      !eventImageCoverUri ||
      !eventTicketLimit ||
      !eventTicketPrice
    ) {
      alert("Please fill in all the fields");
      return;
    }
    const event = createEventFormToWeb3(
      eventName,
      eventLocation,
      eventDate,
      eventImageCoverUri,
      eventTicketLimit,
      eventTicketPrice
    );
    console.log(event);
    console.log(event.ticketPrice.toNumber());
    try {
      setIsTxProcessing(true);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const tx = await mainContract.createEvent(
        event.name,
        event.dateTimestamp,
        event.location,
        event.imageCoverUri,
        event.ticketLimit,
        event.ticketPrice
      );
      setTxID(tx.hash);
      await tx.wait();
      setIsTxProcessing(false);
      setTxSuccess(true);
    } catch (error: any) {
      console.error("Error purchasing tickets:", error);
      setIsTxProcessing(false);
      setTxError(error.message);
    }
  }
  return (
    <div className="min-h-screen ">
      <Navigation />
      <div className="py-8 md:px-36">
        <p className="text-xl font-bold mb-8 text-center">Create Event</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered"
            onChange={(e) => setEventName(e.target.value)}
            value={eventName}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            placeholder="Location"
            className="input input-bordered"
            onChange={(e) => setEventLocation(e.target.value)}
            value={eventLocation}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            placeholder="Date"
            className="input input-bordered"
            onChange={(e) => setEventDate(e.target.value)}
            value={eventDate}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Cover Image URI</span>
          </label>
          <input
            type="text"
            placeholder="Cover Image URI"
            className="input input-bordered"
            onChange={(e) => setEventImageCoverUri(e.target.value)}
            value={eventImageCoverUri}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">
              Price (ETH) ~{" "}
              {(Number(eventTicketPrice) * Number(data)).toFixed(2)} THB
            </span>
          </label>
          <input
            type="number"
            placeholder="Price"
            className="input input-bordered"
            onChange={(e) => setEventTicketPrice(e.target.value)}
            value={eventTicketPrice}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="number"
            placeholder="Amount"
            className="input input-bordered"
            onChange={(e) => setEventTicketLimit(Number(e.target.value))}
            value={eventTicketLimit}
          />
        </div>
        <button
          className="btn btn-primary mt-4 w-full"
          onClick={handleCreateEvent}
        >
          Create
        </button>
      </div>
      <Footer />
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Transaction Status</h3>
          <div className="mt-4 mb-4 text-2xl">
            {isTxProcessing && (
              <span className="loading loading-dots loading-lg"></span>
            )}
            {txSuccess && (
              <div className="w-full flex justify-center items-center">
                Transaction Success
                <FaCheckCircle className="text-success text-2xl" />
              </div>
            )}
            {txError && (
              <div className="w-full flex justify-center items-center">
                Transaction Error
                <MdError className="text-error text-2xl" />
              </div>
            )}
          </div>

          <Link
            href={`https://goerli.etherscan.io/tx/${txID}`}
            target="_blank"
            className="truncate mt-4"
          >
            Etherscan: {txID}
          </Link>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
