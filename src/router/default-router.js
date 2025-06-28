import React from "react";
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



export const DefaultRouter = [
  {
    path: "/",
    element: <Default />,
    children: [
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
            path: "users/",
            name: 'User List',
            active: 'pages',
            subActive: 'User',
            children: [
              {
                path: "",
                element: <Users type={'user'}/>,
                name: 'User List',
                active: 'pages',
                subActive: 'User'
              },
              {
                path: "company",
                element: <Users type={'company'} />,
                name: 'Company List',
                active: 'pages',
                subActive: 'Company'
              },
              {
                path: "organizers",
                element: <Users type={'organizer'} />,
                name: 'Organizer List',
                active: 'pages',
                subActive: 'Organizer'
              },
              {
                path: "manage/:id",
                element: <NewUser />,
                name: 'Manage User',
                active: 'pages',
                subActive: 'User'
              },
              {
                path: "new",
                element: <NewUser />,
                name: 'New User',
                active: 'pages',
                subActive: 'User'
              }
            ]
          },
          {
            path: 'scan/',
            name: 'Scan',
            children: [
              {
                path: "scanner",
                element: <Scanner />,
                name: 'Scanner',
                subActive: 'scanner'
              },
              {
                path: "camera",
                element: <Camera />,
                name: 'Camera',
                subActive: 'camera'
              },
            ]
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
            path: "user",
            // element: <NewUserWizard />,
            element: <UserPage />,
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
