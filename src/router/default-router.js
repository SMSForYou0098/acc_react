import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Default from "../layouts/dashboard/default";
import Users from "../views/modules/Event/User/Users";
import MailSetting from "../views/modules/Event/AdminSetting/MailSetting";
import PaymentGateway from "../views/modules/Event/AdminSetting/PaymentGateway/PaymentGateway";
import SmsSetting from "../views/modules/Event/AdminSetting/SmsSetting";
import AdminSetting from "../views/modules/Event/AdminSetting/AdminSetting";
import NewUser from "../views/modules/Event/User/NewUser";
import HomeSetting from "../views/modules/Event/AdminSetting/HomeSetting";
import Roles from "../views/modules/Event/RolePermission/Roles";
import RolePermission from "../views/modules/Event/RolePermission/RolePermission";
import WhatsAppConfig from "../views/modules/Event/AdminSetting/WhatsAppConfig";
import CombinedView from "../views/modules/Event/CombinedView";
import Scanner from "../views/modules/Event/Scanner/Scanner";
import Camera from "../views/modules/Event/Scanner/Camera";
import UserPage from "../views/modules/Event/User/UserPage";


import { useMyContext } from "../Context/MyContextProvider";

const RoleBasedRedirect = ({ children, allowedPaths = [] }) => {
  const { userRole } = useMyContext();
  const currentPath = window.location.pathname;

  const normalizedRole = userRole?.toLowerCase();
  const isAllowed = allowedPaths.some(path => currentPath.startsWith(path));

  if (normalizedRole === "user" && !isAllowed) {
    return <Navigate to="/user-profile" replace />;
  }

  return children;
};

export default RoleBasedRedirect;

export const DefaultRouter = [
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "dashboard/",
        element: (
          <RoleBasedRedirect allowedPaths={[
            "/dashboard/users/new",
            "/dashboard/users/manage/",
            "/dashboard/user"
          ]}>
            <Outlet />
          </RoleBasedRedirect>
        ),
        children: [

          {
            index: true,
            element: <Navigate to="/dashboard/" replace />
          },

          {
            path: "roles/",
            children: [
              {
                path: "",
                element: (
                  <RoleBasedRedirect>
                    <Roles />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "assign-permission/:id",
                element: (
                  <RoleBasedRedirect>
                    <RolePermission />
                  </RoleBasedRedirect>
                )
              }
            ]
          },

          {
            path: "users/",
            children: [
              {
                path: "",
                element: (
                  <RoleBasedRedirect>
                    <Users type="user" />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "company",
                element: (
                  <RoleBasedRedirect>
                    <Users type="company" />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "organizers",
                element: (
                  <RoleBasedRedirect>
                    <Users type="organizer" />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "sub-organizers",
                element: (
                  <RoleBasedRedirect>
                    <Users type="sub-organizer" />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "manage/:id",
                element: <NewUser /> // allowed for 'User'
              },
              {
                path: "new",
                element: <NewUser /> // allowed for 'User'
              }
            ]
          },
          {
            path: "scan/",
            children: [
              {
                path: "scanner",
                element: (
                  <RoleBasedRedirect>
                    <Scanner />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "camera",
                element: (
                  <RoleBasedRedirect>
                    <Camera />
                  </RoleBasedRedirect>
                )
              }
            ]
          },

          {
            path: "users/new",
            element: <NewUser />
          },

          {
            path: "settings/",
            children: [
              {
                path: "admin",
                element: (
                  <RoleBasedRedirect>
                    <AdminSetting />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "home-setting",
                element: (
                  <RoleBasedRedirect>
                    <HomeSetting />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "category",
                element: (
                  <RoleBasedRedirect>
                    <CombinedView />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "mail",
                element: (
                  <RoleBasedRedirect>
                    <MailSetting />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "payment-gateway",
                element: (
                  <RoleBasedRedirect>
                    <PaymentGateway />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "sms-gateway",
                element: (
                  <RoleBasedRedirect>
                    <SmsSetting />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "whatsapp-config",
                element: (
                  <RoleBasedRedirect>
                    <WhatsAppConfig />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "otp",
                element: (
                  <RoleBasedRedirect>
                    <AdminSetting />
                  </RoleBasedRedirect>
                )
              },
              {
                path: "social-media",
                element: (
                  <RoleBasedRedirect>
                    <AdminSetting />
                  </RoleBasedRedirect>
                )
              }
            ]
          }
        ]
      },
      {
        path: "user-profile",
        element: <UserPage />
      },
    ]
  }
];
