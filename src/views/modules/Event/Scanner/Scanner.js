import React, { memo } from "react";
import TicketVerification from "./TicketVerification";
const Scanner = memo(() => {
    return (
        <TicketVerification
            scanMode="manual"
        />
    );
});
Scanner.displayName = "Scanner";
export default Scanner;
