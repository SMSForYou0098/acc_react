import React, { memo, Fragment, useState, useEffect } from "react";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Import selectors & action from setting store
import * as SettingSelector from "../../../../store/setting/selectors";

//React-router
import { Link } from "react-router-dom";
const Footer = memo(() => {
  const [date, setDate] = useState();
  const getYear = () => setDate(new Date().getFullYear());
  useEffect(() => {
    getYear();
  }, []);
  const footer = useSelector(SettingSelector.footer);
  return (
    <Fragment>
      <footer className={`footer ${footer}`}>
        <div className="footer-body">
          <ul className="left-panel list-inline mb-0 p-0">
            <li className="list-inline-item">
              <Link to="privacy-policy">Privacy Policy</Link>
            </li>{" "}
            {/* <li className="list-inline-item">
              <Link to="/dashboard/extra/terms-of-service">Terms of Use</Link>
            </li> */}
          </ul>
          <div className="right-panel">
            <p className="mb-0">©{date} All Rights Reserved | <a className="fw-bold" target="__blank" href="https://getyourticket.in/">Get Your Ticket</a>.</p>
          </div>
        </div>
      </footer>
    </Fragment>
  );
});

Footer.displayName = "Footer";
export default Footer;
