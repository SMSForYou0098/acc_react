import React, { useEffect, memo, Fragment } from "react";

//BoxedRouter
import BoxedFancyRouter from "../../router/boxed-fancy-router";

//header
import HeaderStyle2 from "../../components/partials/dashboard/headerstyle/header-style-2";

//footer
import Footer from "../../components/partials/dashboard/footerstyle/footer";

//seetingoffCanvas
import SettingOffCanvas from "../../components/setting/SettingOffCanvas";

import Loader from "../../components/Loader";

const BoxedFancy = memo((props) => {
  useEffect(() => {
    document.body.classList.add("boxed-fancy");
    return () => {
      document.body.classList.remove("boxed-fancy");
    };
  });
  return (
    <Fragment>
      <div className="boxed-inner">
        <div id="loading">
          <Loader />
        </div>
        <span className="screen-darken"></span>
        <main className="main-content">
          <HeaderStyle2 />
          <div className="conatiner-fluid content-inner pb-0">
            <BoxedFancyRouter />
          </div>
          <Footer />
        </main>
      </div>
      <SettingOffCanvas />
    </Fragment>
  );
});

BoxedFancy.displayName = "BoxedFancy";
export default BoxedFancy;
