import { Button } from "react-bootstrap";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import { IdCard, Eye, Users2, Settings, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

export const defaultColumnProps = {
  headerAlign: "center",
  align: "center",
  sort: true,
};

const formatRoleBadge = (cell) => {
  const badgeClass = {
    Admin: "bg-info",
    Organizer: "bg-primary",
    User: "bg-warning",
    Agent: "bg-danger",
    "Support Executive": "bg-success",
  }[cell] || "bg-secondary";

  return (
    <span className={`badge p-2 fw-normal ls-1 ${badgeClass} w-100`}>
      {cell}
    </span>
  );
};

const formatAuth = (cell) => (parseInt(cell) === 1 ? "Password" : "OTP");

const formatApprovalStatus = (cell, row) => {
  if (row.role_name !== "User") {
    return (
      <CustomTooltip text="Approved">
        <Button variant="outline-success" className="btn-sm btn-icon" disabled>
          <CheckCircle size={16} />
        </Button>
      </CustomTooltip>
    );
  }

  const status = {
    0: { text: "Pending", variant: "warning", icon: <Clock size={16} /> },
    1: { text: "Approved", variant: "success", icon: <CheckCircle size={16} /> },
    2: { text: "Rejected", variant: "danger", icon: <XCircle size={16} /> },
  }[cell] || {};

  return (
    <CustomTooltip text={status.text}>
      <Button variant={`outline-${status.variant}`} className="btn-sm btn-icon" disabled>
        {status.icon}
      </Button>
    </CustomTooltip>
  );
};

const formatApprovalActions = (cell, row, handleApproval) => {
  if (row.role_name === "User" && parseInt(row.approval_status) === 0) {
    return (
      <div className="d-flex gap-2 justify-content-center">
        <CustomTooltip text="Approve User">
          <Button
            variant="outline-success"
            className="btn-sm btn-icon"
            onClick={() => handleApproval(row.id, "1")}
          >
            <CheckCircle size={16} />
          </Button>
        </CustomTooltip>
        <CustomTooltip text="Reject User">
          <Button
            variant="outline-danger"
            className="btn-sm btn-icon"
            onClick={() => handleApproval(row.id, "2")}
          >
            <XCircle size={16} />
          </Button>
        </CustomTooltip>
      </div>
    );
  }
  return <span className="text-muted">No action needed</span>;
};

const formatZones = (cell, row, zones, setZoneModal) => {
  if (row.role_name !== "Company") {
    return <span className="text-muted">No action needed</span>;
  }

  const assignedZoneIds = (cell || []).map((z) => z.id);

  const sortedZones = [...zones].sort((a, b) =>
    assignedZoneIds.includes(a.id) === assignedZoneIds.includes(b.id)
      ? 0
      : assignedZoneIds.includes(a.id)
      ? -1
      : 1
  );

  const displayZones = sortedZones.slice(0, 4);
  const remainingZones = zones.length > 5 ? zones.length - 5 : 0;

  return (
    <div className="d-flex gap-1 justify-content-center">
      {displayZones.map((zone, index) => {
        const isAssigned = assignedZoneIds.includes(zone.id);
        return (
          <CustomTooltip key={index} text={zone.title || zone.name}>
            <Button
              size="sm"
              variant={isAssigned ? "success" : "danger"}
              className="rounded-3 border shadow-sm px-2 py-1"
              style={{ minWidth: "32px", height: "26px" }}
              disabled
            >
              {isAssigned ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} opacity={0.6} />
              )}
            </Button>
          </CustomTooltip>
        );
      })}

      {remainingZones > 0 && (
        <CustomTooltip text={`${remainingZones} more zone${remainingZones > 1 ? "s" : ""}`}>
          <Button
            size="sm"
            variant="primary"
            className="rounded-3 border shadow-sm px-2 py-1"
            style={{ minWidth: "32px", height: "26px", fontSize: "0.7rem" }}
            onClick={() =>
              setZoneModal({
                show: true,
                user: row,
                assignedZoneIds : assignedZoneIds
              })
            }
          >
            +{remainingZones}
          </Button>
        </CustomTooltip>
      )}
      {zones.length === 0 && (
        <span className="text-muted small">No zones available</span>
      )}
    </div>
  );
};

export const baseColumns = [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => rowIndex + 1,
    ...defaultColumnProps,
  },
  { dataField: "name", text: "Name", ...defaultColumnProps },
  { dataField: "contact", text: "Contact", ...defaultColumnProps },
  { dataField: "email", text: "Email", ...defaultColumnProps },
  {
    dataField: "authentication",
    text: "Auth",
    formatter: formatAuth,
    ...defaultColumnProps,
  },
  {
    dataField: "role_name",
    text: "Role",
    formatter: formatRoleBadge,
    ...defaultColumnProps,
  },
  {
    dataField: "company_name",
    text: "Company Name",
    formatter: (cell, row) =>
      cell || row.organiser_company_name || row.user_company_name || "—",
    ...defaultColumnProps,
  },
];

export const getConditionalColumns = (type, zones, setZoneModal, handleApproval) => {
  const conditionalCols = [];

  if (type === "company") {
    conditionalCols.push(
      {
        dataField: "zoneData",
        text: "Zones",
        formatter: (cell, row) => formatZones(cell, row, zones, setZoneModal),
        ...defaultColumnProps,
      },
      {
        dataField: "organiser_name",
        text: "Organizer",
        formatter: (cell, row) =>
          cell || row.organiser_company_name || row.user_org_name || "—",
        ...defaultColumnProps,
      }
    );
  }

  if (["organizer", "company"].includes(type)) {
    // Company name is now in baseColumns, so this conditional block can be removed or used for other columns specific to organizer/company
  }

  if (type === "user") {
    conditionalCols.push(
      {
        dataField: "approval_status",
        text: "Status",
        formatter: formatApprovalStatus,
        ...defaultColumnProps,
      },
      {
        dataField: "approval",
        text: "Approval Actions",
        formatter: (cell, row) => formatApprovalActions(cell, row, handleApproval),
        ...defaultColumnProps,
      }
    );
  }

  return conditionalCols;
};

export const getActionColumn = (type, handlers) => ({
  dataField: "action",
  text: "Action",
  formatter: (cell, row) => {
    const {
      handleShowIdCardModal,
      handlePreview,
      AssignCredit,
      HandleDelete,
      HandleBulkUser
    } = handlers;

    const actions = [
      {
        tooltip: "Generate ID Card",
        icon: <IdCard size={16} />,
        onClick: () => handleShowIdCardModal(row.id),
        variant: "secondary",
        isDisabled: row?.status !== 1 || parseInt(row.approval_status) !== 1,
        visible: type === "user",
      },
      {
        tooltip: "Preview User",
        icon: <Eye size={16} />,
        onClick: () => handlePreview(row.id),
        variant: "info",
        visible: true,
      },
      {
        tooltip: "Users",
        icon: <Users2 size={16} />,
        onClick: () => HandleBulkUser(row.id),
        variant: "warning",
        visible: ["company", "organizer"].includes(type),
      },
      {
        tooltip: "Manage User",
        icon: <Settings size={16} />,
        onClick: () => AssignCredit(row.id),
        variant: "primary",
        visible: true,
      },
      {
        tooltip: "Delete User",
        icon: <Trash2 size={16} />,
        onClick: () => HandleDelete(row.id),
        variant: "danger",
        visible: true,
      },
    ];

    return (
      <div className="d-flex gap-2 justify-content-center">
        {actions
          .filter((a) => a.visible)
          .map((action, idx) => (
            <CustomTooltip key={idx} text={action.tooltip}>
              <Button
                variant={action.variant}
                className="btn-sm btn-icon"
                onClick={action.onClick}
                disabled={action?.isDisabled}
              >
                {action.icon}
              </Button>
            </CustomTooltip>
          ))}
      </div>
    );
  },
  ...defaultColumnProps,
});
