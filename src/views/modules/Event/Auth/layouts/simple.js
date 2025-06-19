import React, { memo, Fragment, Suspense } from 'react'

// react-router-dom
import { Outlet } from 'react-router-dom'

//seetingoffCanvas
import SettingOffCanvas from '../../../../components/setting/SettingOffCanvas'

const Simple = memo(() => {
    return (
        <Fragment>
            <div className="wrapper">
                <Suspense fallback={<div className="react-load"></div>}>
                    <Outlet />
                </Suspense>
            </div>
            <SettingOffCanvas name={true} landingPage="false" />
        </Fragment>
    )
}
)

Simple.displayName = "Simple"
export default Simple
