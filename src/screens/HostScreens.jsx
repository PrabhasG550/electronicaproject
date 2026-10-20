import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hostEvents } from "../data";
import { HOST, formatStamp, useApp } from "../state";
import { MessageList, PrimaryButton, Screen, useGlassEnter } from "../components/ui";

export function HostLoginScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();
  const { hosts } = useApp();
  const [email, setEmail] = useState(HOST.email);
  const [password, setPassword] = useState(HOST.password);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const match = hosts.some(
      (host) => host.email.toLowerCase() === email.trim().toLowerCase() && host.password === password,
    );
    if (!match) {
      setError("Check the email and password.");
      return;
    }
    navigate("/host");
  }

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen
        backTo="/"
        backState={{ glass: true }}
        cta={
          <PrimaryButton type="submit" form="host-login">
            Login
          </PrimaryButton>
        }
      >
      <h1 className="screen-title">Host Login</h1>
      <form id="host-login" className="stack center-form" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Enter Email</span>
          <input className="text-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Enter Password</span>
          <input className="text-input" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error ? <p className="note">{error}</p> : null}
        <button className="text-link" type="button" onClick={() => navigate("/host-signup")}>
          New Host
        </button>
      </form>
      </Screen>
    </div>
  );
}

export function HostSignupScreen() {
  const navigate = useNavigate();
  const { registerHost } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 4) {
      setError("Enter a name, email, and a password of at least 4 characters.");
      return;
    }
    registerHost({ email: email.trim(), password });
    navigate("/host");
  }

  return (
    <Screen
      backTo="/host-login"
      cta={
        <PrimaryButton type="submit" form="host-signup">
          Create Account
        </PrimaryButton>
      }
    >
      <h1 className="screen-title">New Host</h1>
      <form id="host-signup" className="stack login" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Enter Name</span>
          <input className="text-input" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Enter Email</span>
          <input className="text-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Enter Password</span>
          <input
            className="text-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          <strong>$6,300</strong>
        </div>
        <div className="stat">
          <span>Events</span>
          <strong>3</strong>
        </div>
        <div className="stat">
          <span>Attendees</span>
          <strong>350</strong>
        </div>
      </div>
      <div className="menu">
        <button className="row" type="button" onClick={() => navigate("/events")}>
          View Events
        </button>
        <button className="row" type="button" onClick={() => navigate("/finance")}>
          Manage Finances
        </button>
        <button className="row" type="button" onClick={() => navigate("/comms")}>
          Send Comms
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
  const [tab, setTab] = useState("past");
  const events = hostEvents[tab];
  return (
    <Screen backTo="/host">
      <h1 className="screen-title">Events</h1>
      <EventTabs tab={tab} setTab={setTab} />
      {events.map((event) => (
        <article className="event-card" key={event.id}>
          <div className="thumb" role="img" aria-label="" />
          <h2 className="event-name">{event.name}</h2>
          <div className="meta">
            <span>{event.attendees} Attendees</span>
            <span>{event.revenue} Revenue</span>
          </div>
        </article>
      ))}
    </Screen>
  );
}

export function FinanceScreen() {
  return (
    <Screen backTo="/host">
      <h1 className="screen-title">Finance Management</h1>
      <div className="finance-list">
        <div className="finance-row">Available Balance: $3,400</div>
        <div className="finance-row">Pending Balance: $2,900</div>
        <div className="finance-row">Country (Currency): US (USD)</div>
      </div>
      <div className="finance-gap" />
      <div className="finance-list">
        <div className="finance-row">Transfers</div>
        <div className="finance-row">Payout</div>
      </div>
    </Screen>
  );
}

export function SendCommsScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("past");
  const events = hostEvents[tab];
  return (
    <Screen backTo="/host">
      <h1 className="screen-title">Send Comms</h1>
      <EventTabs tab={tab} setTab={setTab} />
      {events.map((event) => (
        <button className="event-card" type="button" key={event.id} onClick={() => navigate(`/comms/${event.id}`)}>
          <h2 className="event-name">{event.name}</h2>
          <div className="meta">
            <span>{event.attendees} Attendees</span>
          </div>
        </button>
      ))}
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
      cta={<PrimaryButton onClick={() => navigate(`/comms/${eventId}/new`)}>New Comm</PrimaryButton>}
    >
      <h1 className="screen-title">Send Comms</h1>
      <div className="list">
        <div className="event-summary">
          <h2 className="event-name">{event.name}</h2>
          <div className="meta">
            <span>{event.attendees} Attendees</span>
          </div>
        </div>
      </div>
      <p className="section-label">Your Comms</p>
      <MessageList messages={thread} />
    </Screen>
  );
}

export function NewCommScreen() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { addMessage } = useApp();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [when, setWhen] = useState("");
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

  return (
    <Screen
      backTo={`/comms/${eventId}`}
      cta={
        <PrimaryButton type="submit" form="new-comm">
          Send
        </PrimaryButton>
      }
    >
      <h1 className="screen-title">New Comm</h1>
      <form id="new-comm" className="stack login" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Subject</span>
          <input className="text-input" value={subject} onChange={(event) => setSubject(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Message</span>
          <textarea className="area-input" value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        <label className="check">
          <input type="checkbox" checked={schedule} onChange={(event) => setSchedule(event.target.checked)} />
          Schedule message
        </label>
        {schedule ? (
          <label className="field">
            <span className="field-label">Send at</span>
            <input className="text-input" type="datetime-local" value={when} onChange={(event) => setWhen(event.target.value)} />
          </label>
        ) : null}
        {error ? <p className="note">{error}</p> : null}
      </form>
    </Screen>
  );
}
