import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { get } from 'lodash';

const UserCard = () => {
const { api, authToken } = useMyContext();
const {orderId}= useParams();
    const getCardData = async () => {
    try {
      const response = await axios.get(`${api}gan-card/${orderId}`, {
        headers: {
          Authorization: "Bearer " + authToken,
        },
      });

      console.log('response',response)
    } catch (error) {
      console.error("Failed to fetch zones:", error);
      // Optional: show user alert
    }
  };

  useEffect(()=>{
    getCardData();
  },[orderId])

  return (
    <div>
      ghgh
    </div>
  )
}

export default UserCard
