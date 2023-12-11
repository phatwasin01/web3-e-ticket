"use client";
import Link from "next/link";
import React from "react";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalSigner,
} from "@web3modal/ethers5/react";

export default function Navigation() {
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { signer } = useWeb3ModalSigner();

  return (
    <div className="navbar px-3 overflow-hidden">
      <div className="hidden md:flex md:flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Web3 Ticket
        </Link>
      </div>
      <div className="flex-none gap-2 ">
        <Link href="/inventory" className="btn btn-ghost">
          Inventory
        </Link>
        <w3m-button />
      </div>
    </div>
  );
}
