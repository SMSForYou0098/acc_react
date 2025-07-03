import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Button } from 'react-bootstrap';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import SiteSettings from './SettingComps/SiteSettings';
import WelcomeModal from './SettingComps/WelcomeModal';

const initialSettings = {
  appName: '',
  logo: '',
  authLogo: '',
  favicon: '',
  mobileLogo: '',
  missedCallNumber: '',
  waNumber: '',
  notifyReq: false,
  complimentaryValidation: false,
  isModalEnabled: false,
  compressImage: false
};

const AdminSetting = () => {
  const { api, successAlert, authToken } = useMyContext();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${api}settings`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    if (res.data.status) {
      const configData = res.data.data;
      setSettings({
        appName: configData?.app_name || '',
        waNumber: configData?.whatsApp_number || '',
        missedCallNumber: configData?.missed_call_number || '',
        logo: configData?.logo || '',
        authLogo: configData?.auth_logo || '',
        mobileLogo: configData?.mobile_logo || '',
        favicon: configData?.favicon || '',
        complimentaryValidation: configData?.complimentary_attendee_validation === 1,
        notifyReq: configData?.user_notification_permission === 1,
        isModalEnabled: configData?.welcome_modal_status === 1,
        compressImage: configData?.compress_image === 1
      });
    }
  } catch (err) {
    console.error("Error fetching settings:", err);
    // Optionally add error handling UI feedback here
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchSettings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        if (['logo', 'mobileLogo', 'authLogo', 'favicon'].includes(key)) {
          formData.append(key, value);
        } else {
          formData.append(key, typeof value === 'boolean' ? (value ? 1 : 0) : value);
        }
      });

      const res = await axios.post(`${api}settings-store`, formData, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.status) successAlert('Success', 'Settings saved successfully');
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  return (
    <Row>
      <Col md={12}>
        <Card>
          <Card.Header><h4 className="card-title">Admin Settings</h4></Card.Header>
          <Card.Body>
            <Form>
              <SiteSettings
                loading={loading}
                settings={settings}
                onSettingChange={(key, value) => setSettings(prev => ({ ...prev, [key]: value }))}
              />
              <div className='d-flex justify-content-end'>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
              <hr className="hr-horizontal" />
              <WelcomeModal />
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminSetting;