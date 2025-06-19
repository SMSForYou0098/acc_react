import React, { useEffect, memo, Fragment } from "react";

//BoxedRouter
import BoxedRouter from "../../router/boxed-router";

//header
import HeaderStyle2 from "../../components/partials/dashboard/headerstyle/header-style-2";

//footer
import Footer from "../../components/partials/dashboard/footerstyle/footer";

//seetingoffCanvas
import SettingOffCanvas from "../../components/setting/SettingOffCanvas";

const Boxed = memo((props) => {
  useEffect(() => {
    document.body.classList.add("boxed");
    return () => {
      document.body.classList.remove("boxed");
    };
  });
  return (
    <Fragment>
      <div className="boxed-inner">
        <span className="screen-darken"></span>
        <main className="main-content">
          <HeaderStyle2 />
          <div className="content-inner pb-0 container-fluid">
            <BoxedRouter />
          </div>
          <Footer />
        </main>
      </div>
      <SettingOffCanvas />
    </Fragment>
  );
});

Boxed.displayName = "Boxed";
export default Boxed;