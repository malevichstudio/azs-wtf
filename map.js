import React, { Component } from 'react';
import Style from "./Style";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import Error from "../Error";
import Loader from "../Loader";
import Marker from "./Marker";
import MarkerClusterGroup from './MarkerClusterGroup';

class Map extends Component {
    state = {
        lat: 55.75222,
        lng: 37.61556,
        zoom: null,
    };

    mapRef = React.createRef();

    componentDidMount() {
        const { filterByAllRegions, stations, loading, updateStationsInView } = this.props;
        if (stations.length < 1 && filterByAllRegions !== undefined && !loading) {
            filterByAllRegions();
        }
        this.setInitValues();
        updateStationsInView(stations, this.mapRef, this.state.zoom);
    }
    componentDidUpdate(prevProps) {
        const { region, regions, updateStationsInView, stations, center} = this.props;

        if (center.lat !== prevProps.center.lat || center.lng !== prevProps.center.lng) {
            this.setState({
                lat: center.lat,
                lng: center.lng,
                zoom: 16,
            });
        }

        if (region !== prevProps.region) {
            const { latitude, longitude } = regions.find(model => model.id === region);
            this.setState({
                lat: latitude,
                lng: longitude,
            });
        }
        if (stations.length !== prevProps.stations.length) {
            updateStationsInView(stations, this.mapRef, this.state.zoom);
        }
    }

    onViewportChanged = viewport => {
        const { updateStationsInView, stations } = this.props;
        updateStationsInView(stations, this.mapRef, viewport.zoom);
        this.setState({
            lat: viewport.center[0],
            lng: viewport.center[1],
            zoom: viewport.zoom,
        });
        localStorage.setItem(`lat`, viewport.center[0]);
        localStorage.setItem(`lng`, viewport.center[1]);
        localStorage.setItem(`zoom`, viewport.zoom);
    };

    setInitValues = () => {
        const { region, regions } = this.props;
        const { latitude, longitude } = regions.find(model => model.id === region);

        let lat = localStorage.getItem('lat');
        let lng = localStorage.getItem('lng');
        let zoom = localStorage.getItem('zoom');
        if (!zoom) {
            zoom = 11;
        }
        if (!lat || !lng) {
            lat = latitude;
            lng = longitude;
        }
        this.setState({
            zoom: parseInt(zoom),
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        });
    };
    

    render() {
        const {
            classes, error, loading, setActiveStation, stationsInView,
            activeStation, setHoveredStation, executeScroll, hoveredStation
        } = this.props;

        const { lat, lng, zoom } = this.state;
        if (error) return <Error error={error} />;
        if (loading) return <Loader />;

        return (
            <LeafletMap
                center={[lat, lng]}
                zoom={zoom}
                maxZoom={18}
                zoomControl={false}
                className={classes.map}
                onViewportChanged={this.onViewportChanged}
                ref={this.mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                    {stationsInView.map(station => {
                        return (
                            <Marker
                                station={station}
                                images={station.fuel_station_pictures.filter(image => !!image.image_key)}
                                key={station.id}
                                setActiveStation={setActiveStation}
                                active={station.id === activeStation}
                                setHoveredStation={setHoveredStation}
                                executeScroll={executeScroll}
                                isHovered={station.id === hoveredStation}
                            />
                        )
                    })}
                </MarkerClusterGroup>
            </LeafletMap>
        );
    }
}

Map.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    region: PropTypes.number,
    regions: PropTypes.array.isRequired,
    setActiveStation: PropTypes.func.isRequired,
    activeStation: PropTypes.number,
    updateStationsInView: PropTypes.func.isRequired,
    setHoveredStation: PropTypes.func.isRequired,
    executeScroll: PropTypes.func.isRequired,
    hoveredStation: PropTypes.number,
    center: PropTypes.object.isRequired,
    stationsInView: PropTypes.array.isRequired,
};

export default withStyles(Style)(Map);
