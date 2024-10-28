import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from './StoreFilters.css'; // Import CSS module

const StoreFilters = ({ onFilterChange }) => {
    const [storeName, setStoreName] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        onFilterChange({storeName, zipcode });
    };

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={classes.storelocator}>
            <div 
                className={`${classes.accordionHeader} ${isOpen ? classes.active : ''}`} 
                onClick={toggleAccordion}
            >
                <h3>{isOpen ? 'Hide Filters' : 'Show Filters'}</h3>
                <span className={`${classes.accordionArrow} ${isOpen ? classes.open : ''}`}></span>
            </div>
            {isOpen && (
                <form onSubmit={handleFilterSubmit} className={classes.filterForm}>
                    <input 
                        type="text" 
                        placeholder="Store Name" 
                        value={storeName} 
                        onChange={(e) => setStoreName(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Zipcode" 
                        value={zipcode} 
                        onChange={(e) => setZipcode(e.target.value)} 
                    />
                    <button type="submit">Filter</button>
                </form>
            )}
        </div>
    );
};

StoreFilters.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};

export default StoreFilters;
