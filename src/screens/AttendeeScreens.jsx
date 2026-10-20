import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { publicEvent } from "../data";
import { CODE_LENGTH, TICKET_CODE, useApp } from "../state";
import cardUrl from "../assets/card.png";
import { CodeBoxes, MessageList, PhoneField, PrimaryButton, Screen, useGlassEnter } from "../components/ui";

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
      <Screen
        cta={<PrimaryButton onClick={() => navigate("/comm-login", { state: { glass: true } })}>Comm Center</PrimaryButton>}
      >
        <button className="host-pill" type="button" onClick={() => navigate("/host-login", { state: { glass: true } })}>
          Host Login
        </button>
        <div className="home-code">
          <p id="enter-code">Enter Code</p>
          <CodeBoxes value={code} onChange={onCode} labelledBy="enter-code" length={CODE_LENGTH} />
          {error ? <p className="note">{error}</p> : null}
        </div>
      </Screen>
    </div>
  );
}

export function EventScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();

  return (
    <div className={glass ? "glass-in" : "event-screen"}>
      <Screen
        backTo="/"
        backState={{ glass: true }}
        cta={<PrimaryButton onClick={() => navigate("/checkout", { state: { glass: true } })}>Buy Tickets</PrimaryButton>}
      >
        <div className="poster" role="img" aria-label="Event image" />
        <div className="event-copy">
          <h1>{publicEvent.title}</h1>
          <p>{publicEvent.description}</p>
        </div>
      </Screen>
    </div>
  );
}

export function CheckoutScreen() {
  const navigate = useNavigate();
  const glass = useGlassEnter();
  const { guest, setGuest, addPurchase } = useApp();
  const total = publicEvent.ticket + publicEvent.fee;

  function pay(event) {
    event.preventDefault();
    addPurchase({ name: guest.name, phone: guest.phone });
    navigate("/comm-login", { state: { glass: true } });
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
            Enter Name <span className="required mark">*</span>
            <span className="required">Required for Location Sharing</span>
          </span>
          <input
            className="text-input"
            value={guest.name}
            onChange={(event) => setGuest({ ...guest, name: event.target.value })}
          />
        </label>
        <div className="field">
          <span className="field-label">
            Enter Phone Number <span className="required mark">*</span>
            <span className="required">Required for Location Sharing</span>
          </span>
          <PhoneField
            country={guest.country}
            phone={guest.phone}
            onCountry={(country) => setGuest({ ...guest, country })}
            onPhone={(phone) => setGuest({ ...guest, phone })}
          />
          <p className="note">This information will stay private. SMS rates may apply</p>
        </div>
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
            <span>Payment Method</span>
            <span className="pay-right">
              <img className="card-mark" src={cardUrl} alt="Mastercard" />
              **** 6497
            </span>
          </div>
          <div className="split">
            <span>Total Due</span>
          </div>
          <p className="total">${total}</p>
        </div>
        <p className="note">
          Note: Any name and phone number can log into the comm dashboard with the 10-character code.
        </p>
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
    navigate("/comm");
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
      <h1 className="screen-title">Comm Center Login</h1>
      <form id="comm-login" className="stack login" onSubmit={submit}>
        <label className="field">
          <span className="field-label">Enter Name</span>
          <input
            className="text-input"
            value={guest.name}
            onChange={(event) => setGuest({ ...guest, name: event.target.value })}
          />
        </label>
        <div className="field">
          <span className="field-label">Enter Phone Number</span>
          <PhoneField
            country={guest.country}
            phone={guest.phone}
            onCountry={(country) => setGuest({ ...guest, country })}
            onPhone={(phone) => setGuest({ ...guest, phone })}
          />
        </div>
        <div className="field">
          <span className="field-label" id="login-code">
            Enter Code
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
  const { messages, toggleRead, commAccess } = useApp();
  if (!commAccess) return <Navigate to="/comm-login" replace />;
  return (
    <Screen backTo="/" backLabel="enter new event" backState={{ glass: true }}>
      <h1 className="screen-title">Comm Center</h1>
      <MessageList messages={messages} showFrom onToggle={toggleRead} />
    </Screen>
  );
}
