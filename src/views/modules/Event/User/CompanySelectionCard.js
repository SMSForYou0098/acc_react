import React from "react";
import { Card, Form } from "react-bootstrap";
import Select from "react-select";

const CompanySelectionCard = ({
    companies,
    selectedCompanyId,
    onCompanyChange,
    loading = false
}) => {
    // Transform companies data for react-select format
    const companyOptions = companies?.map(company => ({
        value: company.id,
        label: company.company_name
    }));

    // Find selected option based on selectedCompanyId
    const selectedOption = companyOptions?.find(option => option.value === selectedCompanyId) || null;

    // Handle selection change
    const handleSelectChange = (selectedOption) => {
        const event = {
            target: {
                value: selectedOption ? selectedOption.value : ""
            }
        };
        onCompanyChange(event);
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Company Selection</Card.Title>
                <Form.Group>
                    <Select
                        options={companyOptions}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        isDisabled={loading}
                        isSearchable={true}
                        isClearable={true}
                        placeholder="-- Select Company --"
                        noOptionsMessage={() => "No companies found"}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default CompanySelectionCard;