import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThemeProvider from "./theme";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import HomePage from "./pages/private/home/HomePage";
import ProfilePage from "./pages/private/profile/ProfilePage";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import EventsPage from "./pages/private/admin/events/EventsPage";
import CreateEventPage from "./pages/private/admin/events/create/CreateEventPage";
import EditEventPage from "./pages/private/admin/events/edit/EditEventPage";
import EventInfoPage from "./pages/private/event/EventInfoPage";
import UserBookingPage from "./pages/private/profile/bookings/UserBookingPage";
import AdminBookingPage from "./pages/private/admin/bookings/AdminBookingPage";
import CustomerPage from "./pages/private/admin/customers/CustomerPage";
import ReportsPage from "./pages/private/admin/reports/ReportsPage";
import UserReportsPage from "./pages/private/profile/reports/UserReportsPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicLayout><LoginPage/></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><RegisterPage/></PublicLayout>} />
        <Route path="/" element={<PrivateLayout><HomePage/></PrivateLayout>} />
        <Route path="/event/:id" element={<PrivateLayout><EventInfoPage/></PrivateLayout>} />
        <Route path="/profile" element={<PrivateLayout><ProfilePage/></PrivateLayout>} />
        <Route path="/bookings" element={<PrivateLayout><UserBookingPage/></PrivateLayout>} />
        <Route path="/profile/bookings" element={<PrivateLayout><UserBookingPage/></PrivateLayout>} />
        <Route path="/profile/reports" element={<PrivateLayout><UserReportsPage/></PrivateLayout>} />
        <Route path="/admin/events" element={<PrivateLayout><EventsPage/></PrivateLayout>} />
        <Route path="/admin/events/create" element={<PrivateLayout><CreateEventPage/></PrivateLayout>} />
        <Route path="/admin/events/edit/:id" element={<PrivateLayout><EditEventPage/></PrivateLayout>} />
        <Route path="/admin/bookings" element={<PrivateLayout><AdminBookingPage/></PrivateLayout>} />
        <Route path="/admin/users" element={<PrivateLayout><CustomerPage/></PrivateLayout>} />
        <Route path="/admin/reports" element={<PrivateLayout><ReportsPage/></PrivateLayout>} />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;