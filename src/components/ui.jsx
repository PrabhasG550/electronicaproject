import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashUrl from "../assets/dash.svg";

export function useGlassEnter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [glass] = useState(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return Boolean(location.state?.glass);
  });

  useEffect(() => {
    if (!location.state?.glass) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  return glass;
}

export function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M11.5 3.5 6 9l5.5 5.5"
        stroke="#000"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Caret() {
  return (
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" aria-hidden="true">
      <path d="M1.5 4 4.5 7 7.5 4" stroke="#000" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function UnreadDot() {
  return (
    <svg
      preserveAspectRatio="none"
      overflow="visible"
      style={{ display: "block" }}
      width="6"
      height="6"
      viewBox="0 0 6 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Unread"
    >
      <circle cx="3" cy="3" r="3" fill="#00C4FF" />
    </svg>
  );
}

export function Dash() {
  return <img className="dash" src={dashUrl} alt="" width="6.5" height="1" />;
}

export function BackButton({ to = -1, label, state }) {
  const navigate = useNavigate();
  return (
    <button
      className="back"
      type="button"
      aria-label={label || "Back"}
      onClick={() => navigate(to, state ? { state } : undefined)}
    >
      <Chevron />
      {label ? <span>{label}</span> : null}
    </button>
  );
}

export function PrimaryButton({ children, onClick, type = "button", form }) {
  return (
    <button className="cta" type={type} form={form} onClick={onClick}>
      {children}
    </button>
  );
}

export function Screen({ children, cta, backTo, backLabel, backState }) {
  return (
    <section className="screen">
      {backTo !== undefined ? <BackButton to={backTo} label={backLabel} state={backState} /> : null}
      <div className={cta ? "screen-scroll with-cta" : "screen-scroll"}>{children}</div>
      {cta}
    </section>
  );
}

function fillDigits(value, length) {
  return value.replace(/\D/g, "").slice(0, length).padEnd(length, " ");
}

export function CodeBoxes({ value, onChange, labelledBy, length = 10 }) {
  const inputRef = useRef(null);
  const code = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, length);
  const [caret, setCaret] = useState(code.length);
  const slots = Array.from({ length }, (_, index) => code[index] || "");

  function placeCaret(node, index) {
    const pos = Math.max(0, Math.min(index, code.length, length));
    node.setSelectionRange(pos, pos);
    setCaret(pos);
  }

  function onInput(event) {
    const cleaned = event.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, length);
    onChange(cleaned);
    const pos = cleaned.length;
    requestAnimationFrame(() => {
      const node = inputRef.current;
      if (!node) return;
      node.setSelectionRange(pos, pos);
      setCaret(pos);
    });
  }

  function onCapturePointer(event) {
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    const index = Math.min(length - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * length)));
    placeCaret(node, index);
  }

  return (
    <div className="code-row code-entry">
      {slots.map((char, index) => (
        <span key={index} className={caret === index ? "code-box is-current" : "code-box"} aria-hidden="true">
          {char}
        </span>
      ))}
      <input
        ref={inputRef}
        className="code-capture"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label="Code"
        aria-labelledby={labelledBy}
        maxLength={length}
        value={code}
        onChange={onInput}
        onPointerUp={onCapturePointer}
        onKeyUp={(event) => setCaret(event.currentTarget.selectionStart ?? code.length)}
        onSelect={(event) => setCaret(event.currentTarget.selectionStart ?? code.length)}
      />
    </div>
  );
}

export function PhoneField({ country, phone, onCountry, onPhone }) {
  const refs = useRef([]);
  const digits = fillDigits(phone, 10).split("");

  function commit(nextDigits, focusIndex) {
    onPhone(nextDigits.join("").trim());
    if (focusIndex !== undefined) refs.current[focusIndex]?.focus();
  }

  function onDigitChange(index, raw) {
    const cleaned = raw.replace(/\D/g, "");
    const next = digits.slice();
    if (!cleaned) {
      next[index] = "";
      commit(next);
      return;
    }
    cleaned.split("").forEach((char, offset) => {
      if (index + offset < 10) next[index + offset] = char;
    });
    commit(next, Math.min(index + cleaned.length, 9));
  }

  function onKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      const next = digits.slice();
      next[index - 1] = "";
      commit(next, index - 1);
    }
  }

  const groups = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8, 9],
  ];

  return (
    <div className="phone-row">
      <label className="country">
        <Caret />
        <select
          className="country-select"
          aria-label="Country code"
          value={country}
          onChange={(event) => onCountry(event.target.value)}
        >
          <option value="+91">+91</option>
          <option value="+1">+1</option>
        </select>
      </label>
      {groups.map((group, groupIndex) => (
        <span key={group[0]} style={{ display: "contents" }}>
          {groupIndex > 0 ? <Dash /> : null}
          <span className="group">
            {group.map((index) => (
              <input
                key={index}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                className="digit"
                inputMode="numeric"
                aria-label={`Phone digit ${index + 1}`}
                maxLength={1}
                value={digits[index].trim()}
                onChange={(event) => onDigitChange(index, event.target.value)}
                onKeyDown={(event) => onKeyDown(index, event)}
              />
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}

export function MessageList({ messages, showFrom = false, onToggle }) {
  if (messages.length === 0) {
    return <p className="empty-copy">No comms yet.</p>;
  }

  return (
    <div className="list">
      {messages.map((message) => {
        const body = (
          <article className="msg">
            {showFrom ? (
              <div className="from-row">
                <span>from: MumbaiAndarground</span>
                {message.unread ? <UnreadDot /> : <span />}
              </div>
            ) : null}
            <div className="when">{message.date}</div>
            <h2 className="subject">{message.subject}</h2>
            <p className="msg-body">{message.body}</p>
          </article>
        );

        if (!onToggle) return <div key={message.id}>{body}</div>;

        return (
          <SwipeRow key={message.id} unread={message.unread} onToggle={() => onToggle(message.id)}>
            {body}
          </SwipeRow>
        );
      })}
    </div>
  );
}

function SwipeRow({ unread, onToggle, children }) {
  const startX = useRef(0);
  const openRef = useRef(false);
  const rowRef = useRef(null);

  function setOpen(next) {
    openRef.current = next;
    if (rowRef.current) {
      rowRef.current.style.transform = next ? "translateX(-96px)" : "translateX(0)";
    }
  }

  return (
    <div className="swipe">
      <button
        className="swipe-action"
        type="button"
        onClick={() => {
          setOpen(false);
          onToggle();
        }}
      >
        {unread ? "Read" : "Unread"}
      </button>
      <div
        className="swipe-body"
        ref={rowRef}
        onPointerDown={(event) => {
          startX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          const delta = event.clientX - startX.current;
          if (delta < -48) setOpen(true);
          else if (delta > 48) setOpen(false);
        }}
      >
        {children}
      </div>
    </div>
  );
}
