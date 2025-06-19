import React, { useEffect, memo, Fragment } from "react";

//HorizontalMulti2Router
import HorizontalMulti2Router from "../../router/horizontal-multi-2-router";

//herder
import HeaderStyle4 from "../../components/partials/dashboard/headerstyle/header-style-4";

//footer
import Footer from "../../components/partials/dashboard/footerstyle/footer";

//seetingoffCanvas
import SettingOffCanvas from "../../components/setting/SettingOffCanvas";

const DualCompact = memo((props) => {
  useEffect(() => {
    document.body.classList.add("dual-compact");
    return () => {
      document.body.classList.remove("dual-compact");
    };
  });

  return (
    <Fragment>
      <span className="screen-darken"></span>
      <main className="main-content">
        <HeaderStyle4 />
        <div className="conatiner-fluid content-inner pb-0">
          <HorizontalMulti2Router />
        </div>
        <Footer />
      </main>
      <SettingOffCanvas />
    </Fragment>
  );
});

DualCompact.displayName = "DualCompact";
export default DualCompact;
