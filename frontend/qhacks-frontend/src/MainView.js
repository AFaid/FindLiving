import React from 'react';
import Listing from './Listing';
import Map from './Map';
import Bar from './Bar';

export default class MainView extends React.Component {
    constructor() {
        super();
        this.state = {
            listings: [],
            distance: 500,
            lat: -1,
            lng: -1,
            beds: '',
            baths: ''
        };
        this.API_URL = 'https://2957c9e6.ngrok.io/property?';
    }
    refreshListings = (lat, lng, beds, baths) => {
        this.setState({lat: lat, lng, lng});
        fetch(this.API_URL + `lat=${lat}&lng=${lng}&beds=${beds}&baths=${baths}`).then(resp => resp.json()).then(data => {
            console.log(data);
            this.setState({
                listings: data.data
            });
        });
    }
    render() {
        if (this.state.listings) {
            return (
                <div>
                    <Bar 
                    
                    onDistanceChange={
                        (e, v) => {
                            this.setState({distance: v});
                        }
                    }
                    
                    onBedroomsChange={
                        (e) => {
                            let value = !isNaN(e.target.value) && parseInt(e.target.value) > 0 ? e.target.value : ''; 
                            this.setState({beds: value});
                            this.refreshListings(this.state.lat, this.state.lng, value, this.state.baths)
                        }
                    }

                    onBathroomsChange={
                        (e) => {
                            let value = !isNaN(e.target.value) && parseInt(e.target.value) > 0 ? e.target.value : ''; 
                            this.setState({baths: value});
                            this.refreshListings(this.state.lat, this.state.lng, this.state.beds, value);
                        }
                    }
                    />
                    <div style={{ width: "50%", float: 'left', marginTop: 54 }}>
                        {
                            this.state.listings                            
                            .map((p, i) => {
                                return <Listing
                                    address={p.address}
                                    link={p.link}
                                    bedrooms={p.bed}
                                    bathrooms={p.bath}
                                    price={p.price}
                                    walkingDistance={p.api_data.duration.value}
                                    unit={p.unit}
                                    key={i}
                                >
                                </Listing>
                            })
                        }
                    </div>
                    <Map
                        listings={this.state.listings}
                        refreshListings={this.refreshListings}
                        distance={this.state.distance}
                    />
                </div>
            );
        } else {
            return <h1>Loading...</h1>
        }
    }
}