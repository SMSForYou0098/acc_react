import React, { useState, memo, Fragment } from "react";

//React-bootstrap
import { Offcanvas } from "react-bootstrap";

//React-router
import { Link } from "react-router-dom";

//Img
import image1 from "../../../assets/images/brands/08.png";
import image2 from "../../../assets/images/brands/09.png";
import image3 from "../../../assets/images/brands/10.png";
import image4 from "../../../assets/images/brands/11.png";
import image5 from "../../../assets/images/brands/13.png";
import image6 from "../../../assets/images/brands/12.png";
import { Share2Icon } from "lucide-react";

const ShareOffcanvas = memo((props) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <Fragment>
      {props.share && (
        <Link
          to="#"
          className=" text-body d-flex align-items-center gap-2"
          onClick={handleShow}
        >
          <span className="text-primary d-flex gap-2 align-items-center">
            <Share2Icon size={16}/>
            Share
          </span>
        </Link>
      )}
      <Offcanvas show={show} onHide={handleClose} placement="bottom">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Share</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex flex-wrap align-items-center">
            <div className="text-center me-3 mb-3">
              <img
                src={image1}
                className="img-fluid rounded mb-2"
                alt=""
                loading="lazy"
              />
              <h6>Facebook</h6>
            </div>
            <div className="text-center me-3 mb-3">
              <img
                src={image2}
                className="img-fluid rounded mb-2"
                alt=""
                loading="lazy"
              />
              <h6>Twitter</h6>
            </div>
            <div className="text-center me-3 mb-3">
              <img
                src={image3}
                className="img-fluid rounded mb-2"
                alt=""
                loading="lazy"
              />
              <h6>Instagram</h6>
            </div>
            <div className="text-center me-3 mb-3">
              <img
                src={image4}
                className="img-fluid rounded mb-2"
                alt=""
                loading="lazy"
              />
              <h6>Google Plus</h6>
            </div>
            <div className="text-center me-3 mb-3">
              <img
                src={image5}
                className="img-fluid rounded mb-2"
                alt=""
                loading="lazy"
              />
              <h6>In</h6>
            </div>
            <div className="text-center me-3 mb-3">
              <img src={image6} className="img-fluid rounded mb-2" alt="" />
              <h6>YouTube</h6>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
});
ShareOffcanvas.displayName = "ShareOffcanvas";
export default ShareOffcanvas;
