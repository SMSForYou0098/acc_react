import React from "react";
import Default from "../layouts/dashboard/default";
import Users from "../views/modules/Event/User/Users";
import ManageUser from "../views/modules/Event/User/ManageUser";
import MailSetting from "../views/modules/Event/AdminSetting/MailSetting";
import PaymentGateway from "../views/modules/Event/AdminSetting/PaymentGateway/PaymentGateway";
import SmsSetting from "../views/modules/Event/AdminSetting/SmsSetting";
import AdminSetting from "../views/modules/Event/AdminSetting/AdminSetting";
import NewUser from "../views/modules/Event/User/NewUser";
import HomeSetting from "../views/modules/Event/AdminSetting/HomeSetting";

import Roles from "../views/modules/Event/RolePermission/Roles";
import RolePermission from "../views/modules/Event/RolePermission/RolePermission";
import Category from "../views/modules/Event/Category/Category";
import WhatsAppConfig from "../views/modules/Event/AdminSetting/WhatsAppConfig";
import CombinedView from "../views/modules/Event/CombinedView";



export const DefaultRouter = [
  {
    path: "/",
    element: <Default />,
    // element: <Home />,
    children: [
      //custom 
      // {
      //   path: "events/:id/process",
      //   element: <NewChekout />,
      //   name: 'process',
      //   active: 'process'
      // },
      {
        path: "dashboard/",
        name: 'home',
        active: 'home',
        children: [
          {
            path: 'roles/',
            name: 'roles',
            children: [
              {
                path: "",
                element: <Roles />,
                name: 'roles',
                active: 'roles'
              },
              {
                path: "assign-permission/:id",
                element: <RolePermission />,
                name: 'Permission',
                active: 'Permission'
              },
            ]
          },
          {
            path: "users",
            element: <Users />,
            name: 'User List',
            active: 'pages',
            subActive: 'User'
          },
          {
            path: "users/manage/:id",
            element: <ManageUser />,
            name: 'User List',
            active: 'pages',
            subActive: 'User'
          },
          {
            path: "users/new",
            // element: <NewUserWizard />,
            element: <NewUser />,
            name: 'User List',
            active: 'pages',
            subActive: 'User'
          },
          {
            path: "settings/",
            active: 'settings',
            // element: <Setting />,
            children: [
              {
                path: "admin",
                element: <AdminSetting />,
                name: 'Admin',
                subActive: 'Admin'
              },
              {
                path: "home-setting",
                element: <HomeSetting />,
                name: 'home-setting',
                subActive: 'home-setting'
              },
              {
                path: "category",
                element: <CombinedView />,
                name: 'category',
                subActive: 'category'
              },
              {
                path: "mail",
                element: <MailSetting />,
                name: 'Mail',
                subActive: 'Mail'
              },
              {
                path: "payment-gateway",
                element: <PaymentGateway />,
                name: 'Payment',
                subActive: 'Payment'
              },
              {
                path: "sms-gateway",
                element: <SmsSetting />,
                name: 'SMS',
                subActive: 'SMS'
              },
              {
                path: "whatsapp-config",
                element: <WhatsAppConfig />,
                name: 'whatsapp',
                subActive: 'whatsapp'
              },
              {
                path: "otp",
                element: <AdminSetting />,
                name: 'OTP',
                subActive: 'OTP'
              },
              {
                path: "social-media",
                element: <AdminSetting />,
                name: 'Social Media',
                subActive: 'social-media'
              },
            ]

          },
        ]
      },
    ],
  },
];
