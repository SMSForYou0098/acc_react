import React, { useState, useContext, memo, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, useAccordionButton, AccordionContext, Tooltip, OverlayTrigger, } from "react-bootstrap";
import { DashboardIcon, EventIcon, RoleIcon, ScanIcon, SettingIcon, SmsIcon, SocialMediaIcon, UsersIcon, MailIcon } from "./NavIcons";
import { FaWhatsapp } from "react-icons/fa";
import { useMyContext } from "../../../../Context/MyContextProvider";
import SidebarMenu from "../../components/sidebar/sidebar-menu";

function CustomToggle({ children, eventKey, onClick }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(eventKey, (active) =>
    onClick({ state: !active, eventKey: eventKey })
  );

  const isCurrentEventKey = activeEventKey === eventKey;
  return (
    <Link
      to="#"
      aria-expanded={isCurrentEventKey ? "true" : "false"}
      className="nav-link"
      role="button"
      onClick={(e) => {
        decoratedOnClick(isCurrentEventKey);
      }}
    >
      {children}
    </Link>
  );
}

const VerticalNav = memo(() => {
  const { UserPermissions } = useMyContext()
  const [activeMenu, setActiveMenu] = useState(false);

  const [active, setActive] = useState("");

  const SubMenuArrow = () => (
    <svg
      className="icon-18"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7-7 7"
      />
    </svg>

  )


  let location = useLocation();

  const menuConfig = [
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
          // permission: "View Mail Config Setting",
          icon: <MailIcon />
        },
        {
          title: "SMS Gateway",
          path: "/dashboard/settings/sms-gateway",
          minititle: "SG",
          // permission: "View SMS Config Setting",
          icon: <SmsIcon />
        },
        {
          title: "Whatsapp Config",
          path: "/dashboard/settings/whatsapp-config",
          minititle: "WA",
          // permission: "View SMS Config Setting",
          icon: <FaWhatsapp size={18} />
        },
        {
          title: "Admin Settings",
          path: "/dashboard/settings/admin",
          // permission: "View Admin Setting",
          icon: <SettingIcon />,
        },
        {
          title: "Category & Zones",
          path: "/dashboard/settings/category",
          minititle: "CTG",
          // permission: "View Admin Setting",
          icon: <EventIcon />
        },
        {
          title: "Social Media",
          path: "/dashboard/settings/social-media",
          minititle: "SM",
          // permission: "View Admin Setting",
          icon: <SocialMediaIcon />
        },
      ],
    },
  ];

  return (
    <Fragment>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        {menuConfig.map((menu, index) => {
          const hasPermission = Array.isArray(menu.permission)
            ? menu.permission.some((perm) => UserPermissions?.includes(perm))
            : menu.permission
              ? UserPermissions?.includes(menu.permission)
              : true;

          if (!hasPermission) return null;

          return menu.isAccordion ? (
            <Accordion.Item
              as="li"
              key={index}
              eventKey={menu.eventKey}
              bsPrefix={`nav-item ${menu.subMenus.some(
                (subMenu) => location.pathname === subMenu.path
              ) ? "active" : ""}`}
              onClick={() => setActive(menu.eventKey)}
            >
              <CustomToggle eventKey={menu.eventKey}
                onClick={(e) => {
                  if (activeMenu !== menu.eventKey) {
                    setActiveMenu(menu.eventKey);
                  }
                }}
              >
                <OverlayTrigger placement="right" overlay={<Tooltip>{menu.title}</Tooltip>}>
                  <i className="icon">{menu?.icon}</i>
                </OverlayTrigger>
                <span className="item-name">{menu.title}</span>
                <i className="right-icon"><SubMenuArrow /></i>
              </CustomToggle>

              <Accordion.Collapse eventKey={menu.eventKey}>
                <ul className="sub-nav">
                  {menu.subMenus.map((subMenu, subIndex) => {
                    // Check if submenu should be shown (either no permission required or user has permission)
                    const hasSubMenuPermission = !subMenu.permission || UserPermissions?.includes(subMenu.permission);

                    return hasSubMenuPermission && (
                      <SidebarMenu
                        key={subIndex}
                        isTag="false"
                        staticIcon={!subMenu?.icon && "true"}
                        pathname={subMenu.path}
                        title={subMenu.title}
                        minititle={subMenu.minititle}
                      >
                        <i className="icon">{subMenu?.icon}</i>
                      </SidebarMenu>
                    );
                  })}
                </ul>
              </Accordion.Collapse>
            </Accordion.Item>
          ) : (
            <SidebarMenu
              key={index}
              isTag="true"
              pathname={menu.path}
              title={menu.title}
            >
              <i className="icon">{menu?.icon}</i>
            </SidebarMenu>
          );
        })}
      </Accordion>
    </Fragment>
  );

});

VerticalNav.displayName = "VerticalNav";
export default VerticalNav;
