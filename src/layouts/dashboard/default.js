import React, { memo, Fragment, useLayoutEffect } from "react";
import { useLocation, Outlet, Navigate } from "react-router-dom";
import { ShepherdTour } from "react-shepherd";
import Headerpro from "../../components/partials/pro/headerstyle/header-pro";
import Sidebar from "../../components/partials/dashboard/sidebarstyle/sidebar";
import Footer from "../../components/partials/dashboard/footerstyle/footer";
import Loader from "../../components/Loader";
import * as SettingSelector from "../../store/setting/selectors";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import { useMyContext } from "../../Context/MyContextProvider";
const Default = memo((props) => {
  const { userRole,isMobile } = useMyContext()
  let location = useLocation();
  const pageLayout = useSelector(SettingSelector.page_layout);
  const appName = useSelector(SettingSelector.app_name);

  var subHeader = "";
  var commanclass = "";
  switch (location.pathname) {
    case "/dashboard/special-pages/calender":
    case "/dashboard/special-pages/billing":
    case "/dashboard/special-pages/kanban":
    case "/dashboard/special-pages/pricing":
    case "/dashboard/special-pages/timeline":
    case "/dashboard/app/user-profile":
    case "/dashboard/app/user-add":
    case "/plugins/ui-color":
    case "/dashboard/widget/widgetbasic":
    case "/dashboard/widget/widgetchart":
    case "/dashboard/widget/widgetcard":
    case "/dashboard/map/google":
    case "/dashboard/form/form-element":
    case "/dashboard/form/form-wizard":
    case "/dashboard/form/form-validation":
    case "/dashboard/table/table-data":
    case "/dashboard/table/bootstrap-table":
    case "/dashboard/table/border-table":
    case "/dashboard/table/fancy-table":
    case "/dashboard/table/fixed-table":
    case "/dashboard/app/user-list":
    case "/dashboard/icon/solid":
    case "/dashboard/icon/outline":
    case "/dashboard/icon/dual-tone":
    case "/dashboard/blank-page":
    case "/dashboard/admin/admin":
      commanclass = "iq-banner default";
      break;
    default:
      break;
  }
  const minisidebar = () => {
    const aside = document.getElementsByTagName("ASIDE")[0];
    if (aside) {
      aside.classList.toggle("sidebar-mini");
    }
  };
  
  useLayoutEffect(() => {
    if (isMobile) {
      minisidebar(); 
    }
  }, []);

  const data = useSelector((state) => state.auth?.user);
  const DataLength = (data && Object.keys(data)?.length) || 0;
  if (DataLength <= 0) {
    return <Navigate to={'/sign-in'} />
  }

  return (
    <Fragment>
        <Loader />
        {userRole !== 'User'  &&
          <Sidebar app_name={appName} />
        }
        {/* <Tour /> */}
        <main className="main-content">
          <div className={`${commanclass} position-relative `}>
            <Headerpro />
            {subHeader}
          </div>
          <div className={` ${pageLayout} content-inner pb-0`}>
            <Suspense fallback={<div className="react-load"></div>}>
              <Outlet></Outlet>
            </Suspense>
          </div>
          <Footer />
        </main>
    </Fragment>
  );
});

Default.displayName = "Default";
export default Default;