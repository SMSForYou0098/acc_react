import  React,{memo,Fragment} from 'react'
// React-bootstrap
import { Row, Col, Card } from 'react-bootstrap'

//component
import Autheffect from '../components/auth-effect'
import { Link } from 'react-router-dom'


const Authemail = memo(() => {
    return (
        <Fragment>
           <div className="iq-auth-page">
               <Autheffect />
                <Row className="align-items-center iq-auth-container  w-100">
                    <Col lg="4" className="col-10 offset-lg-7 offset-1">
                        <Card>
                            <Card.Body>
                                <h4 className="pb-3">Success!</h4>
                                <p>A email has been send to your email@domain.com. Please check for an email from company and click on the included link to reset your password.</p>
                           <Link to="/dashboard" className="btn btn-primary">Back to home</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
})

Authemail.displayName="Authemail"
export default Authemail
