import React from "react";
import { Section } from "./UserDetailModal";
import { Check, MapPin, X } from "lucide-react";
import { Badge, Col, Row } from "react-bootstrap";
import { capitalize } from "lodash";

const ZonesPreview = ({zones,assignedZoneIds,name = "User"}) => {
  return (
    <Section title={`Assigned Zones For ${capitalize(name)}`} color="info" icon={<MapPin size={18} />}>
      <div className="mb-3">
        <Row className="g-3">
          {zones?.map((zone) => {
            const isAssigned = assignedZoneIds?.some((z) => z.id === zone.id);

            return (
              <Col md={4} key={zone.id}>
                <Badge
                  bg={isAssigned ? "success" : "light"}
                  text={isAssigned ? "white" : "dark"}
                  className="w-100 px-3 py-2 d-flex align-items-center justify-content-start gap-2 fs-6 shadow-sm"
                >
                  {isAssigned ? (
                    <Check size={14} />
                  ) : (
                    <X size={14} opacity={0.6} />
                  )}
                  <MapPin size={14} /> {zone.title}
                </Badge>
              </Col>
            );
          })}
        </Row>
      </div>
    </Section>
  );
};

export default ZonesPreview;
