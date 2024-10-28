import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { usePagination } from '@magento/peregrine';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import StoreItem from './StoreItem';
import StoreFilters from './StoreFilters';
import GET_STORES from './queries/stores.graphql';
import defaultClasses from './StoreList.css'; // Import CSS

const StoreList = ({ onStoreSelect }) => {
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const classes = defaultClasses;
    const filters = {'store_id':1};

    // Define pageSize as a constant
    const pageSize = 3;

    const [runQuery, { loading, data }] = useLazyQuery(GET_STORES, {
        variables: {
            currentPage,
            pageSize,
            filters
        },
        fetchPolicy: 'cache-and-network',
        onCompleted: data => {
            setTotalPages(data.stores.total_pages);
        }
    });

    useEffect(() => {
        runQuery();
    }, [currentPage, runQuery]);

    const handleFilterChange = (filters) => {
        console.log(filters);
        setCurrentPage(1);
        runQuery({
            variables: { currentPage: 1, pageSize, filters } 
        });
    };

    const handleStoreClick = (store) => {
        if (onStoreSelect) {
            onStoreSelect(store);
        }
    };

    if (loading) return <p>Loading stores...</p>;

    const storeList = data?.stores?.items.map(store => (
        <StoreItem key={store.store_id} store={store} onClick={() => handleStoreClick(store)} />
    ));

    return (
        <div className={classes.storeList}>
            <StoreFilters onFilterChange={handleFilterChange} />
            <ul className={classes.storelistcontainer}>{storeList}</ul>
            <Pagination pageControl={{ currentPage, setPage: setCurrentPage, totalPages }} />
        </div>
    );
};

StoreList.propTypes = {
    onStoreSelect: PropTypes.func,
    pageSize: PropTypes.number
};

export default StoreList;
