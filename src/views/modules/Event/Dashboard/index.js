import React, { useState, useEffect, memo, Fragment } from "react";
import { Row, Col, Card, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import Circularprogressbar from "../../../../components/circularprogressbar";
import * as SettingSelector from "../../../../store/setting/selectors";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import ScannerDashBoard from "../Scanner/ScannerDashBoard";
import MobBookingButton from "../CustomUtils/BookingUtils/MobBookingButton";
import { ScanLine, Ticket, Users } from "lucide-react";
import { useMemo } from "react";
import GraphAndCardsLayout from "./GraphAndCardsLayout";
import { isNull } from "lodash";

const AgentCard = ({ title, value, today }) => (
  <Col lg="4" md="6">
    <Row>
      <div className="col-12">
        <Card className="card-block card-stretch card-height">
          <Card.Body>
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <span className="text-dark">{title}</span>
              <Link className="badge rounded-pill bg-primary-subtle" to="#javascript:void(0);">
                Total
              </Link>
            </div>
            <h2 className="counter">₹
              <CountUp start={0} end={value} duration={3} useEasing={true} separator="," />
            </h2>
            <small>Available to pay out.</small>
          </Card.Body>
        </Card>
      </div>
      <div className="col-12">
        <Card className="card-block card-stretch card-height">
          <Card.Body>
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <span className="text-dark">Today {title.split(' ').pop()}</span>
              <Link className="badge rounded-pill bg-primary-subtle" to="#javascript:void(0);">
                Total
              </Link>
            </div>
            <h2 className="counter">₹
              <CountUp start={0} end={today} duration={3} useEasing={true} />
            </h2>
            <small>Transactions today</small>
          </Card.Body>
        </Card>
      </div>
    </Row>
  </Col>
);
const SalesCard = ({ title, value, subtitle, link = 'Total', symbol }) => (
  <Card className="card-block card-stretch card-height">
    <Card.Body>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <span className="text-dark">{title}</span>
        <Link className="badge rounded-pill bg-primary-subtle" to="#javascript:void(0);">
          {link}
        </Link>
      </div>
      <h2 className="counter">{symbol === 'user' ? <Users size={16} color="grey" className="me-2" /> : '₹'}<CountUp start={0} end={value} duration={3} useEasing separator="," /></h2>
      {subtitle && <small>{subtitle}</small>}
    </Card.Body>
  </Card>
);

const Index = memo(() => {
  const { api, UserData, authToken, userRole, isMobile, UserPermissions } = useMyContext();
  const navigate = useNavigate()

  useEffect(() => {
    if (userRole === 'User') {
      navigate('/dashboard/bookings');
    }
  }, [userRole]);

  useSelector(SettingSelector.theme_color);

  const getVariableColor = () => {
    let prefix =
      getComputedStyle(document.body).getPropertyValue("--prefix") || "bs-";
    if (prefix) {
      prefix = prefix.trim();
    }
    const color1 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}primary`
    );
    const color2 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}info`
    );
    const color3 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}primary-tint-20`
    );
    const color4 = getComputedStyle(document.body).getPropertyValue(
      `--${prefix}warning`
    );
    return {
      primary: color1.trim(),
      info: color2.trim(),
      warning: color4.trim(),
      primary_light: color3.trim(),
    };
  };

  const variableColors = useMemo(() => getVariableColor(), []);
  const colors = useMemo(() => [variableColors.primary, variableColors.info], [variableColors]);

  const [counts, setCounts] = useState([{
    offline: '',
    online: '',
    users: '',
    agents: '',
    pos: '',
    organizer: '',
    Scanner: ''
  }]);
  const [sale, setSale] = useState({
    offline: '',
    online: '',
    agents: '',
    pos: '',
    agentsToday: '',
    posToday: '',
    organizer: '',
    Scanner: '',
    easebuzz: '',
    instamojo: '',
  });

  const [cFees, setCFess] = useState({
    offline: '',
    online: '',
    agents: '',
    pos: '',
    organizer: '',
    Scanner: ''
  });
  const [weeklySales, setWeeklySales] = useState([]);
  const [weeklyConvenienceFee, setWeeklyConvenienceFee] = useState([]);

  const getCounts = async () => {
    await axios.get(`${api}bookingCount/${UserData?.id}`, {
      headers: {
        'Authorization': 'Bearer ' + authToken,
      }
    }).then((res) => {
      if (res.data.status) {
        setCounts({
          offline: res.data.offlineBookings,
          online: res.data.onlineBookings,
          users: res.data.userCount,
          agents: res.data.agentCount,
          pos: res.data.posCount,
          organizer: res.data.organizerCount,
          scanner: res.data.scannerCount
        });
      }
    }).catch((err) => console.log(err));
  };

  const getSaleCounts = async () => {
    await axios.get(`${api}calculateSale/${UserData?.id}`, {
      headers: {
        'Authorization': 'Bearer ' + authToken,
      }
    }).then((res) => {
      if (res.data.status) {
        let convenienceFee = res.data?.convenienceFee
        let weeklySales = res.data?.salesDataNew
        setWeeklySales(weeklySales)
        setWeeklyConvenienceFee(convenienceFee)
        setSale({
          offline: res.data.offlineAmount,
          agents: res.data.agentBooking,
          agentsToday: res.data.agentToday,
          // agent
          bookings: { today: res.data.todayTotalBookings, total: res.data.totalBookings },
          tickets: { today: res.data.agentsTodayTickets, total: res.data.totalTickets },
          cash: { today: res.data.cashSales?.today, total: res.data.cashSales?.total },
          upi: { today: res.data.upiSales?.today, total: res.data.upiSales?.total },
          nb: { today: res.data.netBankingSales?.today, total: res.data.netBankingSales?.total },

          //
          online: res.data.onlineAmount,
          pos: res.data.posAmount,
          posToday: res.data.posTodayAmount,

          //
          instamojo: res.data.instamojoTotalAmount,
          easebuzz: res.data.easebuzzTotalAmount,
        });
        setCFess({
          offline: res.data.offlineCNC,
          agents: res.data.agentCNC,
          online: res.data.onlineCNC,
          pos: res.data.posCNC,
        });
      }
    }).catch((err) => console.log(err));
  };

  useEffect(() => {
    getCounts()
    getSaleCounts()
  }, []);

  const growth = [
    {
      color: variableColors.info,
      value: 40,
      id: "circle-progress-06",
      svg: <Ticket size={20} />,
      name: "Online Bookings",
      start: 0,
      end: counts?.online,
      duration: 3,
    },
    {
      color: variableColors.info,
      value: 40,
      id: "circle-progress-06",
      svg: <Ticket size={20} />,
      name: "Offline Bookings",
      start: 0,
      end: counts?.offline,
      duration: 3,

    },
    {
      color: variableColors.primary,
      value: 91,
      id: "circle-progress-01",
      svg: <Users size={20} />,
      name: "Total Users",
      start: 0,
      end: counts?.users,
      duration: 3,

    },
    {
      color: variableColors.info,
      value: 80,
      id: "circle-progress-02",
      svg: <Users size={20} />,
      name: "Agents",
      start: 0,
      end: counts?.agents,
      duration: 3,
    },
    {
      color: variableColors.primary,
      value: 70,
      id: "circle-progress-03",
      svg: <Users size={20} />,
      name: "POS Users",
      start: 0,
      end: counts?.pos,
      duration: 3,
    },
    {
      color: variableColors.info,
      value: 60,
      id: "circle-progress-04",
      svg: <ScanLine size={20} />,
      name: "Scanners",
      start: 0,
      end: counts?.scanner,
      duration: 3,
    },
    {
      color: variableColors.primary,
      value: 50,
      id: "circle-progress-05",
      svg: <Users size={20} />,
      name: "Organizer",
      start: 0,
      end: counts?.organizer,
      duration: 3,
    },
  ];

  const cardData = [
    { title: "Online", value: sale?.online, note: null },
    { title: "EaseBuzz", value: sale?.easebuzz, note: null },
    { title: "Instamojo", value: sale?.instamojo, note: null },
    { title: "PhonePe", value: 0, note: null },
    { title: "Sponser Sales", value: 0, note: null },
    { title: "Complimentary", value: sale?.online + sale?.offline + sale?.agents + sale?.pos, note: null },
    { title: "Offline", value: sale?.offline, note: null },
    { title: "Agent Sales", value: sale?.agents, note: null },
    { title: "POS Sales", value: sale?.pos, note: null },
    { title: "Organizer Sales", value: 0, note: null },
    { title: "Sponser Sales", value: 0, note: null },
    { title: "Total Sales", value: sale?.online + sale?.offline + sale?.agents + sale?.pos, note: null },
  ];

  const feeCards = [
    { title: "Online C Fees", value: cFees?.online, note: null },
    { title: "EaseBuzz C Fees", value: cFees?.online, note: null },
    { title: "Instamojo C Fees", value: 0, note: null },
    { title: "PhonePe C Fees", value: 0, note: null },
    { title: "Offline C Fees", value: cFees?.offline, note: null },
    { title: "Agent Sales C Fees", value: cFees?.agents, note: null },
    { title: "POS Sales C Fees", value: cFees?.pos, note: null },
    { title: "Organizer Sales C Fees", value: 0, note: null },
  ];

  const getLast7DaysWeekdays = () => {
    const categories = ["S", "M", "T", "W", "T", "F", "S"];
    const result = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - i);
      const dayIndex = pastDate.getDay();
      result.push(categories[dayIndex]);
    }

    return result;
  };
  const commonChartOptions = useMemo(() => ({
    chart: {
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "28%",
        endingShape: "rounded-4",
        borderRadius: 3,
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    grid: {
      show: true,
      strokeDashArray: 7,
    },
    xaxis: {
      categories: getLast7DaysWeekdays(),
      labels: {
        minHeight: 20,
        maxHeight: 20,
        style: { colors: "#8A92A6" },
      },
    },
    yaxis: {
      title: { text: "" },
      labels: {
        minWidth: 20,
        maxWidth: 100,
        style: { colors: "#8A92A6" },
      },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val) => `₹${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 1025,
        options: {
          chart: { height: 130 },
        },
      },
    ],
  }), []);

  const saleChart = {
    options: {
      ...commonChartOptions,
      colors: colors,
    },
    series: [
      {
        name: "Online Sale",
        data: weeklySales && weeklySales[0]?.data,
      },
      {
        name: "Offline Sale",
        data: weeklySales && weeklySales[1]?.data,
      },
    ],
  };

  const convenienceChart = {
    options: {
      ...commonChartOptions,
      colors: colors,
    },
    series: [
      {
        name: "Online Sale",
        data: weeklyConvenienceFee[0]?.data,
      },
      {
        name: "Offline Sale",
        data: weeklyConvenienceFee[1]?.data,
      },
    ],
  };
  const [liveUserCount, setLiveUserCount] = useState(0);

  const getLiveUserCount = async (period) => {
    try {
      const response = await axios.get(`${api}user-devices/count`, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        },
        params: { period }
      });
      if (response.data.status) {
        setLiveUserCount(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const liveUserCards = [
    { title: 'Live Users', value: liveUserCount.live_users, link: 'Live' },
    { title: 'Today Users', value: liveUserCount.today, link: 'Today' },
    { title: 'Yesterday Users', value: liveUserCount.yesterday, link: 'Yesterday' },
    { title: 'Last 2 Days', value: liveUserCount.last_2_days, link: '2 Days' },
    { title: 'Last Week', value: liveUserCount.last_7_days, link: 'Week' },
    { title: 'This Month', value: liveUserCount.this_month, link: 'Month' }
  ];

  const agentSalesCards = [
    { title: 'Total Cash', value: sale?.cash?.total, today: sale?.cash?.today, type: 'cash' },
    { title: 'Total UPI', value: sale?.upi?.total, today: sale?.upi?.today, type: 'upi' },
    { title: 'Total Net Banking', value: sale?.nb?.total, today: sale?.nb?.today, type: 'nb' }
  ];



  useEffect(() => {
    getLiveUserCount();
  }, []);

  const layoutSections = [
    {
      graphTitle: "Total Sales",
      graphValue: sale?.online + sale?.offline,
      chartOptions: saleChart.options,
      chartSeries: saleChart.series,
      cards1: cardData
    },
    {
      graphTitle: "Total Convenience Fee",
      graphValue: cFees?.online + cFees?.offline,
      chartOptions: convenienceChart.options,
      chartSeries: convenienceChart.series,
      cards1: feeCards
    }
  ];

  const POSLayout = {
    graphTitle: "Total Sales",
    graphValue: sale?.pos,
    chartOptions: saleChart.options,
    chartSeries: saleChart.series,
    cards: [
      {
        title: "Total Sales",
        value: sale?.pos,
        note: isNull
      },
      {
        title: "Today Total",
        value: sale?.posToday,
        note: isNull
      }
    ]
  };

  const AgentLayout = {
    graphTitle: "Total Sales",
    graphValue: sale?.agents,
    chartOptions: saleChart.options,
    chartSeries: saleChart.series,
    cards1: [
      {
        title: "Total Sales",
        value: sale?.agents,
        note: null
      },
      {
        title: "Today Total",
        value: sale?.agentsToday,
        note: null
      }
    ],
    cards2: [
      {
        title: "Total Booking",
        value: sale?.bookings?.total,
        note: null
      },
      {
        title: "Today Booking",
        value: sale?.bookings?.total,
        note: null
      },
      {
        title: "Total Tickets",
        value: sale?.tickets?.total,
        note: null
      },
      {
        title: "Today Tickets",
        value: sale?.tickets?.today,
        note: null
      }
    ]
  };

  return (
    <Fragment>
      {(isMobile && (userRole === 'Agent'  || userRole === 'POS')) &&
        <MobBookingButton to={userRole === 'Agent' ? "/dashboard/agent-bookings/new" : "/dashboard/pos"} />
      }
      <Row>
        {(userRole === 'Admin' || userRole === 'Organizer') &&
          <>
            <Col lg={12} md={12}>
              <div className="overflow-hidden d-slider1">
                <Swiper
                  as="ul"
                  className="p-0 m-0 swiper-wrapper list-inline"
                  slidesPerView={3.5}
                  spaceBetween={32}
                  autoplay={true}
                  modules={[Navigation]}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  breakpoints={{
                    320: { slidesPerView: 2 },
                    550: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                    1400: { slidesPerView: 4 },
                    1500: { slidesPerView: 6 },
                    1920: { slidesPerView: 6 },
                    2040: { slidesPerView: 7 },
                    2440: { slidesPerView: 8 },
                  }}
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  {growth.map((item, index) => {
                    return (

                      <SwiperSlide className="card card-slide" key={index}
                        breakpoints={{
                          320: { slidesPerView: 1, spaceBetween: 10 }, // For small screens
                          550: { slidesPerView: 2, spaceBetween: 15 }, // For slightly larger screens
                          991: { slidesPerView: 3, spaceBetween: 20 }, // For tablets
                          1400: { slidesPerView: 4, spaceBetween: 25 }, // For desktops
                          1500: { slidesPerView: 6, spaceBetween: 30 }, // For larger desktops
                          1920: { slidesPerView: 6, spaceBetween: 32 },
                          2040: { slidesPerView: 7, spaceBetween: 32 },
                          2440: { slidesPerView: 8, spaceBetween: 32 },
                        }}
                      >
                        <Card.Body>
                          <div className="progress-widget mb-2">
                            <Circularprogressbar
                              stroke={item.color}
                              width="60px"
                              height="60px"
                              Linecap="rounded"
                              trailstroke="#ddd"
                              strokewidth="4px"
                              style={{ width: 60, height: 60 }}
                              value={item.value}
                              id={item.id}
                            >
                              {item.svg}
                            </Circularprogressbar>
                            <div className="progress-detail">
                              <p className="mb-2">{item.name}</p>
                              <h4 className="counter">

                                <CountUp
                                  start={item.start}
                                  end={item.end}
                                  duration={item.duration}
                                  separator=""
                                  decimals={item.decimal}
                                />
                                {/* {item.suffix ? item.suffix : "K"} */}
                              </h4>
                            </div>
                          </div>
                        </Card.Body>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                <div className="swiper-button swiper-button-next"></div>
                <div className="swiper-button swiper-button-prev"></div>
              </div>
            </Col>
            {layoutSections?.map((section, index) => (
              <>
                <GraphAndCardsLayout
                  key={index}
                  {...section}
                />

              </>
            ))}
          </>
        }
        {userRole === 'POS' && (
          <Row>
            <GraphAndCardsLayout {...POSLayout} />
          </Row>
        )}
        {(userRole === 'Agent' || userRole === 'Sponsor' || userRole === 'Accreditation') && (
          <>
            <Row>
              <GraphAndCardsLayout {...AgentLayout} />
            </Row>
            <Col lg="12" md="6">
              <Row>
                {agentSalesCards.map((card, index) => (
                  <AgentCard key={index} {...card} />
                ))}
              </Row>
            </Col>
          </>
        )}
        {
          userRole === 'Scanner' &&
          <ScannerDashBoard />
        }
      </Row>
      {UserPermissions?.includes('View Live Users') &&
        <Row className="justify-content-end mb-4">
          <Col lg="12">
            <Row>
              {liveUserCards.map((card, index) => (
                <Col lg="2" md="4" sm="6" key={index}>
                  <SalesCard
                    title={card.title}
                    value={card.value}
                    link={card.link}
                    symbol={'user'}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      }
    </Fragment>
  );
});

Index.displayName = "Index";
export default Index;
