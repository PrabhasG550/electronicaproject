import { Route, Routes } from "react-router-dom";
import {
  CheckoutScreen,
  CommCenterScreen,
  CommLoginScreen,
  EventScreen,
  HomeScreen,
} from "./screens/AttendeeScreens";
import {
  CommThreadScreen,
  DashboardScreen,
  EventsScreen,
  FinanceScreen,
  HostLoginScreen,
  HostSignupScreen,
  NewCommScreen,
  SendCommsScreen,
} from "./screens/HostScreens";

export default function App() {
  return (
    <div className="stage">
      <div className="phone-slot">
      <div className="phone">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/event" element={<EventScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/comm-login" element={<CommLoginScreen />} />
          <Route path="/comm" element={<CommCenterScreen />} />
          <Route path="/host-login" element={<HostLoginScreen />} />
          <Route path="/host-signup" element={<HostSignupScreen />} />
          <Route path="/host" element={<DashboardScreen />} />
          <Route path="/events" element={<EventsScreen />} />
          <Route path="/finance" element={<FinanceScreen />} />
          <Route path="/comms" element={<SendCommsScreen />} />
          <Route path="/comms/:eventId" element={<CommThreadScreen />} />
          <Route path="/comms/:eventId/new" element={<NewCommScreen />} />
        </Routes>
      </div>
      </div>
    </div>
  );
}
