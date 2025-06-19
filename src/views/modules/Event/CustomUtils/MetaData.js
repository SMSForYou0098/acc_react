import React from "react";
import { Helmet } from "react-helmet-async";

const MetaData = ({ event }) => {
  // Default meta data values
  const defaultMeta = {
    title: "Get Your Ticket | Events, Party, Webinar",
    description: "Book your tickets for the most exciting events, parties, and webinars. Join us for unforgettable experiences, engaging activities, and vibrant celebrations. Don't miss out on the fun—secure your spot today!",
    keywords: "events, parties, webinars, ticket booking, live events, entertainment, cultural events, online webinars, fun activities, celebrations",
    ogImage: "/default-og-image.jpg"
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{event?.meta_title || defaultMeta.title}</title>
      <meta name="description" content={event?.meta_description || defaultMeta.description} />
      <meta name="keywords" content={event?.meta_keyword || defaultMeta.keywords} />
      <meta name="author" content="Get Your Ticket" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="event detail" />
      <meta property="og:title" content={event?.meta_title || defaultMeta.title} />
      <meta property="og:description" content={event?.meta_description || defaultMeta.description} />
      <meta property="og:image" content={event?.ogImage || defaultMeta.ogImage} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="event detail" />
      <meta name="twitter:title" content={event?.meta_title || defaultMeta.title} />
      <meta name="twitter:description" content={event?.meta_description || defaultMeta.description} />
      <meta name="twitter:image" content={event?.ogImage || defaultMeta.ogImage} />
    </Helmet>
  );
};

export default MetaData;
