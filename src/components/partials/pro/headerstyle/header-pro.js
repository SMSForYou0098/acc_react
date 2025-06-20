import React, { useState, useEffect, memo } from "react";
import { Navbar, Container, Dropdown, Button, } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { IndexRouters } from "../../../../router";
import { motion, AnimatePresence } from "framer-motion";
import CustomToggle from "../../../dropdowns";
import { useDispatch, useSelector } from "react-redux";
import * as SettingSelector from "../../../../store/setting/selectors";
import { logout } from "../../../../store/slices/authSlice";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { User } from "lucide-react";

const Headerpro = memo((props) => {
  const { UserData, isMobile, userRole } = useMyContext()
  const navbarHide = useSelector(SettingSelector.navbar_show); // array
  const themeFontSize = useSelector(SettingSelector.theme_font_size);
  const headerNavbar = useSelector(SettingSelector.header_navbar);
  const [show1, setShow1] = useState(false);
  useEffect(() => {

    document.getElementsByTagName("html")[0].classList.add(themeFontSize);
    //offcanvase code
    const result = window.matchMedia("(max-width: 1200px)");
    window.addEventListener("resize", () => {
      if (result.matches === true) {
        if (show1 === true) {
          document.documentElement.style.setProperty("overflow", "hidden");
        } else {
          document.documentElement.style.removeProperty("overflow");
        }
      } else {
        document.documentElement.style.removeProperty("overflow");
      }
    });
    if (window.innerWidth <= "1200") {

      if (show1 === true) {
        document.documentElement.style.setProperty("overflow", "hidden");
      } else {
        document.documentElement.style.removeProperty("overflow");
      }
    } else {
      document.documentElement.style.removeProperty("overflow");
    }
  });

  useEffect(() => {
    if (isMobile) {
      minisidebar()
    }
  }, []);


  const minisidebar = () => {
    const aside = document.getElementsByTagName("ASIDE")[0];
    if (aside) {
      aside.classList.toggle("sidebar-mini");
    } else {
      console.warn("Aside element not found");
    }
  };

  let location = useLocation();
  let history = useNavigate();



  //optimized code 
  const route = IndexRouters && IndexRouters
    ?.slice(6)
    ?.flatMap(element => element.children.map(child => ({ element, child })))
    ?.find(({ element, child }) => {
      const path = element.path === "" ? `/${child.path}` : `/${element.path}/${child.path}`;
      return path === location.pathname;
    });


  //active link
  const ActiveLink = route ? route?.child.active : undefined;

  //custom code
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    dispatch(logout());
    navigate('/sign-in')
  }
  const [isLoading, setIsLoading] = useState(true);


  return (
    <Navbar
      expand="xl"
      className={`nav iq-navbar header-hover-menu left-border ${headerNavbar} ${navbarHide.join(
        " "
      )}`}
    >
      <Container fluid className="navbar-inner d-flex justify-content-between align-items-center" style={{ paddingRight: isMobile && '0' }}>
        {/* <Logo color={"true"} /> */}
        <div className="d-flex align-items-center">
          {
            (userRole !== 'User' && isMobile) &&
            <div
              // className="sidebar-toggle"
              // data-toggle="sidebar"
              data-active="true"
              onClick={minisidebar}
            >
              <Button className="bg-white"
              >
                <span className="navbar-toggler-icon ">
                  <span className=" bg-primary mt-1 navbar-toggler-bar bar1"></span>
                  <span className=" bg-primary navbar-toggler-bar bar2"></span>
                  <span className=" bg-primary navbar-toggler-bar bar3"></span>
                </span>
              </Button>
            </div>
          }
        </div>
        <div className={` navbar-collapse collapse show}`} id="navbarSupportedContent">
        </div>
        <div className="mobile-actions d-flex align-items-center">
          <ul className="iq-nav-menu list-unstyled p-0 m-0 d-flex align-items-center">
            <Dropdown as="li" className="nav-item">
              <Dropdown.Toggle
                as={CustomToggle}
                variant="py-0  d-flex align-items-center nav-link"
              >
                <div className="btn btn-primary btn-icon btn-sm rounded-pill">
                  <span className="btn-inner">
                    <User size={16} />
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu variant="end">
                {/* <Dropdown.Item as="button">
                  {UserData?.name}
                </Dropdown.Item> */}
                <Dropdown.Item
                  as="button"
                  onClick={() => history("/dashboard/bookings")}
                >
                  My Bookings
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={() => history(`/dashboard/users/manage/${UserData?.id}`)}
                >
                  Profile
                </Dropdown.Item>
                <hr className="dropdown-divider" />
                <Dropdown.Item onClick={() => handleLogOut()}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </div>

      </Container>
    </Navbar>
  );
});

Headerpro.displayName = "Headerpro";
export default Headerpro;
