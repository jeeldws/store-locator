import React, { useState } from 'react';
import StoreList from './StoreList';
import MapComponent from './MapComponent';
import defaultClasses from './StoreLocator.css'; // Import CSS

const StoreLocator = () => {
    const [selectedStore, setSelectedStore] = useState(null);
    const classes = defaultClasses;

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
    };

    return (
        <div>
            <h1>
                Stores
            </h1>
            <div className={classes.storelocator}>
                <StoreList onStoreSelect={handleStoreSelect} />
                <div className={classes.rightsection}>
                    <MapComponent selectedStore={selectedStore} />
                </div>
            </div>
        </div>
    );
};

export default StoreLocator;
