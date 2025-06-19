import React, { memo, Fragment, useEffect } from "react";

// react-router
import { Outlet } from "react-router-dom";

// headers

// footers
import Footer from "../../../modules/landing-pages/components/partials/footer/footer";
import Footer1 from "../../../modules/landing-pages/components/partials/footer/footer-one";

// scss
import { Button } from "react-bootstrap";
import Header2 from "../CustomComponents/header-2";

const DefaultLayout = memo((props) => {
  useEffect(() => {
    const backToTop = document.getElementById("back-to-top");
    if (backToTop !== null && backToTop !== undefined) {
      document
        .getElementById("back-to-top")
        .classList.add("animate__animated", "animate__fadeOut");
      window.addEventListener("scroll", (e) => {
        if (document.documentElement.scrollTop > 250) {
          document
            .getElementById("back-to-top")
            .classList.remove("animate__fadeOut");
          document
            .getElementById("back-to-top")
            .classList.add("animate__fadeIn");
        } else {
          document
            .getElementById("back-to-top")
            .classList.remove("animate__fadeIn");
          document
            .getElementById("back-to-top")
            .classList.add("animate__fadeOut");
        }
      });
    }
    document.body.classList.add("landing-pages");
    document.documentElement.classList.add("landing-pages");
    document.body.classList.add("body-bg");
    return () => {
      document.body.classList.remove("landing-pages");
      document.documentElement.classList.remove("landing-pages");
      document.body.classList.remove("body-bg");
    };
  });

  return (
    <Fragment>
      <main className="main-content">
        <div className="position-relative">
          {/* <!--Nav Start--> */}
          {/* <Header2 /> */}
          {/* <!--Nav End--> */}
        </div>
        <Outlet />
      </main>
      {/* <!--Nav Start--> */}
      {props.footer1 ? <Footer1 /> : <Footer />}
      {/* <!--Nav End--> */}

      <a
        className="btn btn-primary  btn-landing"
        href="/dashboard"
        
      > 
        Dashboard Demo
      </a>
      {/* {{!-- Back-To-Top --}} */}
      <div id="back-to-top" style={{ display: "none" }}>
        <Button size="xs" variant="primary  p-0 position-fixed top" href="#top">
          <svg
            className="icon-30"
            width="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 15.5L12 8.5L19 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Button>
      </div>
      {/* {{!-- Back-To-end --}} */}
    </Fragment>
  );
});

DefaultLayout.displayName = "DefaultLayout";
export default DefaultLayout;
