import React from "react";

// auth
import ConfirmMail from "../views/dashboard/auth/confirm-mail";
import LockScreen from "../views/dashboard/auth/lock-screen";
import Recoverpw from "../views/dashboard/auth/recoverpw";
import SignIn from "../views/dashboard/auth/sign-in";
import SignUp from "../views/dashboard/auth/sign-up";
// errors
import Error404 from "../views/dashboard/errors/error404";
import Error500 from "../views/dashboard/errors/error500";
import Maintenance from "../views/dashboard/errors/maintenance";
import Simple from "../views/modules/auth/layouts/simple";


export const SimpleRouter = [
  {
    path: "",
    element: <Simple />,
    // element: <Home />,
    children: [
      {
        path: "default/auth/sign-in",
        element: <SignIn />,
      },
      {
        path: "default/auth/sign-up",
        element: <SignUp />,
      },

      {
        path: "default/auth/confirm-mail",
        element: <ConfirmMail />,
      },
      {
        path: "default/auth/lock-screen",
        element: <LockScreen />,
      },
      {
        path: "default/auth/recoverpw",
        element: <Recoverpw />,
      },
      {
        path: "errors/error404",
        element: <Error404 />,
      },
      // Utilities
      {
        path: "errors/error500",
        element: <Error500 />,
      },
      {
        path: "errors/maintenance",
        element: <Maintenance />,
      },
    ],
  },
];
