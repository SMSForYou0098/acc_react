import React, { memo, Fragment } from "react";

//headerstyle1
import HeaderStyle1 from "../../components/partials/dashboard/headerstyle/header-style-1";

//footer
import Footer from "../../components/partials/dashboard/footerstyle/footer";

//default
import HorizontalRouter from "../../router/horizontal-router";

//seetingoffCanvas
import SettingOffCanvas from "../../components/setting/SettingOffCanvas";

const Horizontal = memo((props) => {
  return (
    <Fragment>
      <main className="main-content">
        <HeaderStyle1 />
        <div className="conatiner-fluid content-inner pb-0">
          <HorizontalRouter />
        </div>
        <Footer />
      </main>
      <SettingOffCanvas />
    </Fragment>
  );
});

Horizontal.displayName = "Horizontal";
export default Horizontal;
