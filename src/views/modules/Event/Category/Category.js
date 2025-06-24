import React from 'react';
import GenericEntityManager from '../Common/GenericEntityManager';

const Category = () => {
    const formFields = [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true
        },
        {
            name: 'background_image',
            label: 'Background Image',
            type: 'file',
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
            entityName="Category"
            entityNamePlural="Categories"
            apiEndpoint="category"
            formFields={formFields}
            cardSize={12}
            noCard={true}
        />
    )
}

Category.displayName = "Category";
export default Category;