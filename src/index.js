import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
//reducer
import { IndexRouters } from "./router";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import DefaultLayout from "./views/modules/Event/layouts/default-layout";
import Signin from "./views/modules/Event/Auth/pages/sign-in";
const router = createBrowserRouter(
  [
    {
      path: "/sign-in",
      element: <DefaultLayout header2="true"/>,
      children: [
        {
          path: "",
          element: <Signin />,
        }
      ]
    },
    ...IndexRouters,
  ],
  { basename: process.env.PUBLIC_URL }
);
// Register service worker for Firebase Cloud Messaging
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then(registration => {
       
      })
      .catch(error => {
        //console.error('FCM Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App>
          <RouterProvider router={router} />
        </App>
      </PersistGate>
    </Provider>
  </>
);

