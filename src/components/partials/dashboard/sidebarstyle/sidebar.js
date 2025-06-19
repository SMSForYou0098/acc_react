import React, { useEffect, memo, Fragment, useState, useLayoutEffect } from "react";

//router
import { Link } from "react-router-dom";

//components
import VerticalNav from "./vertical-nav";
//scrollbar
import Scrollbar from "smooth-scrollbar";

// Import selectors & action from setting store
import * as SettingSelector from "../../../../store/setting/selectors";
import { useLocation } from 'react-router-dom';
// Redux Selector / Action
import { useSelector } from "react-redux";
import { useMyContext } from "../../../../Context/MyContextProvider";

const Sidebar = memo((props) => {
  const { isMobile } = useMyContext()
  const [showLogo, setShowLogo] = useState(false)
  const sidebarColor = useSelector(SettingSelector.sidebar_color);
  const sidebarHide = useSelector(SettingSelector.sidebar_show); // array
  const sidebarType = useSelector(SettingSelector.sidebar_type); // array
  const sidebarMenuStyle = useSelector(SettingSelector.sidebar_menu_style);

  const minisidebar = () => {
    const aside = document.getElementsByTagName("ASIDE")[0];
    if (aside) {
      setShowLogo(!showLogo)
      aside.classList.toggle("sidebar-mini");
    } else {
      console.warn("Aside element not found");
    }
  };

  useEffect(() => {
    Scrollbar.init(document.querySelector("#my-scrollbar"));

    window.addEventListener("resize", () => {
      const tabs = document.querySelectorAll(".nav");
      const sidebarResponsive = document.querySelector(
        '[data-sidebar="responsive"]'
      );
      if (window.innerWidth < 1025) {
        Array.from(tabs, (elem) => {
          if (
            !elem.classList.contains("flex-column") &&
            elem.classList.contains("nav-tabs") &&
            elem.classList.contains("nav-pills")
          ) {
            elem.classList.add("flex-column", "on-resize");
          }
          return elem.classList.add("flex-column", "on-resize");
        });
        if (sidebarResponsive !== null) {
          if (!sidebarResponsive.classList.contains("sidebar-mini")) {
            sidebarResponsive.classList.add("sidebar-mini", "on-resize");
          }
        }
      } else {
        Array.from(tabs, (elem) => {
          if (elem.classList.contains("on-resize")) {
            elem.classList.remove("flex-column", "on-resize");
          }
          return elem.classList.remove("flex-column", "on-resize");
        });
        if (sidebarResponsive !== null) {
          if (
            sidebarResponsive.classList.contains("sidebar-mini") &&
            sidebarResponsive.classList.contains("on-resize")
          ) {
            sidebarResponsive.classList.remove("sidebar-mini", "on-resize");
          }
        }
      }
    });
  });
  const location = useLocation();

  useLayoutEffect(() => {
    // Check if the current path starts with '/dashboard'
    if (location.pathname.startsWith('/')) {
      if (isMobile) {
        minisidebar();
      }
    }
  }, [location.pathname, isMobile]);

  return (
    <Fragment>
      <aside
        className={` ${sidebarColor} ${sidebarType.join(" ")} ${sidebarMenuStyle} ${sidebarHide.join(" ") ? 'sidebar-none' : 'sidebar'}   sidebar-base  `}
        data-sidebar="responsive"
      >
        <div className="sidebar-header d-flex align-items-center justify-content-start">
          {!showLogo &&
            <Link to="/dashboard" className="navbar-brand text-center ms-2">
              {/* <Image src={minilogo} width={170}></Image> */}
            </Link>
          }
          {(isMobile && showLogo) &&
            <Link to="/dashboard" className="navbar-brand text-center ms-4">
              {/* <Image src={minilogo} width={120}></Image> */}
            </Link>
          }
          <div
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            onClick={minisidebar}
          >
            <i className="icon">
              <svg
                width="20"
                className="icon-20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.25 12.2744L19.25 12.2744"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </i>
          </div>
        </div>
        <div
          className="pt-0 sidebar-body data-scrollbar"
          data-scroll="1"
          id="my-scrollbar"
        >
          {/* sidebar-list class to be added after replace css */}
          <div className="sidebar-list navbar-collapse" id="sidebar">
            <VerticalNav />
          </div>
        </div>
        <div className="sidebar-footer"></div>
      </aside>
    </Fragment>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;
