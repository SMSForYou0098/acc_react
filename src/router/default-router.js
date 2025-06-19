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
          // {
          //   path: "",
          //   element: <Index />,
          //   name: 'dashboard',
          //   active: 'home'
          // },
          // {
          //   path: "attendees",
          //   element: <Attendees />,
          //   name: 'attendees',
          //   active: 'home'
          // },
          // {
          //   path: "payment-log",
          //   element: <PaymentLogs />,
          //   name: 'payment-log',
          //   active: 'home'
          // },
          // {
          //   path: "live-users",
          //   element: <LiveUsers />,
          //   name: 'live-users',
          //   active: 'home'
          // },
          // {
          //   path: "wallet-agent",
          //   element: <AsignBalance />,
          //   name: 'wallet-agent',
          //   active: 'home'
          // },
          // {
          //   path: "user-transactions",
          //   element: <Transactions />,
          //   name: 'user-transactions',
          //   active: 'home'
          // },
          // {
          //   path: "tax",
          //   element: <Tax />,
          //   name: 'tax',
          //   active: 'home'
          // },
          // {
          //   path: "exhibition/",
          //   element: <ExhibitionBookings />,
          //   name: 'exhibition',
          //   active: 'home',
          // },
          // {
          //   path: "exhibition/",
          //   active: 'home',
          //   children: [
          //     {
          //       path: "new",
          //       element: <NewExhibition />,
          //       name: 'new exhibition',
          //       active: 'Exhibition'
          //     },
          //   ]
          // },
          // {
          //   path: "bookings-admin",
          //   element: <AdminBookings />,
          //   name: 'bookings-admin',
          //   active: 'home'
          // },
          // {
          //   path: "amusement/",
          //   name: 'amusement',
          //   active: 'amusement',
          //   children: [
          //     {
          //       path: "online-bookings",
          //       element: <AmusementBookings />,
          //       name: 'amusement-online-bookings',
          //       active: 'home'
          //     },
          //     {
          //       path: "agent-bookings",
          //       element: <AmuseAgent />,
          //       name: 'amusement-agent-bookings',
          //       active: 'home'
          //     },
          //     {
          //       path: "pos-bookings",
          //       element: <AmusePOS />,
          //       name: 'amusement-pos-bookings',
          //       active: 'home'
          //     }
          //   ]
          // },
          // {
          //   path: "pending-bookings",
          //   element: <PendingBookings />,
          //   name: 'pending-bookings',
          //   active: 'home'
          // },
          // {
          //   path: "complimentary-bookings",
          //   element: <CbList />,
          //   name: 'bookings-admin',
          //   active: 'home'
          // },
          // {
          //   path: "complimentary-bookings/new",
          //   element: <ComplimentaryBookings />,
          //   name: 'bookings-admin',
          //   active: 'home'
          // },
          // {
          //   path: "events/",
          //   element: <Events />,
          //   name: 'alternate dashboard',
          //   active: 'events',
          // },
          // {
          //   path: "events/",
          //   active: 'events',
          //   children: [
          //     {
          //       path: "new",
          //       element: <MakeEvent />,
          //       name: 'new events',
          //       active: 'events'
          //     },
          //     {
          //       path: "edit/:id",
          //       element: <EditEvent />,
          //       name: 'edit events',
          //       active: 'events'
          //     },
          //     {
          //       path: "new/detail-info",
          //       element: <AddEvent />,
          //       name: 'new events',
          //       active: 'events'
          //     },
          //     {
          //       path: "ticket/:id/:name",
          //       element: <TicketComponent />,
          //       name: 'event ticket',
          //       active: 'events'
          //     },
          //   ]
          // },
          // {
          //   path: 'bookings',
          //   element: <Bookings />,
          //   name: 'bookings'
          // },
          // {
          //   path: 'pos-bookings',
          //   element: <PosBooking />,
          //   name: 'Pos Bookings'
          // },
          // {
          //   path: 'agent-bookings',
          //   element: <AgentBooking />,
          //   name: 'agent-bookings'
          // },
          // {
          //   path: 'agent-bookings/new',
          //   element: <Agent />,
          //   name: 'agent-bookings'
          // },
          // {
          //   path: "sponsor-bookings",
          //   element: <AgentBooking isSponser={true}/>,
          //   name: 'amusement-agent-bookings',
          //   active: 'home'
          // },
          // {
          //   path: 'sponsor-bookings/new',
          //   element: <Agent isSponser={true}/>,
          //   name: 'agent-bookings'
          // },
          // {
          //   path: "accreditation-bookings",
          //   element: <AgentBooking isAccreditation={true}/>,
          //   name: 'amusement-agent-bookings',
          //   active: 'home'
          // },
          // {
          //   path: "box-office",
          //   element: <BoxOffice/>,
          //   name: 'amusement-agent-bookings',
          //   active: 'home'
          // },
          // {
          //   path: 'accreditation-bookings/new',
          //   element: <Agent isAccreditation={true}/>,
          //   name: 'agent-bookings'
          // },
          // {
          //   path: 'user-inquiry',
          //   element: <UserQueries/>,
          //   name: 'agent-bookings'
          // },

          // {
          //   path: 'scan/',
          //   // element: <Scanner />,
          //   name: 'Scan',
          //   children: [
          //     {
          //       path: "scanner",
          //       element: <Scanner />,
          //       name: 'Scanner',
          //       subActive: 'scanner'
          //     },
          //     {
          //       path: "camera",
          //       element: <Camera />,
          //       name: 'Camera',
          //       subActive: 'camera'
          //     }
          //   ]
          // },
          // {
          //   path: 'pos',
          //   element: <POS />,
          //   name: 'POS'
          // },
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
          // {
          //   path: 'promo-code',
          //   name: 'Promo Code',
          //   element: <Promocode />,
          // },
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
              // {
              //   path: "pages",
              //   element: <Pages />,
              //   name: 'pages',
              //   subActive: 'pages'
              // },
              {
                path: "category",
                element: <Category />,
                name: 'category',
                subActive: 'category'
              },
              // {
              //   path: "attendee-fields",
              //   element: <AttendeeFields />,
              //   name: 'attendee-fields',
              //   subActive: 'attendee-fields'
              // },
              // {
              //   path: "nav-menu",
              //   element: <MenuGroups />,
              //   name: 'pages',
              //   subActive: 'pages'
              // },
              // {
              //   path: "pages",
              //   element: <Builder />,
              //   name: 'pages',
              //   subActive: 'pages'
              // },
              // {
              //   path: "artist",
              //   element: <ArtistComponent />,
              //   name: 'artist',
              //   subActive: 'pages'
              // },
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
              // {
              //   path: "footer/",
              //   name: 'footer',
              //   subActive: 'footer',
              //   children: [
              //     {
              //       path: "",
              //       element: <FooterGroups />,
              //       name: 'Menus',
              //       subActive: 'menus'
              //     },
              //     {
              //       path: "menus/:id/:name",
              //       element: <FooterMenus />,
              //       name: 'Menus',
              //       subActive: 'menus'
              //     }
              //   ]
              // },
              {
                path: "social-media",
                element: <AdminSetting />,
                name: 'Social Media',
                subActive: 'social-media'
              },
            ]

          },
          // {
          //   path: "reports/",
          //   active: 'reports',
          //   // element: <Setting />,
          //   children: [
          //     {
          //       path: "event-report",
          //       element: <EventReports />,
          //       name: 'Admin',
          //       subActive: 'event-report'
          //     },
          //     {
          //       path: "agent-report",
          //       element: <AgentReports />,
          //       name: 'Admin',
          //       subActive: 'agent-report'
          //     },
          //     {
          //       path: "pos-report",
          //       element: <PosReports />,
          //       name: 'Admin',
          //       subActive: 'pos-report'
          //     },
          //     {
          //       path: "online-report",
          //       element: <OnlineReport />,
          //       name: 'Admin',
          //       subActive: 'online-report'
          //     },
          //   ]

          // },
        ]
      },
    ],
  },
];
