import React, { useState, useEffect } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { MdPhoneMissed } from 'react-icons/md'
import { Image } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

const StaticMissedCall = () => {
  const { systemSetting, isMobile } = useMyContext();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isWhatsAppHovered, setIsWhatsAppHovered] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showMissedCallNumber, setShowMissedCallNumber] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = 10 * 10; // 16rem in pixels
      if (window.scrollY > bannerHeight) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
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
  const logoStyle = {
    position: "fixed",
    left: "1rem",
    top: "1rem",
    zIndex: 9999,
    width: 100,
    // height: '50px',
  };

  const isHomeRoute = location.pathname === '/' || location.pathname === '/home';
  return (
    <>
      {isMobile && systemSetting?.logo && isHomeRoute && (
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={logoStyle}
            >
              <Image src={systemSetting.logo} alt="Logo" fluid />
            </motion.div>
          )}
        </AnimatePresence>
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