import React, { useEffect, useState } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider'
import axios from 'axios'
import { Button, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CheckUserMailComp = ({ number }) => {
    const { api, authToken,UserData } = useMyContext()
    const [emailExist, setEmailExist] = useState()
    const [show, setShow] = useState(false);
    const handleSubmit = async () => {
        if (number) {
            await axios.post(`${api}chek-number-email`, {
                'number': number,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            }).then((res) => {
                let exist = res?.data?.status
                if (exist) {
                    setEmailExist(exist)
                    setShow(true);
                }
            }).catch((err) =>
                console.log(err)
            )
        }
    }
    useEffect(() => {
        handleSubmit()
    }, []);
    const navigate = useNavigate()
    const handleCompleteProfile = () => {
        navigate(`/dashboard/users/manage/${UserData?.id}`)
        setShow(false);
    }
    if(emailExist){
        return (
            <Modal show={show} onHide={() => { }} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                <Modal.Title>Account Setup Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    There is no email linked with this account. Please complete your profile to continue.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCompleteProfile}>
                        Complete Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    } else {
        return null;
    }
}

export default CheckUserMailComp
