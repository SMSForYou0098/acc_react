import React from 'react'
import {  useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const data = useSelector((state) => state.auth?.user);
  const DataLength = Object.keys(data).length;

  if (DataLength <= 0) {
    return <Navigate to={'/sign-in'} />
  }
  else {
    return <Outlet />
  }


}
export default ProtectedRoutes
