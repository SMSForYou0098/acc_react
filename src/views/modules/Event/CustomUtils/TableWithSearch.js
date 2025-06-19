import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import styled from 'styled-components';
import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from 'lucide-react';
import CommonDateRange from '../CustomHooks/CommonDateRange';

const StyledPaginationWrapper = styled.div`
  .row.react-bootstrap-table-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .react-bootstrap-table-pagination-list {
    margin-left: auto;
    display: flex;
    justify-content: flex-end;
  }

  .pagination {
    margin-bottom: 0;
    justify-content: flex-end;
  }
table td{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

const TableWithSearch = ({
    title,
    data,
    columns,
    loading,
    keyField = 'id',
    searchPlaceholder = 'Search...',
    setDateRange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (data?.length > 0) {
            const getAllValues = (obj) => {
                let values = [];
                for (let key in obj) {
                    if (obj[key] !== null && obj[key] !== undefined) {
                        if (typeof obj[key] === 'object') {
                            values = values.concat(getAllValues(obj[key]));
                        } else {
                            values.push(obj[key]?.toString().toLowerCase());
                        }
                    }
                }
                return values;
            };

            const filtered = data?.filter(item => {
                const searchableValues = getAllValues(item);
                return searchableValues?.some(value =>
                    value?.includes(searchTerm.toLowerCase())
                );
            });
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [searchTerm, data]);

    useEffect(() => {
        const paginationElement = document.querySelector('.row.react-bootstrap-table-pagination');
        if (paginationElement) {
            paginationElement.style.marginTop = '1rem';

            // Get the pagination list container
            const paginationListContainer = paginationElement.querySelector('.react-bootstrap-table-pagination-list');
            if (paginationListContainer) {
                paginationListContainer.style.display = 'flex';
                paginationListContainer.style.justifyContent = 'flex-end';
            }

            // Get the rows info container
            const rowsInfoContainer = paginationElement.querySelector('.col-md-6.col-xs-6.col-sm-6.col-lg-6');
            if (rowsInfoContainer) {
                rowsInfoContainer.style.textAlign = 'left';
            }
        }
    }, [filteredData]);

    const defaultPaginationOptions = {
        page: currentPage,
        sizePerPage: 15,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: false,
        showTotal: true,
        paginationSize: 5,
        alwaysShowAllBtns: true,
        firstPageText: '⟨⟨',
        prePageText: '⟨',
        nextPageText: '⟩',
        lastPageText: '⟩⟩',
        classes: 'custom-pagination',
        pageButtonClass: 'custom-page-btn',
        sizePerPageDropdownClass: 'custom-dropdown'
    };


    return (
        <>
            <div className="row mb-3 me-0">
                <div className="col-12">
                    <div className="d-flex flex-md-row justify-content-end gap-2">
                        {setDateRange && (
                            <div className="col-6 col-md-3 d-flex justify-content-end ps-3">
                                <CommonDateRange setState={setDateRange} removeClass={true} />
                            </div>
                        )}
                        <div className="col-6 col-md-3">
                            <InputGroup>
                                <Form.Control
                                    className="py-2"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer">
                                    <Search size={16} />
                                </span>
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
            <StyledPaginationWrapper>
                <BootstrapTable
                    bootstrap4
                    keyField={keyField}
                    data={loading ? [] : filteredData}
                    columns={columns}
                    pagination={paginationFactory({
                        ...defaultPaginationOptions,
                        totalSize: filteredData?.length,
                        onPageChange: (page) => setCurrentPage(page)
                    })}
                    filter={filterFactory()}
                    noDataIndication={() => (
                        <div className="text-center">
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span>Loading data...</span>
                                </div>
                            ) : (
                                "No data found"
                            )}
                        </div>
                    )}
                    striped
                    hover
                    wrapperClasses="table-responsive"
                    classes="table align-middle"
                    sort={{
                        sortCaret: (order) => {
                            if (!order) return (<ChevronsUpDown color='grey' className="ms-1" size={14} />);
                            else if (order === 'asc') return (<ChevronUp color='grey' className="ms-1" size={14} />);
                            else if (order === 'desc') return (<ChevronDown color='grey' className="ms-1" size={14} />);
                            return null;
                        }
                    }}
                />
            </StyledPaginationWrapper>
        </>
    );
};

export default TableWithSearch;