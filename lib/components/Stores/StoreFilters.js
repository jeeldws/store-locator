import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './StoreFilters.css'; // Import CSS module

const StoreFilters = ({ onFilterChange, onResetFilters, currentFilters }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const [filters, setFilters] = useState({
        storeName: '',
        zipcode: '',
    });

    useEffect(() => {
        // Update local state whenever the currentFilters change
        setFilters({
            storeName: currentFilters.name ? currentFilters.name.like : '',
            zipcode: currentFilters.zip ? currentFilters.zip.eq : '',
            city_id: currentFilters.city_id ? currentFilters.city_id.like : '',
        });
    }, [currentFilters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const filterObject = {};

        Object.entries(filters).forEach(([key, value]) => {
            console.log(key);
            if (value.trim()) {
                if (key === 'storeName') {
                    filterObject.name = { like: value };
                } else if (key === 'zipcode') {
                    filterObject.zip = { eq: value };
                } else if (key === 'city_id') {
                    filterObject.city_id = { like: value };
                }
            }
        });
        onFilterChange(filterObject);
    };

    const handleReset = () => {
        setFilters({ storeName: '', zipcode: '' }); // Reset local filters
        onResetFilters(); // Call the reset function to clear filters in parent
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
                        name="storeName"
                        placeholder="Store Name"
                        value={filters.storeName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="city_id"
                        placeholder="City"
                        value={filters.city_id}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="zipcode"
                        placeholder="Zipcode"
                        value={filters.zipcode}
                        onChange={handleChange}
                    />
                    <div className={classes.buttonContainer}>
                        <button type="button" onClick={handleReset} className={classes.resetButton}>
                            Reset
                        </button>
                        <button type="submit" className={classes.filterButton}>
                            Filter
                        </button>
                    </div>
                </form>

            )}
        </div>
    );
};

StoreFilters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    onResetFilters: PropTypes.func.isRequired,
    currentFilters: PropTypes.object.isRequired
};

export default StoreFilters;
