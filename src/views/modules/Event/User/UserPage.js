import React, { useCallback, useEffect, useState } from 'react';
import UserDetailModal from './UserDetailModal';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';
import IdCardCanvas from '../ID Card/IdCardCanvas';
import { FetchImageBlob } from '../ID Card/IdCardModal';
import LoaderComp from '../CustomUtils/LoaderComp';

const UserPage = () => {
  const { UserData, api, authToken, ErrorAlert } = useMyContext();
  console.log('UserData', UserData);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [zones, setZones] = useState([]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}zone`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
      if (response.data.status) {
        setZones(response.data.data);
      } else {
        setZones([]);
      }
    } catch (error) {
      const err = error.response?.data?.message || error.response?.data?.error || `Failed to fetch Data`;
      ErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}edit-user/${UserData.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('userDa', response)
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
    getUserData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      FetchImageBlob(api, authToken, setLoading, selectedUser?.photo, setUserImage);
      FetchImageBlob(api, authToken, setLoading, selectedUser?.category_url, setFinalImage);
    }
  }, [selectedUser]);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" 
    style={{ height: '50vh' }}>
      <LoaderComp />;
    </div> 
  }

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col md={8}>
          {selectedUser && (
            <UserDetailModal selectedUser={selectedUser} asDiv={true} zones={zones} />
          )}
        </Col>

        <Col md={4}>
          {selectedUser && (
            <Card className="p-3">
              <IdCardCanvas
                loading={loading}
                bgRequired={true}
                finalImage={finalImage}
                userImage={userImage}
                orderId={selectedUser?.orderId}
                zones={zones}
                userData={selectedUser}
                hidePrint={true}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserPage;
