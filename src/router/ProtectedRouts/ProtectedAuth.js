import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Default from '../../layouts/dashboard/default';

const ProtectedAuth = () => {
    const data = useSelector((state) => state.user.user);
    const DataLength = Object.keys(data).length;
    if(DataLength>0){
        return <Navigate to={'/'} />
    }
    else{
        return <Outlet />
    }
}
export default ProtectedAuth
