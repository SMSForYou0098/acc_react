// import Events from "../../Event/LandingPages/Events";
// import EventDetail from "../../Event/Events/LandingEvents/ProductDetail";
// import Home from "../../Event/Home/Home";
// import PageIndex from "../../Event/Pages/Index";
import DefaultLayout from "../layouts/default-layout";
// import MenuPage from "../Pages/MenuPages";
// import ContactUs from "../Pages/ContactUs";

export const LandingModulesRouter = [
  {
    path: "",
    element: <DefaultLayout header2="true" />,
    children: [
      // {
      //   path: "home",
      //   element: <Home />,
      // },
      // {
      //   path: "home/home",
      //   element: <Home />,
      // },
      // {
      //   path: "home/Contact-Us",
      //   element: <ContactUs />,
      // },
      // {
      //   path: "home/:name",
      //   element: <MenuPage />,
      // },
      // {
      //   path: "pages/Contact-Us",
      //   element: <ContactUs />,
      // },
      // {
      //   path: "pages/:name",
      //   element: <PageIndex />,
      // },
      // {
      //   path: "events/",
      //   element: <Events />,
      // },
      // {
      //   path: "events/:city/:oname/:ename/:id",
      //   element: <EventDetail />,
      // },
    ],
  },
];
