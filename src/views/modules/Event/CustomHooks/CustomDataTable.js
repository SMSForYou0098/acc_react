import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import styled from 'styled-components';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import CommonHeader from '../CustomUtils/CommonHeader';

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

const CustomDataTable = (props) => {
    const {
        title,
        data,
        columns,
        loading,
        keyField = 'id',
        searchPlaceholder = 'Search...',
        ExportPermisson,
        tile,
        setDateRange,
        bookingLink,
        buttonLable,
       ignoredColumnsProp = []
    } = props;
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
    // Add this function before the return statement

    // ...existing code...
    const handleExport = () => {
        try {
            // Prepare the data for export
            const ignoredColumns = ['Action', 'Actions', 'action', ...ignoredColumnsProp];
            console.log( 'ignored columns:', ignoredColumns);
            const exportData = filteredData?.map(row => {
                const rowData = {};
                columns.forEach(column => {
                    // Skip action columns
                    if (ignoredColumns.includes(column.text) || ignoredColumns.includes(column.dataField)) {
                        return;
                    }


                    let value;

                    // Handle nested data using column.formatter or direct value
                    if (column.formatter) {
                        value = column.formatter(row[column.dataField], row);
                    } else {
                        value = row[column.dataField];
                    }

                    // If value is an array, join as comma-separated string
                    if (Array.isArray(value)) {
                        rowData[column.text] = value
                            .map(v => (typeof v === 'string' ? v.trim() : v))
                            .filter(v => v && v !== ',' && v !== '')
                            .join(', ');
                    }
                    // If value is a React element, extract text content
                    else if (value && typeof value === 'object' && value.props) {
                        // Try to extract text from children recursively
                        const extractText = (children) => {
                            if (typeof children === 'string') return children;
                            if (Array.isArray(children)) return children.map(extractText).join(', ');
                            if (children && typeof children === 'object' && children.props) {
                                return extractText(children.props.children);
                            }
                            return '';
                        };
                        rowData[column.text] = extractText(value.props.children) || value.props.title || '';
                    }
                    // For other types
                    else {
                        rowData[column.text] = value;
                    }
                });
                return rowData;
            });

            // Create a new workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Data');

            // Generate filename with current date
            const date = new Date().toISOString().split('T')[0];
            const fileName = `${title || 'export'}_${date}.xlsx`;

            // Save the file
            XLSX.writeFile(wb, fileName);
        } catch (error) {
            console.error('Export failed:', error);
            // You might want to add error handling/notification here
        }
    };
    // ...existing code...

    return (
        <>
            <CommonHeader
                tile={tile}
                disableExport={!filteredData?.length || !ExportPermisson}
                setDateRange={setDateRange}
                bookingLink={bookingLink}
                ExportPermisson={ExportPermisson}
                handleExport={handleExport}
                searchPlaceholder={searchPlaceholder}
                searchTerm={searchTerm}
                buttonLable={buttonLable}
                setSearchTerm={setSearchTerm}
            />
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

export default CustomDataTable;