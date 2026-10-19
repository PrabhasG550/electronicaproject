import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicEvent } from "../data";
import { COMM_GUEST, TICKET_CODE, useApp } from "../state";
import cardUrl from "../assets/card.png";
import { CodeBoxes, MessageList, PhoneField, PrimaryButton, Screen } from "../components/ui";

export function HomeScreen() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function onCode(next) {
    const digits = next.replace(/\D/g, "");
    setCode(digits);
    setError("");
    if (digits.length < 6) return;
    if (digits === TICKET_CODE) navigate("/event");
    else setError("Enter 123123.");
  }

  return (
    <Screen
      cta={<PrimaryButton onClick={() => navigate("/comm-login")}>Comm Center</PrimaryButton>}
    >
      <button className="host-pill" type="button" onClick={() => navigate("/host-login")}>
        Host Login
      </button>
      <div className="home-code">
        <p id="enter-code">Enter Code</p>
        <CodeBoxes value={code} onChange={onCode} labelledBy="enter-code" />
        {error ? <p className="note">{error}</p> : null}
      </div>
    </Screen>
  );
}

export function EventScreen() {
  const navigate = useNavigate();
  return (
    <Screen
      backTo="/"
      cta={<PrimaryButton onClick={() => navigate("/checkout")}>Buy Tickets</PrimaryButton>}
    >
      <div className="poster" role="img" aria-label="Event image" />
      <div className="event-copy">
        <h1>{publicEvent.title}</h1>
        <p>{publicEvent.description}</p>
      </div>
    </Screen>
  );
}

export function CheckoutScreen() {
  const navigate = useNavigate();
  const { guest, setGuest } = useApp();
  const [error, setError] = useState("");
  const total = publicEvent.ticket + publicEvent.fee;

  function pay(event) {
    event.preventDefault();
    if (!guest.name.trim() || guest.phone.replace(/\D/g, "").length < 10) {
      setError("Enter your name and phone number.");
      return;
    }
    navigate("/comm-login");
  }

  return (
    <Screen
      backTo="/event"
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
          Note: Use the same Name and Phone Number, and 6-Digit Code to log into comm dashboard
        </p>
        {error ? <p className="note">{error}</p> : null}
      </form>
    </Screen>
  );
}

export function CommLoginScreen() {
  const navigate = useNavigate();
  const { guest, setGuest } = useApp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const nameOk = guest.name.trim().toLowerCase() === COMM_GUEST.name.toLowerCase();
    const phoneOk = guest.phone.replace(/\D/g, "") === COMM_GUEST.phone;
    const codeOk = code.replace(/\D/g, "") === TICKET_CODE;
    if (!nameOk || !phoneOk || !codeOk) {
      setError("Use Prabhas Gade, 5555555555, and code 123123.");
      return;
    }
    navigate("/comm");
  }

  return (
    <Screen
      backTo="/"
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
          <CodeBoxes value={code} onChange={setCode} labelledBy="login-code" />
        </div>
        {error ? <p className="note">{error}</p> : null}
      </form>
    </Screen>
  );
}

export function CommCenterScreen() {
  const { messages, toggleRead } = useApp();
  return (
    <Screen backTo="/" backLabel="enter new event">
      <h1 className="screen-title">Comm Center</h1>
      <MessageList messages={messages} showFrom onToggle={toggleRead} />
    </Screen>
  );
}
