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
import { ethers } from "ethers";
export default function Validate() {
  const { events, setEvents } = useEvents();
  const { signer } = useWeb3ModalSigner();
  const [eventID, setEventID] = useState<number>();
  const [ticketID, setTicketID] = useState<number>();
  const [txID, setTxID] = useState("");
  const [isTxProcessing, setIsTxProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState("");

  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  async function handleUseTicket() {
    if (eventID === undefined || ticketID === undefined) {
      alert("Please fill in all the fields");
      return;
    }
    try {
      setIsTxProcessing(true);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const eventIDBigNumber = ethers.BigNumber.from(eventID);
      const ticketIDBigNumber = ethers.BigNumber.from(ticketID);
      const tx = await mainContract.useTicket(
        ticketIDBigNumber,
        eventIDBigNumber
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
        <p className="text-xl font-bold mb-8 text-center">Use Ticket</p>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event ID</span>
          </label>
          <input
            type="number"
            placeholder="Event ID"
            className="input input-bordered"
            onChange={(e) => setEventID(Number(e.target.value))}
            value={eventID}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Ticket ID</span>
          </label>
          <input
            type="number"
            placeholder="Ticket ID"
            className="input input-bordered"
            onChange={(e) => setTicketID(Number(e.target.value))}
            value={ticketID}
          />
        </div>
        <button
          className="btn btn-primary mt-4 w-full"
          onClick={handleUseTicket}
        >
          Use Ticket
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
                <p className="text-xs">{txError}</p>
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
