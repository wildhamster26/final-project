import React, { Component } from 'react';
import { NavLink, Route, Switch, Link } from 'react-router-dom'
import {
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap'
import ItemDetail from './ItemDetail'
import api from '../../api';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

class MyItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: []
    }
    this.mapRef = React.createRef()
    this.map = null
    this.markers = []
  }
  initMap() {
    // Embed the map where "this.mapRef" is defined in the render
    this.map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [0, 0], // Africa lng,lat
      zoom: 5
    })

    // Add zoom control on the top right corner
    this.map.addControl(new mapboxgl.NavigationControl())
  }
  handleItemSelection(iSelected) {
    this.map.setCenter(this.state.items[iSelected].location.coordinates)
  }
  render() {
    let currentUser = JSON.parse(localStorage.getItem('user'))
    console.log(this.props.location.pathname)
    return (
      <div className="Items">
      
        <Row>
          <Col sm={3} className="col-text">
            <ListGroup>
              {this.state.items.map((h, i) => (
                        <div className="itemCards-container">
                        {this.state.items.map(item => <ItemCard key={item._id} name={item.title} pictures={item.pictures } pricePerPeriod={item.pricePerPeriod} period={item.period} description={item.description} />) }
                      </div>
                <ListGroupItem key={h._id} action tag={NavLink} to={"/myitems/" + h._id} onClick={() => this.handleItemSelection(i)}>
                  {h.title} by {h._owner.email}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col sm={4} className="col-text">
            <Link to={this.props.location.pathname + "/edit"}><button>Edit item</button></Link>
            <Switch>
              <Route path="/myitems/:id" render={(props) => <ItemDetail {...props} items={this.state.items} />} />
              <Route render={() => <h2>Select an item</h2>} />
            </Switch>
          </Col>
          <Col sm={5}>
            <div ref={this.mapRef} className="map"></div>
          </Col>
        </Row>
        
      </div>
    );
  }
  componentDidMount() {
    api.getItems()
      .then(items => {
        // console.log('here', items)
        this.setState({
          items: items.map(item => {
            const [lng, lat] = item.location.coordinates
            return {
              ...item,
              marker: new mapboxgl.Marker({ color: 'red' })
                .setLngLat([lng, lat])
                .on('click', () => { console.log("clicked") })
                .addTo(this.map)
            }
          })
        })
      })
      .catch(err => console.log(err))
    this.initMap()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let center = [position.coords.longitude,position.coords.latitude]
        this.map.setCenter(center)
      })
    }
  }
}

export default MyItems;
