import React, { Fragment } from 'react';
import { shape, arrayOf, number, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import defaultClasses from './storesContent.css';
import Image from '@magento/venia-ui/lib/components/Image';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const StoresContent = props => {
    const { data, pageControl } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const listItems = data && data.items ? data.items.map(store => {
        const { store_id, name, address, store_image } = store;

        return (
            <li key={store_id} className={classes.storeItem}>
                <div>
                    <div className={classes.item}>
                        <Image className={classes.leftSection}
                            alt={name}
                            resource={store_image}
                        />
                    </div>
                    <div className={classes.item}>
                        <span className={classes.value}>{name}</span>
                        <span className={classes.value}> {address}</span>
                    </div>
                </div>
            </li>
        );
    }) : '';
    const content =
        data && data.total_count === 0 ? (
            <p>
                <FormattedMessage
                    id={'storesContent.notFound'}
                    defaultMessage={'Sorry! We couldn\'t find any stores.'}
                />
            </p>
        ) : (
            <Fragment>
                <ul>{listItems}</ul>
                <div>
                    <Pagination pageControl={pageControl} />
                </div>
            </Fragment>
        );
    const mapContainerStyle = {
        width: '100%',
        height: '400px'
    };

    const defaultCenter = {
        lat: data && data.items ? parseFloat(data.items[0].latitude) : 0.0000,
        lng: data && data.items ? parseFloat(data.items[0].longitude) : 0.000
    };
    console.log(data.items);
    return (
        <div className={classes.storeContainer}>
            <div className={classes.leftSection}>
                {content}
            </div>
            <div className={classes.rightSection}>
                <LoadScript googleMapsApiKey="">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={defaultCenter}
                        zoom={15}
                    >
                        {data && data.items ? data.items && data.items.map(store => (
                            <Marker
                                key={store.store_id}
                                title={store.name}
                                position={{ lat: parseFloat(store.latitude), lng: parseFloat(store.longitude) }}
                            />
                        )) : ''}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

StoresContent.prototype = {
    data: shape({
        items: arrayOf(
            shape({
                store_id: number.isRequired,
                address: string.isRequired,
                store_image: string.isRequired,
                content: string
            })
        )
    }).isRequired
};

export default StoresContent;
