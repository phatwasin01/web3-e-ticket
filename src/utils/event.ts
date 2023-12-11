import { BigNumber, ethers } from "ethers";

export const createEventFormToWeb3 = (
  name: string,
  location: string,
  date: string,
  imageCoverUri: string,
  ticketLimit: number,
  ticketPrice: string
) => {
  if (
    !name ||
    !location ||
    !date ||
    !imageCoverUri ||
    !ticketLimit ||
    !ticketPrice
  ) {
    throw new Error("All fields are required");
  }
  console.log(ticketPrice);
  console.log(ticketPrice.toString());
  return {
    name,
    location,
    dateTimestamp: new Date(date).getTime() / 1000,
    imageCoverUri,
    ticketLimit: BigNumber.from(ticketLimit),
    ticketPrice: ethers.utils.parseEther(ticketPrice),
  };
};
