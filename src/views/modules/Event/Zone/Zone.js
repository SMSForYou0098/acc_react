import React from 'react';
import GenericEntityManager from '../Common/GenericEntityManager';

const Zone = () => {
    const formFields = [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true
        },
        {
            name: 'description',
            label: 'Description',
            type: 'text',
            required: false
        },
        {
            name: 'status',
            label: 'Status',
            type: 'checkbox',
            required: false
        }
    ];    
    return (
        <GenericEntityManager
            entityName="Zone"
            entityNamePlural="Zones"
            apiEndpoint="zone"
            formFields={formFields}
            cardSize={12}
            noCard={true}
        />
    )
}

Zone.displayName = "Zone";
export default Zone;