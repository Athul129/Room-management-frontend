import { Routes, Route } from 'react-router-dom'
import StaffDashboard from './pages/Dashboards/staff/Staff-dashboard'
import UserDashboard from './pages/Dashboards/user/User-dashboard'
import Login from './pages/login/login'
import ProtectedRoute from './protectrout/protectroot'
import UserList from './pages/userslist/userlist'
import UserRegister from './registrations/Register'
import StaffRegister from './registrations/staffregister'
import StaffList from './pages/userslist/stafflist'
import Navbar from './components/Navbar'
import AdminRegister from './registrations/adminregister'
import EditUserProfile from './pages/profiles/useredit'
import UserProfile from './pages/profiles/userprofile'
import StaffProfile from './pages/profiles/staffprofile'
import EditStaffProfile from './pages/profiles/staffedit'
import RoomCreate from './pages/room/roomcreate'
import AdminRoomList from './pages/Dashboards/admin/Admin-dashboard'
import AdminRoomDetail from './pages/Dashboards/admin/roomdetail'
import AdminRoomEdit from './pages/room/roomedit'
import RoomDetail from './pages/Dashboards/user/detail-room'
import RoomBooking from './pages/Booking/roombooking'
import AdminBookingRequests from './pages/Dashboards/admin/Bookings/bookingreq'
import FacilityCreate from './pages/facility/create'
import FacilityList from './pages/facility/list'
import UserBookings from './pages/Dashboards/user/mybookings'
import BookingsApproved from './pages/Dashboards/admin/Bookings/bookings_approve'
import StaffRoomDetail from './pages/Dashboards/staff/detail_staff'
import ChangePassword from './pages/changepassword/changepass'
import BookingsRejected from './pages/Dashboards/admin/Bookings/bookings_rejected'
import StaffBookRoom from './pages/Dashboards/staff/staffbooking'
import UserNotifications from './pages/notifications/notification'
import AdminNotification from './pages/notifications/adminnotification'
import SubmitComplaint from './pages/complaints/complaintsubmit'
import AdminComplaintList from './pages/complaints/complaints_list'
import StaffNotification from './pages/notifications/staffnotification'
import AdminSendMessage from './pages/notifications/create_message'
import StaffBookings from './pages/Dashboards/staff/staffbookings'
import VerifyOtp from './pages/forget_password/verify_otp'
import ForgotPassword from './pages/forget_password/request_otp'
import ResetPassword from './pages/forget_password/reset_password'


function App() {
  return (

    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AdminRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/forgot-Password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={< VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <AdminRoomList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-notifications"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <AdminNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facility-create"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <FacilityCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facility-list"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <FacilityList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["1"]}>
              <AdminBookingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approved-bookings"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <BookingsApproved />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rejected-bookings"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <BookingsRejected />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-complaints"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <AdminComplaintList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-message"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <AdminSendMessage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <AdminRoomDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <AdminRoomEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-register"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <StaffRegister />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userlist"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stafflist"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <StaffList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-notifications"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <StaffNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/rooms/:id"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <StaffRoomDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-booking"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <StaffBookRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-bookings"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <StaffBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-home"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={['1', '2', '3']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <UserBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <UserNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/compalint-submit"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:id"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <RoomDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <RoomBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-edit"
          element={
            <ProtectedRoute allowedRoles={['3']}>
              <EditUserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-staff"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <StaffProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-edit"
          element={
            <ProtectedRoute allowedRoles={['2']}>
              <EditStaffProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room-create"
          element={
            <ProtectedRoute allowedRoles={['1']}>
              <RoomCreate />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}
export default App;
