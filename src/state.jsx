import { createContext, useContext, useMemo, useState } from "react";

export const TICKET_CODE = "123123AB12";
export const CODE_LENGTH = TICKET_CODE.length;

export const COMM_GUEST = {
  name: "Prabhas Gade",
  phone: "5555555555",
  country: "+91",
};

export const HOST = {
  email: "MumbaiAndarground@gmail.com",
  password: "********************************",
};

const INITIAL_MESSAGES = [
  {
    id: "location",
    eventId: "debut",
    date: "10/19/2026 - 10:23 AM",
    subject: "Location",
    body: "Latitude: 36.3585 Longitude: -94.2098\n\nCome up the first flight of stairs next to the yellow street light. Have your ticket ready.",
    unread: true,
  },
  {
    id: "ticket",
    eventId: "debut",
    date: "10/17/2026 - 10:23 AM",
    subject: "Ticket Code",
    body: `Thank you for the ticket purchase. Here is the code to present at the venue:\n\n${TICKET_CODE}`,
    unread: false,
  },
  {
    id: "theme",
    eventId: "debut",
    date: "10/14/2026 - 10:23 AM",
    subject: "Come Prepared.",
    body: "The theme is all black. come prepared for darkness.",
    unread: false,
  },
];

const AppContext = createContext(null);

export function AppState({ children }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [guest, setGuest] = useState(COMM_GUEST);
  const [hosts, setHosts] = useState([HOST]);
  const [purchases, setPurchases] = useState([]);
  const [commAccess, setCommAccess] = useState(false);

  const api = useMemo(
    () => ({
      messages,
      guest,
      setGuest,
      hosts,
      commAccess,
      hasTicket: purchases.length > 0,
      toggleRead(id) {
        setMessages((current) =>
          current.map((message) =>
            message.id === id ? { ...message, unread: !message.unread } : message,
          ),
        );
      },
      addMessage(message) {
        setMessages((current) => [{ ...message, unread: true }, ...current]);
      },
      registerHost(host) {
        setHosts((current) => [...current, host]);
      },
      addPurchase({ name, phone }) {
        const ticket = {
          name: name.trim(),
          phone: phone.replace(/\D/g, ""),
          code: TICKET_CODE,
        };
        setPurchases((current) => [...current, ticket]);
      },
      matchesPurchase(name, phone, code) {
        const normalizedName = name.trim().toLowerCase();
        const normalizedPhone = phone.replace(/\D/g, "");
        const normalizedCode = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return purchases.some(
          (ticket) =>
            ticket.name.toLowerCase() === normalizedName &&
            ticket.phone === normalizedPhone &&
            ticket.code === normalizedCode,
        );
      },
      grantCommAccess() {
        setCommAccess(true);
      },
    }),
    [messages, guest, hosts, purchases, commAccess],
  );

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

export function formatStamp(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} - ${hours}:${minutes} ${suffix}`;
}
