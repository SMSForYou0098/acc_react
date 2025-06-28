import React, { useState, memo, Fragment } from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import Circularprogressbar from "../../../../components/circularprogressbar";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { Ticket, Users, Calendar, DollarSign, Activity, UserCheck, CreditCard } from "lucide-react";
import ScannerDashBoard from "../Scanner/ScannerDashBoard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Mock data generators
const generateRandomData = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateTrendData = (count) => Array.from({ length: count }, (_, i) => generateRandomData(50, 200));

const Index = memo(() => {
  const { userRole } = useMyContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for all roles
  const mockData = {
    admin: {
      organizers: 12,
      companies: 45,
      users: 1243,
      activeEvents: 23,
      revenue: 45230,
      trendData: generateTrendData(7),
      recentActivities: [
        { id: 1, action: 'New organizer registered', time: '2 mins ago' },
        { id: 2, action: 'Company "ABC Corp" created event', time: '15 mins ago' },
        { id: 3, action: 'System update completed', time: '1 hour ago' }
      ]
    },
    organizer: {
      companies: 5,
      users: 342,
      events: 8,
      ticketsSold: 1245,
      revenue: 23450,
      trendData: generateTrendData(5),
      upcomingEvents: [
        { id: 1, name: 'Tech Conference', date: '2023-11-15', tickets: 342 },
        { id: 2, name: 'Music Festival', date: '2023-12-05', tickets: 124 }
      ]
    },
    company: {
      users: 42,
      events: 3,
      attendanceRate: 78,
      revenue: 8450,
      trendData: generateTrendData(4)
    },
    scanner: {
      scansToday: 124,
      recentScans: [
        { id: 1, ticket: 'TCKT-1245', event: 'Tech Conference', time: '10:24 AM' },
        { id: 2, ticket: 'TCKT-1246', event: 'Tech Conference', time: '10:26 AM' }
      ]
    }
  };

  // Role-based data selection
  const getRoleData = () => {
    switch(userRole) {
      case 'Admin': return mockData.admin;
      case 'Organizer': return mockData.organizer;
      case 'Company': return mockData.company;
      case 'Scanner': return mockData.scanner;
      default: return {};
    }
  };

  const roleData = getRoleData();

  // Stats cards configuration
  const getStatsCards = () => {
    const cards = [];
    const colors = {
      primary: '#6362e7',
      info: '#38b6ff',
      success: '#4fd18b',
      warning: '#ffb648'
    };

    if (userRole === 'Admin') {
      cards.push(
        { icon: <Users size={20} />, title: 'Organizers', value: roleData.organizers, color: colors.primary },
        { icon: <UserCheck size={20} />, title: 'Companies', value: roleData.companies, color: colors.info },
        { icon: <Users size={20} />, title: 'Users', value: roleData.users, color: colors.success },
        { icon: <Calendar size={20} />, title: 'Active Events', value: roleData.activeEvents, color: colors.warning },
        { icon: <DollarSign size={20} />, title: 'Revenue', value: roleData.revenue, prefix: '$', color: colors.primary }
      );
    } else if (userRole === 'Organizer') {
      cards.push(
        { icon: <UserCheck size={20} />, title: 'My Companies', value: roleData.companies, color: colors.primary },
        { icon: <Users size={20} />, title: 'My Users', value: roleData.users, color: colors.info },
        { icon: <Ticket size={20} />, title: 'Events', value: roleData.events, color: colors.success },
        { icon: <CreditCard size={20} />, title: 'Tickets Sold', value: roleData.ticketsSold, color: colors.warning },
        { icon: <DollarSign size={20} />, title: 'Revenue', value: roleData.revenue, prefix: '$', color: colors.primary }
      );
    } else if (userRole === 'Company') {
      cards.push(
        { icon: <Users size={20} />, title: 'My Users', value: roleData.users, color: colors.primary },
        { icon: <Calendar size={20} />, title: 'My Events', value: roleData.events, color: colors.info },
        { icon: <Activity size={20} />, title: 'Attendance Rate', value: roleData.attendanceRate, suffix: '%', color: colors.success },
        { icon: <DollarSign size={20} />, title: 'Revenue', value: roleData.revenue, prefix: '$', color: colors.warning }
      );
    }

    return cards;
  };

  const statsCards = getStatsCards();

  return (
    <Fragment>
      <Row className="mb-4">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              {userRole} Dashboard
              <Badge bg="primary" className="ms-2">Live</Badge>
            </h4>
            <div className="d-flex">
              <button 
                className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`btn btn-sm ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </div>
          </div>
        </Col>
      </Row>

      {(userRole === 'Admin' || userRole === 'Organizer' || userRole === 'Company') && (
        <Row className="mb-4">
          <Col xs={12}>
            <Swiper
              slidesPerView="auto"
              spaceBetween={16}
              modules={[Navigation]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              className="pb-3"
              breakpoints={{
                320: { slidesPerView: 1.2 },
                576: { slidesPerView: 2.2 },
                768: { slidesPerView: 3.2 },
                992: { slidesPerView: 4.2 },
                1200: { slidesPerView: 5.2 },
              }}
            >
              {statsCards.map((card, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <Card className="h-100" style={{ minWidth: '200px' }}>
                    <Card.Body className="d-flex align-items-center">
                      <Circularprogressbar
                        stroke={card.color}
                        width="48px"
                        height="48px"
                        value={100}
                        style={{ width: 48, height: 48, flexShrink: 0 }}
                      >
                        {card.icon}
                      </Circularprogressbar>
                      <div className="ms-3">
                        <p className="mb-1 text-muted small">{card.title}</p>
                        <h5 className="mb-0">
                          {card.prefix || ''}
                          <CountUp
                            start={0}
                            end={card.value}
                            duration={2}
                            separator=","
                          />
                          {card.suffix || ''}
                        </h5>
                      </div>
                    </Card.Body>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      )}

      {userRole === 'Admin' && activeTab === 'overview' && (
        <Row>
          <Col lg={8} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">System Activity</h5>
                  <select className="form-select form-select-sm w-auto">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                  </select>
                </div>
                <div style={{ height: '300px' }}>
                  {/* In a real app, this would be a chart component */}
                  <div className="d-flex align-items-end h-100">
                    {roleData.trendData.map((value, i) => (
                      <div 
                        key={i} 
                        className="flex-grow-1 bg-primary bg-opacity-10 mx-1 rounded-top" 
                        style={{ 
                          height: `${value / 2}px`,
                          minWidth: '30px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Recent Activities</h5>
                <div className="activity-feed">
                  {roleData.recentActivities.map(activity => (
                    <div key={activity.id} className="feed-item mb-3">
                      <div className="d-flex">
                        <div className="bullet bg-primary"></div>
                        <div className="ms-3">
                          <p className="mb-1">{activity.action}</p>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {userRole === 'Organizer' && activeTab === 'overview' && (
        <Row>
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Upcoming Events</h5>
                {roleData.upcomingEvents.map(event => (
                  <div key={event.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-1">{event.name}</h6>
                      <Badge bg="light" text="dark">{event.tickets} tickets</Badge>
                    </div>
                    <small className="text-muted">{new Date(event.date).toLocaleDateString()}</small>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Sales Trend</h5>
                <div style={{ height: '250px' }}>
                  <div className="d-flex align-items-end h-100">
                    {roleData.trendData.map((value, i) => (
                      <div 
                        key={i} 
                        className="flex-grow-1 bg-info bg-opacity-10 mx-1 rounded-top" 
                        style={{ 
                          height: `${value / 2}px`,
                          minWidth: '20px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {userRole === 'Scanner' && <ScannerDashBoard />}
    </Fragment>
  );
});

Index.displayName = "Index";
export default Index;