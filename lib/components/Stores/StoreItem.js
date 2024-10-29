import React from 'react';
import PropTypes from 'prop-types';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './StoreItem.css'; // Import CSS

const StoreItem = ({ store, onClick, selectedStore }) => {
    const { name, address, store_image, store_phone, store_email } = store;
    const classes = defaultClasses;


    return (
        <li onClick={onClick} className={`${classes.storeitem} ${selectedStore ? classes.active : ''}`}>
            <Image alt={name} resource={store_image} className={classes.storeimage} />
            <div className={classes.storedetails} >
                <h2>{name}</h2>
                <p>{address}</p>
                <a href="#">{store_phone}</a>
                <p>{store_email}</p>
            </div>
        </li>
    );
};

StoreItem.propTypes = {
    store: PropTypes.shape({
        store_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        store_image: PropTypes.string.isRequired,
        store_phone: PropTypes.string.isRequired,
        store_email: PropTypes.string.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default StoreItem;
