import React, { useState, useContext, memo, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, useAccordionButton, AccordionContext, Tooltip, OverlayTrigger, } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import SidebarMenu from "../../components/sidebar/sidebar-menu";
import { menuConfig } from "./MenuConfig";

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
