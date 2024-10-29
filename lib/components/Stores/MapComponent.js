import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import GET_STORES from './queries/stores.graphql';

const MapComponent = ({ filters, selectedStore, onStoreSelect}) => {
    const { loading, error, data } = useQuery(GET_STORES, {
        variables: { filters, all: true }
    });
    console.log(data);
    
    const mapContainerStyle = {
        width: '100%',
        height: '568px',
        borderRadius: '10px'
    };

    const [center, setCenter] = useState({ lat: 0, lng: 0 }); // Default coordinates
    const [zoom, setZoom] = useState(14); // Default zoom level
    const [googleMapsApiLoaded, setGoogleMapsApiLoaded] = useState(false); // State to track if Google Maps API is loaded

    useEffect(() => {
        if (data?.stores?.items.length) {
            const firstStore = data.stores.items[0];
            setCenter({
                lat: parseFloat(firstStore.latitude),
                lng: parseFloat(firstStore.longitude)
            });
            onStoreSelect(firstStore);
        }
    }, [data]);

    useEffect(() => {
        if (selectedStore) {
            setCenter({
                lat: parseFloat(selectedStore.latitude),
                lng: parseFloat(selectedStore.longitude)
            });
            const newZoom = Math.random() < 0.5 ? 14.00000001 : 14.00000002;
            setZoom(newZoom);
        }
    }, [selectedStore]);

    const handleMarkerClick = (store) => {
        setCenter({
            lat: parseFloat(store.latitude),
            lng: parseFloat(store.longitude)
        });
        const newZoom = Math.random() < 0.5 ? 14.00000001 : 14.00000002;
        setZoom(newZoom); 
        onStoreSelect(store);
    };

    const constructImageUrl = (relativePath) => {
        return `${window.location.origin}/media/storelocator/images/${relativePath}`;
    };

    const getIcon = (store) => {
        const iconUrl = constructImageUrl(store.thumb_image);
        const isSelected = selectedStore && selectedStore.store_id === store.store_id;
        return {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(isSelected ? 60 : 30, isSelected ? 60 : 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15)
        };
    };
    

    if (loading) return <p>Loading map...</p>;
    if (error) return <p>Error loading map</p>;

    return (
        <LoadScript
            googleMapsApiKey=""
            onLoad={() => setGoogleMapsApiLoaded(true)} 
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={zoom}
            >
                {googleMapsApiLoaded && data?.stores?.items.map(store => (
                    <Marker
                        key={store.store_id}
                        title={store.name}
                        position={{ lat: parseFloat(store.latitude), lng: parseFloat(store.longitude) }}
                        icon={getIcon(store)}
                        onClick={() => handleMarkerClick(store)}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

MapComponent.propTypes = {
    filters: PropTypes.object.isRequired,
    selectedStore: PropTypes.shape({
        latitude: PropTypes.string.isRequired,
        longitude: PropTypes.string.isRequired
    }),
    onStoreSelect: PropTypes.func
};

export default MapComponent;
