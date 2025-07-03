import React, { useEffect, useState } from 'react'
import CommonListing from '../CustomUtils/CommonListing'
import { defaultColumnProps } from '../User/UserColumns';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';


const baseColumns = [
  {
    dataField: "id",
    text: "#",
    formatter: (cell, row, rowIndex) => rowIndex + 1,
    ...defaultColumnProps,
  },
  { dataField: "scanner_name", text: "Scanner Name", ...defaultColumnProps },
  { dataField: "organizer_name", text: "Organizer Name", ...defaultColumnProps },
  { dataField: "total_scans", text: "Total Scans", ...defaultColumnProps },
  { dataField: "today_scans", text: "Today's Scans", ...defaultColumnProps },
];

const ScannedReports = () => {
    const {api,authToken} = useMyContext();
    const [loading,setLoading] = useState(false);

    const [scannedData, setScannedData] = useState([]);
    const getScannedReports = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${api}scanned-reports`,{
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            }); // Replace with your API endpoint
            if(response.data.status ) {
                setScannedData(response.data.data ?? []);
            }
        } catch (error) {
            console.error('Error fetching scanned reports:', error);
        } finally {
            setLoading(false);
        }
    }

    // Fetch scanned reports when the component mounts
    useEffect(() => {
        getScannedReports();
    }, []);
    
    return (
    <div>
      <CommonListing
          tile={`Scanned Reports`}
          data={scannedData}
          loading={loading}
          columns={baseColumns}
          searchPlaceholder="Search reports..."
        //   bookingLink={"/dashboard/users/new"}
        //   ButtonLable={"New User"}
        />
    </div>
  )
}

export default ScannedReports
