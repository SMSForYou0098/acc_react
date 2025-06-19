import React, { memo, Fragment, useState, useEffect } from 'react'
import { Image, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useMyContext } from '../../../../../Context/MyContextProvider';

const Autheffect = memo(() => {
    const { GetSystemSetting } = useMyContext()
    const [logo, setLogo] = useState('')
    useEffect(() => {
        let isMounted = true;
        const loadLogo = async () => {
            try {
                const cachedLogo = localStorage.getItem('authLogo');
                if (cachedLogo) {
                    if (isMounted) setLogo(cachedLogo);
                }
                const data = await GetSystemSetting();
                const dynamicLogo = data?.auth_logo;
                if (dynamicLogo && isMounted) {
                    setLogo(dynamicLogo);
                    localStorage.setItem('authLogo', dynamicLogo);
                }
            } catch (error) {

            }
        };
        loadLogo();
        return () => {
            isMounted = false;
        };
    }, []);
    return (
        <Fragment >
            <nav className="navbar iq-auth-logo">
                <Container fluid>
                    <Link to="/dashboard" className="iq-link d-flex align-items-center">
                    </Link>
                </Container>
            </nav>
            <div className="iq-banner-logo d-none d-lg-block">
                <Image className="auth-image"
                    src={logo} alt="logo-img"
                    loading="lazy"
                    width={220}
                    style={{ height:'auto',left: '30rem', top: '20rem' }} 
                    />
            </div>
            <div className="container-inside">
                <div className="main-circle circle-small"></div>
                <div className="main-circle circle-medium"></div>
                <div className="main-circle circle-large"></div>
                <div className="main-circle circle-xlarge"></div>
                <div className="main-circle circle-xxlarge"></div>
            </div>
        </Fragment>
    )
})

Autheffect.displayName = "Autheffect"
export default Autheffect