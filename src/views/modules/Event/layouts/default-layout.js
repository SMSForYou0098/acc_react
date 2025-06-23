import React, { memo, Fragment, useEffect, useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { ChevronUp } from "lucide-react";
import styled from 'styled-components';
import ShowWelcomeModal from "../components/WelcomeModal";

const StyledWrapper = styled.div`
  .site-wrapper {
    position: relative;
  }

  .header-wrapper {
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .main-content {
    // padding-top: var(--header-height, 80px); /* Adjust this value based on your header height */
  }

  .content-wrapper {
    width: 100%;
  }
`;

const DefaultLayout = memo((props) => {
  const { isMobile,hideMobileMenu } = useMyContext();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        const isHome = location.pathname === '/' || location.pathname === '/home';
        const extraPadding = (!isHome && !isMobile) ? 28 : 0;
        document.documentElement.style.setProperty('--header-height', `${height + extraPadding}px`);
      }
    };
    updateHeaderHeight();
    const handleScroll = () => {
      if (document.documentElement.scrollTop > 250) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    document.body.classList.add('landing-pages');
    document.documentElement.classList.add('landing-pages');
    document.body.classList.add('body-bg');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('landing-pages');
      document.documentElement.classList.remove('landing-pages');
      document.body.classList.remove('body-bg');
    };
  }, [location,isMobile]);
  return (
    <StyledWrapper>
      <Fragment>
        <div className="site-wrapper">
          <div ref={headerRef} className="header-wrapper position-fixed w-100 top-0" style={{ zIndex: '999' }}>
            {/* {!isMobile && <Header2 />} */}
          </div>
          <main className="main-content">
            <div className="content-wrapper">
              <Outlet />
            </div>
          </main>
          {showBackToTop && (
            <div id="back-to-top">
              <Button size="xs" variant="secondary p-0 position-fixed top" href="#top" style={{ bottom: '6rem' }}>
                <ChevronUp size={34} />
              </Button>
            </div>
          )}
          <ShowWelcomeModal />
        </div>
      </Fragment>
    </StyledWrapper>
  );
});

DefaultLayout.displayName = "DefaultLayout";
export default DefaultLayout;
