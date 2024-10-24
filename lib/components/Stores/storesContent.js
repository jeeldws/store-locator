import React, { Fragment } from 'react';
import { shape, arrayOf, number, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import defaultClasses from './storesContent.css'; 
import Image from '@magento/venia-ui/lib/components/Image';
import { APIProvider, GoogleMap, Marker } from '@vis.gl/react-google-maps';

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

    return (
        <div className={classes.storeContainer}>
            <div className={classes.leftSection}>
                {content}
            </div>
            <div className={classes.rightSection}>
                <APIProvider apiKey=""> {/* Leave the apiKey empty for development purposes */}
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                        center={defaultCenter}
                        zoom={10}
                    >
                        {data.items && data.items.map(store => (
                            <Marker
                                key={store.store_id}
                                position={{ lat: store.latitude, lng: store.longitude }}
                                title={store.name}
                            />
                        ))}
                    </GoogleMap>
                </APIProvider>
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
