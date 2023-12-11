"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface EventData {
  id: number;
  name: string;
  dateTimestamp: number;
  location: string;
  imageCoverUri: string;
  ticketLimit: number;
  ticketsIssued: number;
  ticketPrice: number;
}

interface EventsContextType {
  events: EventData[];
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function useEvents(): EventsContextType {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}

interface EventsProviderProps {
  children: ReactNode;
}

export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useState<EventData[]>(() => {
    // Check if events are stored in local storage
    const localData = localStorage.getItem("events");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    // Update local storage when events change
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const value = {
    events,
    setEvents,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}
