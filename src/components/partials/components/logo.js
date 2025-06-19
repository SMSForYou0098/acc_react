import React, { memo, Fragment } from "react";
import { Image } from "react-bootstrap";
import favicon from '../../../assets/event/stock/favicon.ico';
const Logo = memo((props) => {
  return (
    <Fragment>
      <div className="logo-main">
        <div className="logo-normal">
        <Image src={'https://getyourticket.in/wp-content/uploads/2024/07/gyt-300x133.png'} alt="logo" loading="lazy" width={120}/>
        </div>
        {/* <div className="logo-mini">
        <Image src={favicon} alt="logo" loading="lazy" width={120}/>
        </div> */}
      </div>
    </Fragment>
  );
});

Logo.displayName = "Logo";
export default Logo;
