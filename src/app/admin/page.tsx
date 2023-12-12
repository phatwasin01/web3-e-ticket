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
import type { EventData } from "@/context/EventContext";
import { ethers } from "ethers";
export default function Admin() {
  const { events, setEvents } = useEvents();
  const { signer } = useWeb3ModalSigner();
  const [txID, setTxID] = useState("");
  const [isTxProcessing, setIsTxProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);
  const [txError, setTxError] = useState("");
  const {
    data: ethPrice,
    error,
    isLoading,
  } = useSWR("ethPrice", async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=thb"
      );
      return Number(response.data.ethereum.thb);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  });
  const { data: ethBalance } = useSWR("balance", async () => {
    try {
      const balance = await mainContract.viewETHBalance();
      return Number(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  });
  const mainContract = TicketX__factory.connect(contractAddress, signer!);
  async function handleWithdraw() {
    try {
      setIsTxProcessing(true);
      const modal = document.getElementById("my_modal_1");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
      const tx = await mainContract.withdrawAll();
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
        {ethBalance !== undefined && (
          <div className="text-xl font-bold mb-8 text-center ">
            Current Balance: {ethBalance} ETH (~
            {((ethPrice || 0) * (ethBalance || 0) || 0).toFixed(2)}
            THB)
          </div>
        )}
        {ethBalance === undefined && (
          <div className="text-xl font-bold mb-8 text-center ">
            Current Balance: Loading...
          </div>
        )}
        <div className="w-full flex justify-center items-center mb-16">
          <button
            className="btn btn-outline btn-primary"
            onClick={handleWithdraw}
          >
            Claim All
          </button>
        </div>
        <div className="w-full flex justify-center items-center gap-4">
          <Link href="/admin/event">
            <button className="btn btn-primary">Create Event</button>
          </Link>
          <Link href="/admin/validate">
            <button className="btn btn-primary">Use Ticket</button>
          </Link>
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
