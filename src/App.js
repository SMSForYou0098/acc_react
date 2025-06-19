import React from "react";
import "./assets/modules/landing-pages/scss/landing-pages.scss";
import "shepherd.js/dist/css/shepherd.css";
import "flatpickr/dist/flatpickr.css";
import "choices.js/public/assets/styles/choices.min.css";
import "./assets/scss/hope-ui.scss";
import "./assets/scss/pro.scss";
import "./assets/scss/custom.scss";
import "./assets/scss/rtl.scss";
import "./assets/scss/customizer.scss";
import "./assets/custom/scss/custom.scss";
import './assets/custom/css/choices.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { HelmetProvider } from "react-helmet-async";
import { MyContextProvider } from "./Context/MyContextProvider";
import AppContent from "./views/AppContent";

function App({ children }) {
  return (
    <HelmetProvider>
      <MyContextProvider>
        <AppContent>{children}</AppContent>
      </MyContextProvider>
    </HelmetProvider>
  )
}

export default App;