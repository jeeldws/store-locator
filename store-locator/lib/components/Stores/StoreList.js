import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { usePagination } from '@magento/peregrine';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import StoreItem from './StoreItem';
import StoreFilters from './StoreFilters';
import GET_STORES from './queries/stores.graphql';
import defaultClasses from './StoreList.css';

const StoreList = ({ onStoreSelect, filters, onFilterSubmit, onResetFilters,selectedStore }) => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const classes = defaultClasses;

    const [runQuery, { loading, data }] = useLazyQuery(GET_STORES, {
        variables: {
            currentPage,
            filters
        },
        fetchPolicy: 'cache-and-network',
        onCompleted: data => {
            setTotalPages(data.stores.total_pages);
        }
    });

    useEffect(() => {
        runQuery();
    }, [currentPage, runQuery, filters]); 

    const handleFilterChange = (filters) => {
        setCurrentPage(1);
        runQuery({
            variables: { currentPage: 1, filters }
        });
        onFilterSubmit(filters);
    };

    const handleStoreClick = (store) => {
        if (onStoreSelect) {
            onStoreSelect(store);
        }
    };

    if (loading) return <p>Loading stores...</p>;

    const storeList = data?.stores?.items.length ? (
        data.stores.items.map(store => (
            <StoreItem key={store.store_id} store={store} onClick={() => handleStoreClick(store)} selectedStore={selectedStore && selectedStore.store_id === store.store_id}/>
        ))
    ) : (
        <p>No stores available.</p>
    );


    return (
        <div className={classes.storeList}>
            <StoreFilters
                onFilterChange={handleFilterChange}
                onResetFilters={onResetFilters} 
                currentFilters={filters} 
            />
            <ul className={classes.storelistcontainer}>{storeList}</ul>
            <Pagination pageControl={{ currentPage, setPage: setCurrentPage, totalPages }} />
        </div>
    );
};

StoreList.propTypes = {
    onStoreSelect: PropTypes.func,
    filters: PropTypes.object.isRequired, 
    onFilterSubmit: PropTypes.func.isRequired,
    onResetFilters: PropTypes.func.isRequired
};

export default StoreList;
