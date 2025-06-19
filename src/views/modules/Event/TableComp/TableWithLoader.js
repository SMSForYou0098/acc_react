import React, { forwardRef } from 'react'
import { Spinner, Table } from 'react-bootstrap'

const TableWithLoader = forwardRef(({ loading, columns }, ref) => {
    // console.log(columns)
    return (
        <div className="table-responsive">
            {loading ? (
                <Table>
                    <thead>
                        <tr>
                            {columns?.map((column, index) => (
                                <th key={index}>{column?.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={columns?.length} className='text-center'>
                                <Spinner animation="border" variant="primary" className="mb-3" />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <table
                    id="datatable-ecom"
                    ref={ref}
                    className="data-tables table custom-table movie_table"
                />
            )}
        </div>
    );
});

export default TableWithLoader
