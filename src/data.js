export const publicEvent = {
  id: "afterparty",
  title: "MumbaiAndarground \nAfterparty",
  when: "Sat · doors 11p · invite only",
  lineup: "MAG · guests TBA",
  description:
    "The MumbaiAndarground Afterparty. Come prepared. Bring the light. Bring your heart. \n\nAddress and Info will be sent after buying ticket purchase. \n\nContact Info is required. All information will remain private.",
  ticket: 18,
  fee: 2,
};

export const hostEvents = {
  past: [
    {
      id: "debut",
      name: "MAG Debut - Headlining TheSoundChalkMakes",
      attendees: 10000,
      revenue: "$1,000,000",
    },
    {
      id: "changoos",
      name: "MAG - Headlining Changoos",
      attendees: 10000,
      revenue: "$1,000,000",
    },
    {
      id: "memoirs",
      name: "Memoirs of Hysteria Listening Party",
      attendees: 1000,
      revenue: "$1,000,000",
    },
    {
      id: "seven-hills",
      name: "Seven Hills Dance Listening Party + Song Josza III Afters Set",
      attendees: 1000,
      revenue: "$1,000,000",
    },
  ],
  upcoming: [
    {
      id: "afterparty",
      name: "MumbaiAndarground Afterparty",
      attendees: 0,
      revenue: "$0",
    },
  ],
};

export const allEvents = [...hostEvents.upcoming, ...hostEvents.past];
