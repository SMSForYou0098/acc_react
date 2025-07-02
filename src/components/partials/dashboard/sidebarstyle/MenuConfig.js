import React from 'react'
import { DashboardIcon, EventIcon, RoleIcon, ScanIcon, SettingIcon, SmsIcon, UsersIcon, MailIcon } from "./NavIcons";
import { FaWhatsapp } from "react-icons/fa";

export const menuConfig = [
    // Dashboard Menu
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      permission: "Dashboard",
    },

    // Users Menu (Accordion with Submenus)
    {
      title: "Users",
      icon: <UsersIcon />,
      permission: ["View User","View Company","View Organizer"],
      isAccordion: true,
      eventKey: "sidebar-user",
      subMenus: [
        {
          title: "User List",
          path: "/dashboard/users",
          permission: "View User",
          minititle: "UL",
        },
        {
          title: "Company List",
          path: "/dashboard/users/company",
          permission: "View Company",
          minititle: "UL",
        },
        {
          title: "Organizer List",
          path: "/dashboard/users/organizers",
          permission: "View Organizer",
          minititle: "UL",
        },
        {
          title: "Sub Organizer List",
          path: "/dashboard/users/sub-organizers",
          permission: "View Sub Organizer",
          minititle: "UL",
        },
      ],
    },
    // Scanner Accordion Menu
    {
      title: "Scan Ticket",
      permission: ["Scan By Camera", "Scan By Scanner"],
      isAccordion: true,
      icon: <ScanIcon />,
      eventKey: "Scanner",
      subMenus: [
        {
          title: "Scan by Scanner",
          path: "/dashboard/scan/scanner",
          permission: "Scan By Scanner"
        },
        {
          title: "Scan by Camera",
          path: "/dashboard/scan/camera",
          permission: "Scan By Camera"
        },
      ],
    },

    // Roles Menu
    {
      title: "Roles",
      path: "/dashboard/roles",
      permission: "View Role",
      icon: <RoleIcon />,
    },
    // Setting Accordion Menu
    {
      title: "Settings",
      permission: ['View Admin Setting'],
      isAccordion: true,
      icon: <SettingIcon />,
      eventKey: "sidebar-settings",
      subMenus: [
        {
          title: "Mail Configuration",
          path: "/dashboard/settings/mail",
          minititle: "MC",
          permission: "View Mail Config Setting",
          icon: <MailIcon />
        },
        {
          title: "SMS Gateway",
          path: "/dashboard/settings/sms-gateway",
          minititle: "SG",
          permission: "View SMS Config Setting",
          icon: <SmsIcon />
        },
        {
          title: "Whatsapp Config",
          path: "/dashboard/settings/whatsapp-config",
          minititle: "WA",
          permission: "View Whatsapp Config Setting",
          icon: <FaWhatsapp size={18} />
        },
        {
          title: "Admin Settings",
          path: "/dashboard/settings/admin",
          permission: "View Admin Setting",
          icon: <SettingIcon />,
        },
        {
          title: "Category & Zones",
          path: "/dashboard/settings/category",
          minititle: "CTG",
          permission: "View Zones & Category",
          icon: <EventIcon />
        },
      ],
    },
  ];
