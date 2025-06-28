import React, { useEffect, useState } from 'react';
import UserDetailModal from './UserDetailModal';
import IdCardModal from '../ID Card/IdCardModal';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';

const UserPage = () => {
  const { UserData, api, authToken } = useMyContext();

  const [selectedUser, setSelectedUser] = useState(null);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${api}edit-user/${UserData.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('userDa',response)
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    if (UserData?.id) {
      getUserData();
    }
  }, [UserData?.id]);

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col md={8}>
          {selectedUser && (
              <UserDetailModal selectedUser={selectedUser} asDiv={true} />
          )}
        </Col>

        <Col md={4}>
          {selectedUser && (
            <Card className="p-3">
              {/* <IdCardModal
                show={true}
                bgRequired={true}
                onHide={() => {}}
                id={selectedUser.id}
                idCardData={selectedUser}
                asDiv={true}
              /> */}
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserPage;
