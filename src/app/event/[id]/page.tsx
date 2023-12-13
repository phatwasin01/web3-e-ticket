"use client";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Image from "next/image";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { contractAddress } from "@/lib/contract";
import Loading from "@/components/Loading";
import { useEvents } from "@/context/EventContext";
import { FaEthereum } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { TicketX__factory } from "@/lib/typechain";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import moment from "moment";
moment.locale("th");
export default function Event({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [txID, setTxID] = useState("");
  const [isTxProcessing, setIsTxProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState("");
  const { isConnected } = useWeb3ModalAccount();
  const { events, setEvents } = useEvents();
  const event = events.find((event) => event.id === Number(params.id));
  const { signer } = useWeb3ModalSigner();
  const mainContract = TicketX__factory.connect(contractAddress, signer!);
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
  async function PurchaseTickets() {
    if (!event) {
      alert("Event not found");
      return;
    }
    try {
      setIsTxProcessing(true);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const tx = await mainContract.purchaseTickets(params.id, quantity, {
        value: (event.ticketPrice * quantity).toString(),
      });
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
  console.log(data);

  if (!events || !event) {
    return <Loading />;
  }
  if (!isConnected) {
    return (
      <div className="min-h-screen ">
        <Navigation />
        <div className="mt-10 w-full flex justify-center my-16">
          <p className="text-error text-2xl font-semibold ">
            PLEASE CONNECT YOUR WALLET
          </p>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen ">
      <Navigation />
      <div className="p-8 md:px-36 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Image
            src={event.imageCoverUri}
            alt={event.id.toString()}
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
                  {moment(event.dateTimestamp * 1000).format("LL")}
                </p>
              </div>
              <div className="border border-slate-100 border-opacity-80 mt-4 p-5 text-xl">
                <div className="flex items-center">
                  <p className="text-white text-opacity-80">
                    Price: {ethers.utils.formatEther(event.ticketPrice)}
                  </p>
                  <FaEthereum className="text-white text-opacity-80" />
                </div>

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
                <div className="flex items-center mt-4">
                  <p className="text-white text-opacity-80">
                    Total Price:{" "}
                    {ethers.utils.formatEther(event.ticketPrice * quantity)}{" "}
                  </p>
                  <FaEthereum className="text-white text-opacity-80" />
                  <p className="text-white text-opacity-80">
                    (~
                    {(
                      Number(
                        ethers.utils.formatEther(event.ticketPrice * quantity)
                      ) * Number(data) || 0
                    ).toFixed(2)}{" "}
                    THB)
                  </p>
                </div>
                <p className="text-white text-opacity-80 mt-4">
                  Amount: {event.ticketLimit - event.ticketsIssued}/
                  {event.ticketLimit}
                </p>
              </div>
              <div className="w-full flex justify-center">
                <button
                  className="btn btn-primary btn-md mt-4"
                  onClick={PurchaseTickets}
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
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
