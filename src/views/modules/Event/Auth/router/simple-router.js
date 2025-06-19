import Signin from "../pages/sign-in";
import SignUp from "../pages/sign-up";
import Twofactor from "../pages/two-factor";
import VerifyPassword from "../pages/VerifyPassword";

export const CustomAuthRouter = [
    // Animated
    {
        path: '/',
        // element: <Simple />,
        children: [
            {
                path: 'sign-in',
                element: <Signin />
            },
            {
                path: 'verify-password',
                element: <VerifyPassword />
            },
            {
                path: 'sign-up',
                element: <SignUp />
            },
            {
                path: 'two-factor',
                element: <Twofactor />
            },
        ]
    }

]

// is this the router you created>??
// yes
//Event is my main directory
//everything i made i put in event folder