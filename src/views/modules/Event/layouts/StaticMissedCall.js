import React, { useState, useEffect, useCallback } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faPhone, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { MdPhoneMissed } from 'react-icons/md'
import { Button, Container, Image, Navbar } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { Ticket } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '../../../../store/slices/authSlice'
import { IoLogInOutline } from 'react-icons/io5'

const StaticMissedCall = () => {
  const { systemSetting, isMobile, isLoggedIn, UserData } = useMyContext();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showMissedCallNumber, setShowMissedCallNumber] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = React.useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = 10 * 10; // 16rem in pixels
      if (window.scrollY > bannerHeight) {
        setShowLogo(false);
        setNavbarScrolled(true);
      } else {
        setShowLogo(true);
        setNavbarScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const dispatch = useDispatch();
  const handleLogout = useCallback(async () => {
    dispatch(logout());
  }, []);
  if (!systemSetting?.missed_call_no) return null;

  const formatPhoneNumber = (number) => {
    let cleanNumber = number?.replace(/\D/g, "");

    if (cleanNumber?.length === 10) {
      return `${cleanNumber?.slice(0, 4)}-${cleanNumber?.slice(
        4,
        6
      )}-${cleanNumber?.slice(6)}`;
    } else {
      return cleanNumber;
    }
  };

  const formattedNumber = formatPhoneNumber(systemSetting?.missed_call_no);

  const containerStyle = {
    position: "fixed",
    right: "1.3rem",
    bottom: "10rem",
    zIndex: 9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: showScrollToTop ? "1.5rem" : "1rem", // Adjust gap dynamically
    transition: "gap 0.3s ease", // Smooth transition for gap
  };

  const buttonStyle = {
    width: "50px", // Adjusted size for perfect roundness
    height: "50px", // Adjusted size for perfect roundness
    borderRadius: "50% !important", // Ensures the button is perfectly round
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "1.5rem",
  };

  const missedCallStyle = {
    position: "fixed",
    left: "1.3rem",
    bottom: "10rem",
    zIndex: 9,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    cursor: "pointer",
    flexDirection: "row", // Adjusted for number toggle
  };


  const toggleMissedCallNumber = () => {
    setShowMissedCallNumber((prev) => !prev);
  };
  const navbarStyle = {
    background: navbarScrolled
      ? 'rgba(0, 0, 0, 0.8)'
      : 'rgba(0, 0, 0, 0.5)',
    transition: 'background 0.3s ease',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  };
  const isHomeRoute = (location.pathname === '/' || location.pathname === '/home') && isMobile;

  return (
    <>
      {isHomeRoute && (
        <Navbar style={navbarStyle} variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              {systemSetting?.logo && (
                <Image
                  src={systemSetting.mo_logo}
                  alt="Logo"
                  style={{ height: '25px', width: 'auto' }}
                />
              )}
            </Navbar.Brand>
            <div className="ms-auto">
              {isLoggedIn ? (
                <div className="position-relative" ref={userMenuRef}>
                  <Button
                    variant="secondary"
                    className="d-flex align-items-center rounded-pill"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    <FontAwesomeIcon icon={faAngleDown} />
                  </Button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="position-absolute bg-white rounded shadow mt-1"
                        style={{
                          right: 0,
                          zIndex: 1001,
                          minWidth: '180px',
                          overflow: 'hidden'
                        }}
                      >
                        <Link
                          to={`/dashboard/users/manage/${UserData?.id}`}
                          className="d-flex align-items-center text-dark text-decoration-none p-3 border-bottom hover-bg-light"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FontAwesomeIcon icon={faUser} className="me-3 text-primary" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/dashboard/bookings"
                          className="d-flex align-items-center text-dark text-decoration-none p-3 border-bottom hover-bg-light"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Ticket size={16} className="me-3 text-primary" />
                          <span>My Bookings</span>
                        </Link>
                        <button
                          className="d-flex align-items-center text-dark text-decoration-none p-3 bg-transparent border-0 w-100 text-start hover-bg-light"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="me-3 text-danger" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="sign-in"
                    variant="danger"
                    // size="sm"
                    className='d-flex align-items-center gap-2'
                  >
                   <IoLogInOutline size={16}/> Login
                  </Button>
                </div>
              )}
            </div>
          </Container>
        </Navbar>
      )}

      <div style={containerStyle}>
        <motion.a
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          style={buttonStyle}
          href={`tel:${systemSetting.whatsapp_number}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <motion.i
            style={{ fontSize: "16px" }}
            animate={{ rotate: isHovered ? -20 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faPhone} />
          </motion.i>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="position-absolute bg-white text-primary p-2 rounded shadow"
                style={{
                  right: "70px",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {formatPhoneNumber(systemSetting?.whatsapp_number)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>

        <motion.a
          className="btn btn-success rounded-circle d-flex align-items-center justify-content-center"
          style={buttonStyle}
          href={`https://wa.me/${systemSetting?.whatsapp_number}?text=hi`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsWhatsAppHovered(true)}
          onMouseLeave={() => setIsWhatsAppHovered(false)}
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <motion.i
            style={{ fontSize: "22px", color: "white" }} // Changed icon color to white
            animate={{ rotate: isWhatsAppHovered ? -20 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </motion.i>
          <AnimatePresence>
            {isWhatsAppHovered && (
              <motion.div
                className="position-absolute bg-white text-success p-2 rounded shadow"
                style={{
                  right: "70px",
                  whiteSpace: "nowrap",
                  fontSize: "14px",
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {formatPhoneNumber(systemSetting?.whatsapp_number)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>
      </div>

      <div style={missedCallStyle}>
        <motion.i
          style={{ fontSize: "22px", color: "red", cursor: "pointer" }}
          onClick={toggleMissedCallNumber}
        >
          <MdPhoneMissed />
        </motion.i>
        <AnimatePresence>
          {showMissedCallNumber && (
            <motion.span
              style={{ fontSize: "16px", color: "black", cursor: "pointer" }}
              onClick={() =>
                (window.location.href = `tel:${systemSetting.missed_call_no}`)
              } // Call action on number click
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {formattedNumber}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default StaticMissedCall;