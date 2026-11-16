import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hostEvents } from "../data";
import { CURRENCIES, formatStamp, useApp } from "../state";
import posterUrl from "../assets/afterparty-poster.jpg";
import { MessageList, PrimaryButton, Screen, useGlassEnter } from "../components/ui";

const EVENT_THUMBS = {
  afterparty: posterUrl,
};

export function HostLoginScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();
  const { hostDraft, setHostDraft } = useApp();

  function submit(event) {
    event.preventDefault();
    navigate("/host");
  }

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen
        backTo="/"
        backState={{ glass: true }}
        cta={
          <div className="auth-actions">
            <button className="text-link auth-signup" type="button" onClick={() => navigate("/host-signup")}>
              Sign Up
            </button>
            <PrimaryButton type="submit" form="host-login">
              Login
            </PrimaryButton>
          </div>
        }
      >
      <h1 className="screen-title">Host</h1>
      <form id="host-login" className="stack center-form" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="text-input"
            type="text"
            value={hostDraft.email}
            onChange={(event) => setHostDraft({ ...hostDraft, email: event.target.value })}
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="text-input"
            value={hostDraft.password}
            onChange={(event) => setHostDraft({ ...hostDraft, password: event.target.value })}
          />
        </label>
      </form>
      </Screen>
    </div>
  );
}

export function HostSignupScreen() {
  const navigate = useNavigate();
  const { registerHost, hostDraft, setHostDraft } = useApp();
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!hostDraft.name.trim() || !hostDraft.email.includes("@") || hostDraft.password.length < 4) {
      setError("Enter a name, email, and a password of at least 4 characters.");
      return;
    }
    registerHost({ email: hostDraft.email.trim(), password: hostDraft.password });
    navigate("/host");
  }

  return (
    <Screen
      backTo="/host-login"
      cta={
        <PrimaryButton type="submit" form="host-signup">
          Create account
        </PrimaryButton>
      }
    >
      <h1 className="screen-title">New host</h1>
      <form id="host-signup" className="stack login" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Name</span>
          <input
            className="text-input"
            value={hostDraft.name}
            onChange={(event) => setHostDraft({ ...hostDraft, name: event.target.value })}
          />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="text-input"
            type="email"
            value={hostDraft.email}
            onChange={(event) => setHostDraft({ ...hostDraft, email: event.target.value })}
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="text-input"
            type="password"
            value={hostDraft.password}
            onChange={(event) => setHostDraft({ ...hostDraft, password: event.target.value })}
          />
        </label>
        {error ? <p className="note">{error}</p> : null}
      </form>
    </Screen>
  );
}

export function DashboardScreen() {
  const navigate = useNavigate();
  return (
    <Screen backTo="/host-login">
      <h1 className="screen-title">MumbaiAndarground</h1>
      <div className="stats">
        <div className="stat">
          <span>Revenue</span>
          <strong>$2,000,000</strong>
        </div>
        <div className="stat">
          <span>Events</span>
          <strong>3</strong>
        </div>
        <div className="stat">
          <span>Attendees</span>
          <strong>20,000</strong>
        </div>
      </div>
      <div className="menu">
        <button className="row" type="button" onClick={() => navigate("/events")}>
          Events
        </button>
        <button className="row" type="button" onClick={() => navigate("/finance")}>
          Finance
        </button>
        <button className="row" type="button" onClick={() => navigate("/comms")}>
          Message ticket holders
        </button>
      </div>
    </Screen>
  );
}

function EventTabs({ tab, setTab }) {
  return (
    <div className="tabs" role="tablist">
      {["upcoming", "past"].map((key) => (
        <button
          key={key}
          className={tab === key ? "tab active" : "tab"}
          type="button"
          role="tab"
          aria-selected={tab === key}
          onClick={() => setTab(key)}
        >
          {key === "upcoming" ? "Upcoming" : "Past"}
        </button>
      ))}
    </div>
  );
}

export function EventsScreen() {
  const [tab, setTab] = useState("upcoming");
  const events = hostEvents[tab];
  return (
    <Screen backTo="/host">
      <h1 className="screen-title">Events</h1>
      <EventTabs tab={tab} setTab={setTab} />
      <div className={tab === "past" ? "events-grid events-grid-past" : "events-stack"}>
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            {EVENT_THUMBS[event.id] ? (
              <img className="thumb" src={EVENT_THUMBS[event.id]} alt="" />
            ) : (
              <div className="thumb" role="img" aria-label="" />
            )}
            <h2 className="event-name">{event.name}</h2>
            <div className="meta">
              <span>{event.attendees.toLocaleString("en-US")} attendees</span>
              <span>{event.revenue} revenue</span>
            </div>
          </article>
        ))}
      </div>
    </Screen>
  );
}

export function FinanceScreen() {
  const { currency, setCurrency } = useApp();
  const [status, setStatus] = useState("");
  const active = CURRENCIES.find((item) => item.code === currency) || CURRENCIES[0];
  const available = { USD: 3400, INR: 283000, EUR: 3140 }[active.code];
  const pending = { USD: 2900, INR: 241000, EUR: 2680 }[active.code];

  function money(amount) {
    return `${active.symbol}${amount.toLocaleString("en-US")}`;
  }

  return (
    <Screen backTo="/host">
      <h1 className="screen-title">Finance</h1>
      <div className="finance-list">
        <div className="finance-row">Available: {money(available)}</div>
        <div className="finance-row">Pending: {money(pending)}</div>
        <label className="finance-row finance-currency">
          <span>Currency</span>
          <select
            className="currency-select"
            aria-label="Payment currency"
            value={active.code}
            onChange={(event) => {
              setCurrency(event.target.value);
              setStatus(`Currency set to ${event.target.value}.`);
            }}
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="finance-gap" />
      <div className="finance-list">
        <button
          className="finance-row finance-action"
          type="button"
          onClick={() => setStatus(`Transfer started for ${money(500)}.`)}
        >
          Transfers
        </button>
        <button
          className="finance-row finance-action"
          type="button"
          onClick={() => setStatus(`Payout requested for ${money(available)}.`)}
        >
          Payout
        </button>
        <button
          className="finance-row finance-action"
          type="button"
          onClick={() => setStatus(`Withdraw queued for ${money(available)}.`)}
        >
          Withdraw
        </button>
      </div>
      {status ? <p className="finance-status">{status}</p> : null}
    </Screen>
  );
}

export function SendCommsScreen() {
  const navigate = useNavigate();
  const { messages } = useApp();
  const [tab, setTab] = useState("upcoming");
  const events = hostEvents[tab];
  const firstUpcoming = hostEvents.upcoming[0];
  return (
    <Screen
      backTo="/host"
      cta={
        firstUpcoming ? (
          <PrimaryButton onClick={() => navigate(`/comms/${firstUpcoming.id}/new`)}>
            New message
          </PrimaryButton>
        ) : null
      }
    >
      <h1 className="screen-title">Message ticket holders</h1>
      <p className="screen-hint">Pick an event, or start a new message for the next upcoming show.</p>
      <EventTabs tab={tab} setTab={setTab} />
      {events.map((event) => {
        const sent = messages.filter((message) => message.eventId === event.id).length;
        return (
          <button className="event-card comms-pick" type="button" key={event.id} onClick={() => navigate(`/comms/${event.id}`)}>
            <h2 className="event-name">{event.name}</h2>
            <div className="meta">
              <span>{sent === 0 ? "No messages yet" : `${sent} sent`}</span>
            </div>
          </button>
        );
      })}
    </Screen>
  );
}

function findEvent(id) {
  return [...hostEvents.past, ...hostEvents.upcoming].find((event) => event.id === id);
}

export function CommThreadScreen() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { messages } = useApp();
  const event = findEvent(eventId);
  const thread = messages.filter((message) => message.eventId === eventId);

  if (!event) return null;

  return (
    <Screen
      backTo="/comms"
      cta={<PrimaryButton onClick={() => navigate(`/comms/${eventId}/new`)}>Write message</PrimaryButton>}
    >
      <h1 className="screen-title thread-title">{event.name}</h1>
      <MessageList messages={thread} />
    </Screen>
  );
}

export function NewCommScreen() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { addMessage } = useApp();
  const whenRef = useRef(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [when, setWhen] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!subject.trim() || !body.trim() || (schedule && !when)) {
      setError("Add a subject and message. Choose a time if you schedule it.");
      return;
    }
    const date = schedule ? new Date(when) : new Date();
    addMessage({
      id: `comm-${Date.now()}`,
      eventId,
      date: formatStamp(date),
      subject: subject.trim(),
      body: body.trim(),
    });
    navigate(`/comms/${eventId}`);
  }

  function toggleCalendar(event) {
    event.preventDefault();
    event.stopPropagation();
    const input = whenRef.current;
    if (!input) return;

    if (pickerOpen) {
      input.blur();
      setPickerOpen(false);
      return;
    }

    input.focus({ preventScroll: true });
    input.scrollIntoView({ block: "start", behavior: "smooth" });
    try {
      if (typeof input.showPicker === "function") input.showPicker();
    } catch {
      // Some browsers only allow showPicker from a direct user gesture.
    }
    setPickerOpen(true);
  }

  return (
    <Screen
      backTo={`/comms/${eventId}`}
      cta={
        <PrimaryButton type="submit" form="new-comm">
          Send message
        </PrimaryButton>
      }
    >
      <h1 className="screen-title">Write message</h1>
      <form id="new-comm" className="stack new-comm" onSubmit={submit}>
        <label className="check schedule-check">
          <input type="checkbox" checked={schedule} onChange={(event) => setSchedule(event.target.checked)} />
          Schedule for later
        </label>
        {schedule ? (
          <div className="field schedule-when">
            <span className="field-label" id="send-at-label">
              Send at
            </span>
            <div className="schedule-when-control">
              <input
                ref={whenRef}
                className="text-input"
                type="datetime-local"
                value={when}
                aria-labelledby="send-at-label"
                onChange={(event) => {
                  setWhen(event.target.value);
                  setPickerOpen(false);
                }}
                onBlur={() => setPickerOpen(false)}
                onCancel={() => setPickerOpen(false)}
              />
              <button
                className="schedule-calendar-btn"
                type="button"
                aria-label={pickerOpen ? "Close calendar" : "Open calendar"}
                aria-expanded={pickerOpen}
                onMouseDown={(event) => event.preventDefault()}
                onClick={toggleCalendar}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <rect x="2.5" y="3.5" width="13" height="12" rx="1.5" stroke="#000" strokeWidth="1.2" />
                  <path d="M2.5 7h13M6 2v3M12 2v3" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
        <label className="field">
          <span className="field-label">Subject</span>
          <input className="text-input" value={subject} onChange={(event) => setSubject(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Message</span>
          <textarea className="area-input" value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        {error ? <p className="note">{error}</p> : null}
      </form>
    </Screen>
  );
}
