

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHotel, FaBell, FaUserCircle, FaSignOutAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FiHome, FiKey, FiUsers, FiSettings, FiCalendar, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import API from '../api/api';

const Navbar = () => {
    const role = localStorage.getItem('role');
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState({
        room: false,
        bookings: false,
        profile: false
    });
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (role === '3' || role === '1' || role === '2') {
                try {
                    const response = await API.get('/notifications/unread-count/');
                    if (response.data.Success) {
                        setUnreadCount(response.data.data.count);
                    }
                } catch (err) {
                    console.error("Error fetching unread notification count", err);
                }
            }
        };

        fetchUnreadCount();
    }, [role]);

    const handleLogout = async () => {
        try {
            await API.post('logout/');
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.clear();
        navigate('/login');
    };

    const toggleDropdown = (dropdown) => {
        setDropdownOpen(prev => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };

    const excludedPaths = [
        '/', '/login', '/register', '/user_register',
        '/forgot-password', '/verify-otp', '/reset-password'
    ];

    if (excludedPaths.includes(location.pathname)) return null;

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={role === '1' ? "/admin-dashboard" : role === '2' ? "/staff-dashboard" : "/user-home"} 
                              className="flex items-center text-2xl font-bold">
                            <FaHotel className="text-blue-600 mr-2" />
                            <span className="text-gray-800"><span className="text-blue-600">Lux</span>ora</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {role === '1' && (
                            <>
                                <NavLink to="/admin-dashboard" label="Dashboard" icon={<FiHome className="mr-1" />} />
                                
                                <Dropdown 
                                    label="Rooms"
                                    icon={<FiKey className="mr-1" />}
                                    isOpen={dropdownOpen.room}
                                    toggle={() => toggleDropdown('room')}
                                    items={[
                                        { to: "/room-create", label: "Create Room", icon: <FiKey className="mr-2" /> },
                                        { to: "/facility-list", label: "Facilities", icon: <FiSettings className="mr-2" /> }
                                    ]}
                                />
                                
                                <Dropdown 
                                    label="Bookings"
                                    icon={<FiCalendar className="mr-1" />}
                                    isOpen={dropdownOpen.bookings}
                                    toggle={() => toggleDropdown('bookings')}
                                    items={[
                                        { to: "/admin/bookings", label: "Booking Requests", icon: <FiCalendar className="mr-2" /> },
                                        { to: "/approved-bookings", label: "Approved", icon: <FiCalendar className="mr-2" /> },
                                        { to: "/rejected-bookings", label: "Rejected", icon: <FiCalendar className="mr-2" /> }
                                    ]}
                                />
                                
                                <NavLink to="/userlist" label="Users" icon={<FiUsers className="mr-1" />} />
                                <NavLink to="/stafflist" label="Staff" icon={<FiUsers className="mr-1" />} />
                                <NavLink to="/admin-complaints" label="Complaints" icon={<FiAlertCircle className="mr-1" />} />
                                <NavLink to="/create-message" label="Messages" icon={<FiMessageSquare className="mr-1" />} />
                                
                                <NotificationBell unreadCount={unreadCount} to="/admin-notifications" />
                            </>
                        )}

                        {role === '3' && (
                            <>
                                <NavLink to="/user-home" label="Home" icon={<FiHome className="mr-1" />} />
                                <NavLink to="/my-bookings" label="My Bookings" icon={<FiCalendar className="mr-1" />} />
                                <NavLink to="/compalint-submit" label="Report Issue" icon={<FiAlertCircle className="mr-1" />} />
                                
                                <Dropdown 
                                    label="Profile"
                                    icon={<FaUserCircle className="mr-1" />}
                                    isOpen={dropdownOpen.profile}
                                    toggle={() => toggleDropdown('profile')}
                                    items={[
                                        { to: "/user-profile", label: "View Profile", icon: <FaUserCircle className="mr-2" /> },
                                        { to: "/change-password", label: "Change Password", icon: <FiSettings className="mr-2" /> }
                                    ]}
                                />
                                
                                <NotificationBell unreadCount={unreadCount} to="/notifications" />
                            </>
                        )}

                        {role === '2' && (
                            <>
                                <NavLink to="/staff-dashboard" label="Dashboard" icon={<FiHome className="mr-1" />} />
                                <NavLink to="/profile-staff" label="Profile" icon={<FaUserCircle className="mr-1" />} />
                                <NavLink to="/staff-booking" label="Book Room" icon={<FiCalendar className="mr-1" />} />
                                <NavLink to="/staff-bookings" label="Bookings" icon={<FiCalendar className="mr-1" />} />
                                <NavLink to="/change-password" label="Settings" icon={<FiSettings className="mr-1" />} />
                                
                                <NotificationBell unreadCount={unreadCount} to="/staff-notifications" />
                            </>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <FaSignOutAlt className="mr-1" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <NotificationBell unreadCount={unreadCount} to={
                            role === '1' ? "/admin-notifications" : 
                            role === '2' ? "/staff-notifications" : "/notifications"
                        } className="mr-4" />
                        
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg
                                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {role === '1' && (
                        <>
                            <MobileNavLink to="/admin-dashboard" label="Dashboard" icon={<FiHome className="mr-2" />} />
                            <MobileNavLink to="/room-create" label="Create Room" icon={<FiKey className="mr-2" />} />
                            <MobileNavLink to="/facility-list" label="Facilities" icon={<FiSettings className="mr-2" />} />
                            <MobileNavLink to="/admin/bookings" label="Booking Requests" icon={<FiCalendar className="mr-2" />} />
                            <MobileNavLink to="/userlist" label="Users" icon={<FiUsers className="mr-2" />} />
                            <MobileNavLink to="/stafflist" label="Staff" icon={<FiUsers className="mr-2" />} />
                            <MobileNavLink to="/admin-complaints" label="Complaints" icon={<FiAlertCircle className="mr-2" />} />
                            <MobileNavLink to="/create-message" label="Messages" icon={<FiMessageSquare className="mr-2" />} />
                        </>
                    )}

                    {role === '3' && (
                        <>
                            <MobileNavLink to="/user-home" label="Home" icon={<FiHome className="mr-2" />} />
                            <MobileNavLink to="/my-bookings" label="My Bookings" icon={<FiCalendar className="mr-2" />} />
                            <MobileNavLink to="/compalint-submit" label="Report Issue" icon={<FiAlertCircle className="mr-2" />} />
                            <MobileNavLink to="/user-profile" label="Profile" icon={<FaUserCircle className="mr-2" />} />
                            <MobileNavLink to="/change-password" label="Change Password" icon={<FiSettings className="mr-2" />} />
                        </>
                    )}

                    {role === '2' && (
                        <>
                            <MobileNavLink to="/staff-dashboard" label="Dashboard" icon={<FiHome className="mr-2" />} />
                            <MobileNavLink to="/profile-staff" label="Profile" icon={<FaUserCircle className="mr-2" />} />
                            <MobileNavLink to="/staff-booking" label="Book Room" icon={<FiCalendar className="mr-2" />} />
                            <MobileNavLink to="/staff-bookings" label="Bookings" icon={<FiCalendar className="mr-2" />} />
                            <MobileNavLink to="/change-password" label="Settings" icon={<FiSettings className="mr-2" />} />
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-left text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md"
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, label, icon }) => (
    <Link
        to={to}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
    >
        {icon}
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, icon }) => (
    <Link
        to={to}
        className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
    >
        {icon}
        {label}
    </Link>
);

const Dropdown = ({ label, icon, isOpen, toggle, items }) => (
    <div className="relative">
        <button
            onClick={toggle}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${isOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
        >
            {icon}
            <span className="mr-1">{label}</span>
            {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
        
        {isOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const NotificationBell = ({ unreadCount, to, className = '' }) => (
    <Link to={to} className={`relative ${className}`}>
        <FaBell className="text-gray-600 hover:text-blue-600 h-5 w-5" />
        {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
            </span>
        )}
    </Link>
);

export default Navbar;