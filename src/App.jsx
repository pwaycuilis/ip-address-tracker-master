import { useState, useEffect, useRef } from 'react'
// import './App.css'
import API_BASE_URL from './config';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';




import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const CustomMarkerIcon = L.icon({
  iconUrl: '../images/icon-location.svg',
  iconSize: [40, 50]
})


function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const mapRef = useRef(null)
  const position = [51.505, -0.09];

  const [searchType, setSearchType] = useState('ipAddress');

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const checkScreenSize = () => {
    setIsLargeScreen(window.matchMedia('(min-width: 45em)').matches);
  }

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);


  const checkIfSearchQueryIsDomainSearch = (query) => {
    const regExp = /[a-zA-Z]/;

    if (regExp.test(query)) {
      return true;
    }

    return false;
  }
  

  const fetchData = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '&' + searchType + '=' + searchQuery);
      setData(response.data);
      setLatitude(response.data.location.lat);
      setLongitude(response.data.location.lng);

      // console.log(response.data.location.lat);
      // console.log({latitude});

      // console.log(response.data.location.lng);
      // console.log({longitude});
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {


    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLatitude(null);
    setLongitude(null);

    fetchData();
  }

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
    if (checkIfSearchQueryIsDomainSearch(e.target.value)) {
      setSearchType('domain');
    } else {
      setSearchType('ipAddress');
    }

  }
  return (
    <>
      <header>
        <h1>IP Address Tracker</h1>
        <div className="search-bar">

          <form className="search-bar__form"
            onSubmit={handleSubmit}>
            <input
              className="search-bar__input active"
              type="text"
              placeholder="Search for any IP address or domain"
              value={searchQuery}
              onChange={handleSearchQueryChange}

            ></input>
            <button type="submit" className="button-search active"><img className="icon-arrow" src="../images/icon-arrow.svg"></img></button>
          </form>
        </div>
      </header>
      
      
      <main>
        { data ? (
          <div className="data-card">

            <div className="item-container">
              <div className="item-label">IP Address</div>
              <div className="item-content">{ data.ip }</div>
            </div>
            { isLargeScreen ? (<div className="vl"></div>) : <></>}
            { data.location ? (
              <>
                <div className="item-container">
                  <div className="item-label">Location</div>
                  <div className="item-content">{data.location.city}, {data.location.region} {data.location.postalCode}</div>
                </div>
                { isLargeScreen ? (<div className="vl"></div>) : <></>}
                <div className="item-container">
                  <div className="item-label">Timezone</div>
                  <div className="item-content">UTC { data.location.timezone ? data.location.timezone : ""}</div>
                </div>
                { isLargeScreen ? (<div className="vl"></div>) : <></>}
            </>

            ) : <p>Loading...</p>}
            
            <div className="item-container">
              <div className="item-label">ISP</div>
              <div className="item-content">{ data.isp }</div>
            </div>
          
          </div>
        ) : 
        <div>loading...</div>}
        
        
      </main>

      <article>
      { (latitude && longitude ) ? (
          <div id="map">
            <MapContainer ref={mapRef} center={[ latitude ? latitude : position[0], longitude ? longitude : position[1]]} zoom={13} 
            scrollWheelZoom={true} style={{ height: '100%', width: '100%'}}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[ latitude ? latitude : position[0], longitude ? longitude : position[1]]}
              icon={CustomMarkerIcon}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
            </div>

        ) : 
        <div>loading...</div>
      }
      </article>

    </>
  )
}

export default App
