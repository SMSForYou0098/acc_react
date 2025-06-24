import React, { memo } from "react";
import TicketVerification from "./TicketVerification";

const Camera = memo(() => {

    return (
        <TicketVerification
            scanMode="camera"
        />
    );
});
Camera.displayName = "Camera";
export default Camera;
