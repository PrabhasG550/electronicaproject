import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { allEvents, publicEvent } from "../data";
import { CODE_LENGTH, TICKET_CODE, useApp } from "../state";
import cardUrl from "../assets/card.png";
import posterUrl from "../assets/afterparty-poster.jpg";
import { CodeBoxes, MessageList, PhoneField, PrimaryButton, Screen, useGlassEnter } from "../components/ui";

function DoorTicketCard({ code, eventName }) {
  return (
    <div className="door-ticket">
      <p className="door-ticket-label">In-person ticket</p>
      <p className="door-ticket-event">{eventName}</p>
      <div className="door-ticket-grow" aria-hidden="true" />
      <p className="door-ticket-code">
        <span>{code}</span>
      </p>
      <div className="door-ticket-grow" aria-hidden="true" />
      <p className="door-ticket-hint">Show this code at the door for this event.</p>
    </div>
  );
}

export function HomeScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function onCode(next) {
    const entered = next.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    setCode(entered);
    setError("");
    if (entered.length < CODE_LENGTH) return;
    if (entered === TICKET_CODE) navigate("/event", { state: { glass: true } });
    else setError(`Enter ${TICKET_CODE}.`);
  }

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen>
        <button
          className="home-link home-link-host"
          type="button"
          onClick={() => navigate("/host-login", { state: { glass: true } })}
        >
          Host login
        </button>
        <div className="home-code">
          <p id="enter-code">Enter Code</p>
          <CodeBoxes value={code} onChange={onCode} labelledBy="enter-code" length={CODE_LENGTH} />
          {error ? <p className="note">{error}</p> : null}
        </div>
        <button
          className="home-link home-link-comm"
          type="button"
          onClick={() => navigate("/comm-login", { state: { glass: true } })}
        >
          Comm Center
        </button>
      </Screen>
    </div>
  );
}

export function EventScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();

  return (
    <div className={glass ? "glass-in event-layout" : "event-screen event-layout"}>
      <Screen backTo="/" backState={{ glass: true }}>
        <div className="event-channel">
          <aside className="event-poster-panel">
            <img className="poster" src={posterUrl} alt="MumbaiAndarground Afterparty" />
          </aside>
          <div className="event-detail">
            <h1 className="event-title">{publicEvent.title}</h1>
            <div className="event-promo">
              <p className="event-when">{publicEvent.when}</p>
              <p className="event-lineup">{publicEvent.lineup}</p>
            </div>
            <div className="event-copy">
              <p>{publicEvent.description}</p>
            </div>
            <div className="cta-slot">
              <PrimaryButton onClick={() => navigate("/checkout", { state: { glass: true } })}>
                Buy tickets
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Screen>
    </div>
  );
}

export function CheckoutScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();
  const { guest, setGuest, addPurchase, grantCommAccess, ticketType, setTicketType } = useApp();
  const total = publicEvent.ticket + publicEvent.fee;

  function pay(event) {
    event.preventDefault();
    addPurchase({
      name: guest.name,
      phone: guest.phone,
      ticketType,
      eventId: publicEvent.id,
    });
    grantCommAccess();
    navigate("/comm", { state: { glass: true } });
  }

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen
        backTo="/event"
        backState={{ glass: true }}
        cta={
          <PrimaryButton type="submit" form="checkout-form">
            Pay ${total}
          </PrimaryButton>
        }
      >
      <h1 className="screen-title checkout-title">{publicEvent.title}</h1>
      <form id="checkout-form" className="stack checkout" onSubmit={pay}>
        <label className="field">
          <span className="field-label">
            Name <span className="required mark">*</span>
          </span>
          <input
            className="text-input"
            value={guest.name}
            onChange={(event) => setGuest({ ...guest, name: event.target.value })}
          />
        </label>
        <div className="field">
          <span className="field-label">
            Phone <span className="required mark">*</span>
          </span>
          <PhoneField
            country={guest.country}
            phone={guest.phone}
            onCountry={(country) => setGuest({ ...guest, country })}
            onPhone={(phone) => setGuest({ ...guest, phone })}
          />
          <p className="hint">Required for location sharing. Stays private. SMS rates may apply.</p>
        </div>
        <fieldset className="field ticket-type">
          <legend className="field-label">
            Ticket type <span className="required mark">*</span>
          </legend>
          <label className="check ticket-type-option">
            <input
              type="radio"
              name="ticket-type"
              checked={ticketType === "door"}
              onChange={() => setTicketType("door")}
            />
            In-person (show code at door)
          </label>
          <label className="check ticket-type-option">
            <input
              type="radio"
              name="ticket-type"
              checked={ticketType === "digital"}
              onChange={() => setTicketType("digital")}
            />
            Digital only (Comm Center access)
          </label>
        </fieldset>
        <div className="breakdown">
          <div className="split">
            <span>Ticket</span>
            <span>${publicEvent.ticket}</span>
          </div>
          <div className="split">
            <span>Fees</span>
            <span>${publicEvent.fee}</span>
          </div>
          <div className="split">
            <span>Payment</span>
            <span className="pay-right">
              <img className="card-mark" src={cardUrl} alt="Mastercard" />
              **** 6497
            </span>
          </div>
          <div className="split">
            <span>Total</span>
            <span className="total">${total}</span>
          </div>
        </div>
        <p className="hint">After payment you enter the Comm Center — no login step. You can also open it later with the 6-character code.</p>
      </form>
      </Screen>
    </div>
  );
}

export function CommLoginScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();
  const { guest, setGuest, grantCommAccess } = useApp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const entered = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (entered !== TICKET_CODE) {
      setError(`Enter ${TICKET_CODE}.`);
      return;
    }
    grantCommAccess();
    navigate("/comm", { state: { glass: true } });
  }

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen
        backTo="/"
        backState={{ glass: true }}
        cta={
          <PrimaryButton type="submit" form="comm-login">
            Enter
          </PrimaryButton>
        }
      >
      <h1 className="screen-title">Comm Center</h1>
      <form id="comm-login" className="stack login" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Name</span>
          <input
            className="text-input"
            value={guest.name}
            onChange={(event) => setGuest({ ...guest, name: event.target.value })}
          />
        </label>
        <div className="field">
          <span className="field-label">Phone</span>
          <PhoneField
            country={guest.country}
            phone={guest.phone}
            onCountry={(country) => setGuest({ ...guest, country })}
            onPhone={(phone) => setGuest({ ...guest, phone })}
          />
          <p className="hint">Update your phone number here if it has changed.</p>
        </div>
        <div className="field">
          <span className="field-label" id="login-code">
            Code
          </span>
          <CodeBoxes value={code} onChange={setCode} labelledBy="login-code" length={CODE_LENGTH} />
        </div>
        {error ? <p className="note">{error}</p> : null}
      </form>
      </Screen>
    </div>
  );
}

export function CommCenterScreen() {
  const glass = useGlassEnter();
  const { messages, toggleRead, commAccess, ticketType, purchases } = useApp();
  const grouped = allEvents
    .map((event) => ({
      event,
      thread: messages.filter((message) => message.eventId === event.id),
    }))
    .filter((group) => group.thread.length > 0);
  const [openId, setOpenId] = useState(() => {
    const withUnread = grouped.find((group) => group.thread.some((message) => message.unread));
    return withUnread?.event.id ?? grouped[0]?.event.id ?? null;
  });
  const latestPurchase = purchases[purchases.length - 1];
  const showDoorTicket = (latestPurchase?.ticketType ?? ticketType) !== "digital";
  const ticketEventId = latestPurchase?.eventId || publicEvent.id;
  const ticketEvent =
    allEvents.find((event) => event.id === ticketEventId) ||
    allEvents.find((event) => event.id === publicEvent.id);
  const ticketEventName = ticketEvent?.name || publicEvent.title.replace(/\n/g, " ");

  if (!commAccess) return <Navigate to="/comm-login" replace />;

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen backTo="/" backLabel="enter new event" backState={{ glass: true }}>
        <h1 className="screen-title">Comm Center</h1>
        {showDoorTicket ? <DoorTicketCard code={TICKET_CODE} eventName={ticketEventName} /> : null}
        {grouped.length === 0 ? (
          <div className="thread-empty">
            <p className="empty-copy">No comms yet.</p>
          </div>
        ) : (
          <div className="comm-events">
            {grouped.map(({ event, thread }) => {
              const open = openId === event.id;
              const unread = thread.filter((message) => message.unread).length;
              const meta =
                unread > 0
                  ? `${thread.length} · ${unread} new`
                  : `${thread.length} ${thread.length === 1 ? "comm" : "comms"}`;

              return (
                <section className={open ? "comm-event is-open" : "comm-event"} key={event.id}>
                  <button
                    className="comm-event-toggle"
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : event.id)}
                  >
                    <span className="comm-event-title">{event.name}</span>
                    <span className="comm-event-meta">{meta}</span>
                    <span className="comm-event-caret" aria-hidden="true">
                      {open ? "–" : "+"}
                    </span>
                  </button>
                  {open ? <MessageList messages={thread} onToggle={toggleRead} /> : null}
                </section>
              );
            })}
          </div>
        )}
      </Screen>
    </div>
  );
}
