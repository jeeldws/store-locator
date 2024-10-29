import React, { useState, useEffect } from 'react';
import StoreList from './StoreList';
import MapComponent from './MapComponent';
import defaultClasses from './StoreLocator.css'; // Import CSS
import { FormattedMessage } from 'react-intl';

const StoreLocator = () => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [appliedFilters, setFilters] = useState({});
    const classes = defaultClasses;

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
    };

    const handleFilterChange = (filterApplied) => {
        setFilters(filterApplied);
    };

    const handleResetFilters = () => {
        setFilters({}); // Clear the filters
    };

    // Set the page title based on the selected store or a default title
    useEffect(() => {
        document.title = selectedStore ? `Store Locator - ${selectedStore.name}` : 'Store Locator'; // Set title based on selected store

        // Optional: cleanup function if needed
        return () => {
            document.title = 'Store Locator'; // Reset title on unmount
        };
    }, [selectedStore]); // Runs whenever selectedStore changes

    return (
        <div className={classes.root}>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="signInPage.header"
                    defaultMessage="Stores"
                />
            </h1>
            <div className={classes.storelocator}>
                <StoreList
                    selectedStore={selectedStore}
                    onStoreSelect={handleStoreSelect}
                    filters={appliedFilters}
                    onFilterSubmit={handleFilterChange}
                    onResetFilters={handleResetFilters} // Pass the reset function to StoreList
                />
                <div className={classes.rightsection}>
                    <MapComponent selectedStore={selectedStore} filters={appliedFilters} onStoreSelect={handleStoreSelect} />
                </div>
            </div>
        </div>
    );
};

export default StoreLocator;
