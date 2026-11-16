import { createContext, useContext, useMemo, useState } from "react";

export const TICKET_CODE = "123123";
export const CODE_LENGTH = TICKET_CODE.length;

export const COMM_GUEST = {
  name: "",
  phone: "",
  country: "+91",
};

export const CURRENCIES = [
  { code: "USD", label: "US (USD)", symbol: "$" },
  { code: "INR", label: "India (INR)", symbol: "₹" },
  { code: "EUR", label: "EU (EUR)", symbol: "€" },
];

export const HOST = {
  email: "MumbaiAndarground@gmail.com",
  password: "********************************",
};

export const HOST_DRAFT = {
  name: "",
  email: "",
  password: "",
};

const INITIAL_MESSAGES = [
  {
    id: "location",
    eventId: "afterparty",
    date: "10/19/2026 - 10:23 AM",
    subject: "Location",
    body: "Latitude: 36.3585\nLongitude: -94.2098\n\nCome up the first flight of stairs next to the yellow street light. Have your ticket ready.",
    unread: true,
  },
  {
    id: "ticket",
    eventId: "afterparty",
    date: "10/17/2026 - 10:23 AM",
    subject: "Ticket Code",
    body: `Thank you for the ticket purchase. Here is the code to present at the venue:\n\n${TICKET_CODE}`,
    unread: false,
  },
  {
    id: "theme",
    eventId: "afterparty",
    date: "10/14/2026 - 10:23 AM",
    subject: "Come Prepared.",
    body: "The theme is all black. come prepared for darkness.",
    unread: false,
  },
  {
    id: "debut-thanks",
    eventId: "debut",
    date: "08/22/2025 - 11:04 PM",
    subject: "Thank you",
    body: "Thank you for coming to MAG Debut. Safe travels home.",
    unread: false,
  },
  {
    id: "debut-doors",
    eventId: "debut",
    date: "08/22/2025 - 6:10 PM",
    subject: "Doors",
    body: "Doors at 9. Wristbands at the side entrance on 2nd Ave.",
    unread: false,
  },
];

const AppContext = createContext(null);

export function AppState({ children }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [guest, setGuest] = useState(COMM_GUEST);
  const [hostDraft, setHostDraft] = useState(HOST_DRAFT);
  const [hosts, setHosts] = useState([HOST]);
  const [purchases, setPurchases] = useState([]);
  const [commAccess, setCommAccess] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [ticketType, setTicketType] = useState("door");

  const api = useMemo(
    () => ({
      messages,
      guest,
      setGuest,
      hostDraft,
      setHostDraft,
      hosts,
      purchases,
      commAccess,
      currency,
      setCurrency,
      ticketType,
      setTicketType,
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
      addPurchase({ name, phone, ticketType: kind, eventId }) {
        const ticket = {
          name: name.trim(),
          phone: phone.replace(/\D/g, ""),
          code: TICKET_CODE,
          ticketType: kind || "door",
          eventId: eventId || "afterparty",
        };
        setPurchases((current) => [...current, ticket]);
      },
      grantCommAccess() {
        setCommAccess(true);
      },
    }),
    [messages, guest, hostDraft, hosts, purchases, commAccess, currency, ticketType],
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
