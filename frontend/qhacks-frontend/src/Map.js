import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import MapIcon from './MapIcon';
import './App.css';

const Marker = props => {
  return <>
    <div className="pin"></div>
    <div className="pulse"></div>
  </>
}

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.GOOGLE_MAP_API_KEY = 'AIzaSyDdB4zEdQh5Ma5zNy_SX1_QzYNliMee_tk';
    this.state = {
      center: {
        lat: 43.6426,
        lng: -79.3871
      },
      zoom: 15.6,
      showCenterMarker: true
    }
    navigator.geolocation.getCurrentPosition(pos => {
      this.props.refreshListings(pos.coords.latitude, pos.coords.longitude);
      this.setState({
        center: {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }
      });
    });
  }
  
  handleClick = (e) => {
    this.setState({
      center : {
        lat: e.lat,
        lng: e.lng
      },
      showCenterMarker: true
    });
    this.props.refreshListings(e.lat, e.lng);
  }

  hideMarker = (e) => {
    this.setState({
      showCenterMarker: false
    });
    this.props.refreshListings(e.lat, e.lng);
  }
  render() {
    return (
      <div style={{ height: '100vh', width: '50%', position: 'fixed', top: 64.2, right: 0 }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: this.GOOGLE_MAP_API_KEY }}
          center={this.state.center}
          defaultZoom={this.state.zoom}
          id="map"
          onClick={this.handleClick}
        >
          {this.props.listings.map((p, i) => {
            return <MapIcon
              lat={p.location.lat}
              lng={p.location.lng}
              text={`$${p.price} CAD`}
              withinDistance={p.api_data.distance.value < this.props.distance}
              key={i}
            />
          })}
          {this.state.showCenterMarker ? <Marker lat={this.state.center.lat} lng={this.state.center.lng} onClick={this.hideMarker}></Marker> : null}
          
        </GoogleMapReact>
      </div>
    )
  }
}