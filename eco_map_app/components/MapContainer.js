import React, { useState, useRef, useEffect, useMemo } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Alert } from 'react-native';
import BottomSheetMapView from './BottomSheetMapView';

import { navigate } from '../services/navigationService';

export default function MapContainer({ region, mapRef, collectionPoints, filters, collectionTypes}) {
    const [buttonPos, setButtonPos] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const bottomSheetRef = useRef(null);

    const markerRef = useRef(null);
    
    const handleMarkerPress = (marker) => {
        setSelectedMarker(marker);
        bottomSheetRef.current?.snapToIndex(0);
    };

    async function handleMapPress(event) {
        if (selectedMarker) {
            bottomSheetRef.current?.close();
        }
        if (buttonPos !== null) {
            setButtonPos(null);
            setLatitude(null);
            setLongitude(null);
        } else {
            const coordinate = event.nativeEvent.coordinate;
            setLatitude(coordinate.latitude);
            setLongitude(coordinate.longitude);
            setButtonPos(coordinate);
        }
    }

    async function handleButtonPress() {
        try {
            navigate('AddPointForm', {
                latitude,
                longitude
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar o ponto');
            console.log(error)
        }
    }

    const filteredCollectionPoints = useMemo(() => {
        if (!collectionTypes || collectionTypes.length === 0) {
            return filters.length === 0 ? collectionPoints : [];
        }
        if (filters.length === 0) {
            return collectionPoints;
        }
        return collectionPoints.filter(point =>
            point.types.some(typeId => {
                const typeObject = collectionTypes.find(ct => ct.id === typeId);
                return typeObject && filters.includes(typeObject.name);
            })
        );
    }, [collectionPoints, filters, collectionTypes]);


    useEffect(() => {
        if (buttonPos && markerRef.current) {
            markerRef.current?.showCallout();
        }
    }, [buttonPos]);

    return (
        <View style={{ flex:1 }}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton={false}
                onPress={handleMapPress}
            >
                {filteredCollectionPoints.map(point => {
                    return (
                        <Marker
                        key={point.id}
                        coordinate={{
                            latitude: Number(point.latitude),
                            longitude: Number(point.longitude),
                        }}
                        onPress={() => handleMarkerPress(point)}
                        />
                    );
                })}
                {buttonPos && (
                    <Marker
                        coordinate={buttonPos}
                        ref={markerRef}
                        onPress={handleButtonPress}
                        image={require('../assets/custom-marker.png')}
                    >
                    </Marker>
                )}
            </MapView>
            <BottomSheetMapView
                selectedMarker={selectedMarker}
                setSelectedMarker={setSelectedMarker}
                collectionPoints={collectionPoints}
                navigate={navigate}
                bottomSheetRef={bottomSheetRef}
            />
        </View>
    );
}