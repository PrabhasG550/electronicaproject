# Team 12

**Electronica** — interactive UI prototype (React + Vite)

Lists who did what, with emphasis on **UI-level** ownership (screens, components, visual system).

---

## Prabhas Gade

**Focus:** Product UI, visual system, and signature screens

Designed and built the prototype’s entire look: Continuum typefaces, white monochrome “channel” layout, phone-stage shell, glass enter transitions (`channel-in`), and the shared screen chrome (back chevron, sticky CTA slot, scroll regions). Owned the screens that define the product’s identity and set the pattern every other flow follows.

**Assigned / contributed (specific)**
- **Visual system (`src/index.css`):** Continuum `@font-face` (light/medium/bold), `:root` type + color, `.stage` / `.phone` frame, `.screen` / `.screen-scroll`, `.cta` / `.cta-slot`, `.back`, field/code/phone digit styles, event channel + poster layout, message thread, tabs, stats, finance rows, swipe-to-read, empty states
- **Shared UI primitives (`src/components/ui.jsx`):** `Screen`, `BackButton` / `Chevron`, `PrimaryButton`, `CodeBoxes` (6-slot invite/ticket entry), `PhoneField` (country + digit groups with dashes), `MessageList` / `SwipeRow` / `UnreadDot`, `useGlassEnter` route transition
- **Home (`/`):** centered “Enter Code” + `CodeBoxes`, Host login / Comm Center text links, glass-in on successful code
- **Event (`/event`):** full-bleed afterparty poster panel + title/copy + “Buy tickets” CTA composition (`event-channel` / `event-poster-panel`)
- **Comm Center (`/comm`):** exclusive post-purchase message list UI (from-row, unread cyan dot, subject/body, swipe mark read/unread)
- **App shell & routing tone (`App.jsx`):** phone-slot framing; invite-first sparse IA (attendee vs host split)
- **Product narrative:** README copy, demo paths, final screenshot set direction (`screenshots/final/`)

**UI-level role:** Lead UI designer–builder — owned the design system, interaction chrome, and the Home / Event / Comm Center surfaces that make Electronica look and feel like itself.

---

## Rishabh Sabnavis

**Focus:** Host dashboard, events, and finance screens

Implemented the organizer ops UI on top of the shared screen system: revenue/events/attendees stats, menu rows into Events / Finance / Comms, upcoming vs past event browsing, and the finance balance/transfer list.

**Assigned / contributed (specific)**
- **Dashboard (`/host`):** “MumbaiAndarground” title, `.stats` block (Revenue / Events / Attendees), `.menu` row buttons to Events, Finance, Comms
- **Events (`/events`):** Upcoming / Past `.tabs`, stacked upcoming list vs past `.events-grid`, `.event-card` with thumb, name, attendees + revenue meta
- **Finance (`/finance`):** Available / Pending / Currency rows, Transfers / Payout section with `.finance-gap` spacing
- Wired host back-navigation (`backTo="/host"` / host-login) so ops screens stay inside the host shell

**UI-level role:** Host ops UI — Dashboard analytics strip, Events tabs/cards, Finance list screens.

---

## Dev Sheth

**Focus:** Checkout and attendee code-access screens

Built the buy-ticket and re-entry UIs: checkout breakdown + guest/phone capture, payment CTA into Comm Center, and Comm Login code entry for returning ticket holders.

**Assigned / contributed (specific)**
- **Checkout (`/checkout`):** ticket + fee `.breakdown`, card mark, name field, `PhoneField` (+91/+1), privacy note, sticky “Pay $…” CTA; on submit grants Comm access and navigates to `/comm`
- **Comm Login (`/comm-login`):** “Enter ticket code” + `CodeBoxes`, error/hint copy, success path into Comm Center with glass transition
- Hooked checkout to guest state (`setGuest`, `addPurchase`, `grantCommAccess`) so the demo purchase path works
- Aligned checkout/comm-login field labels and notes with the shared form styles

**UI-level role:** Attendee transactional UI — Checkout payment form and Comm Login ticket-code gate.

---

## Varun Rayapati

**Focus:** Host Comms messaging UI

Owned send-comms by event: expandable event list, per-event message threads, compose “New Comm,” and empty-thread copy when nothing has been sent yet.

**Assigned / contributed (specific)**
- **Send Comms (`/comms`):** Upcoming / Past event toggles, `.comm-events` list with caret, title, meta; open an event → thread
- **Comm Thread (`/comms/:eventId`):** host-side message list (subject/body/date), unread treatment, empty state (“No comms yet.”), link into New Comm
- **New Comm (`/comms/:eventId/new`):** subject + body fields, schedule-when controls, send CTA posting into the thread
- Comms empty / after-send states used for final screenshots (`final-11` … `final-14`)

**UI-level role:** Host messaging UI — Comms event picker, thread, and compose screens.

---

## Pranav Thoppe

**Focus:** Auth entry, demo data, and prototype plumbing

Supported screens and data that the other flows sit on: host login/signup forms, seed events/messages, client state for guest + purchases + comms, and capture/build helpers for the deliverable screenshots.

**Assigned / contributed (specific)**
- **Host Login (`/host-login`) & Signup (`/host-signup`):** email/password (and signup) fields, primary CTA, auth-actions / signup link styling into Dashboard
- **Demo content (`src/data.js`):** public event copy/pricing, host upcoming/past events, seed comm messages for Afterparty and related events
- **Client state (`src/state.jsx`):** ticket code `123123`, guest fields, purchase + Comm access flags, mark-read helpers used by Comm Center / host threads
- Capture/preview support (`scripts/`, `npm run build` / preview) so the final mobile screenshots stay consistent

**UI-level role:** Auth + data UI support — Host login/signup screens, seed content, and state that powers the interactive demo.

---

## Summary (UI ownership at a glance)

| Member | Concrete UI owned |
|--------|-------------------|
| **Prabhas Gade** | Design system + Home, Event poster, Comm Center + shared components (`CodeBoxes`, phone digits, messages, glass transitions) |
| **Rishabh Sabnavis** | Host Dashboard stats/menu, Events tabs/cards, Finance rows |
| **Dev Sheth** | Checkout form + Comm Login code gate |
| **Varun Rayapati** | Host Comms list, thread, New Comm |
| **Pranav Thoppe** | Host login/signup, `data.js` / `state.jsx`, screenshot/build support |

Workload is split across five comparable areas. The creative and system-level UI (type, layout language, shared controls, and the flagship attendee screens) was led and built by Prabhas; teammates owned specific host/attendee flows inside that system.
