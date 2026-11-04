import {createBrowserRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from './features/auth/components/Protected'
import GuestOnly from './features/auth/components/GuestOnly'
import Home from "./features/Interview/pages/Home"
import Interview from "./features/Interview/pages/interview";
import Reports from "./features/Interview/pages/Reports";
import About from "./features/Interview/pages/About";
export const router = createBrowserRouter([
    {
        path: '/login',
        element: <GuestOnly><Login /></GuestOnly>
    },
    {
        path: "/register",
        element: <GuestOnly><Register /></GuestOnly>
    },
    {
        path: '/',
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected> <Interview/> </Protected>
    },
    {
        path: "/reports",
        element: <Protected><Reports /></Protected>
    },
    {
        path: "/about",
        element: <Protected><About /></Protected>
    }
])
