import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import GET_STORES from './queries/stores.graphql';

const MapComponent = ({ selectedStore }) => {
    const { loading, error, data } = useQuery(GET_STORES);
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
        }
    }, [data]);

    useEffect(() => {
        if (selectedStore) {
            setCenter({
                lat: parseFloat(selectedStore.latitude),
                lng: parseFloat(selectedStore.longitude)
            });
            const newZoom = Math.random() < 0.5 ? 14 : 15;
            setZoom(newZoom); // Set to random zoom level
        }
    }, [selectedStore]);

    const handleMarkerClick = (store) => {
        setCenter({
            lat: parseFloat(store.latitude),
            lng: parseFloat(store.longitude)
        });
        const newZoom = Math.random() < 0.5 ? 14 : 15;
        setZoom(newZoom); // Set to random zoom level
    };

    const constructImageUrl = (relativePath) => {
        return `${window.location.origin}/media/storelocator/images/${relativePath}`;
    };

    const getIcon = (relativePath) => {
        const iconUrl = constructImageUrl(relativePath);
        return {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(30, 30) // Set the size of the icon (width, height)
        };
    };

    if (loading) return <p>Loading map...</p>;
    if (error) return <p>Error loading map</p>;

    return (
        <LoadScript
            googleMapsApiKey="" // Add your Google Maps API key here
            onLoad={() => setGoogleMapsApiLoaded(true)} // Set state to true when the API is loaded
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
                        icon={getIcon(store.thumb_image)}
                        onClick={() => handleMarkerClick(store)}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

MapComponent.propTypes = {
    selectedStore: PropTypes.shape({
        latitude: PropTypes.string.isRequired,
        longitude: PropTypes.string.isRequired
    })
};

export default MapComponent;
