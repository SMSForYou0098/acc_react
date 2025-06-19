import React, { memo, Fragment } from 'react'

//header
import HeaderStyle3 from '../../components/partials/dashboard/headerstyle/header-style-3'

//HorizontalMultiRouter 
import HorizontalMultiRouter from '../../router/horizontal-multi-router'

//footer
import Footer from '../../components/partials/dashboard/footerstyle/footer'

//seetingoffCanvas
import SettingOffCanvas from '../../components/setting/SettingOffCanvas'


const DualHorizontal = memo((props) => {
    return (
        <Fragment>
            <main className="main-content">
                <HeaderStyle3 />
                <div className="pb-0 conatiner-fluid content-inner">
                    <HorizontalMultiRouter />
                </div>
                <Footer />
            </main>
            <SettingOffCanvas />
        </Fragment>
    )
}
)

DualHorizontal.displayName = "DualHorizontal"
export default DualHorizontal
