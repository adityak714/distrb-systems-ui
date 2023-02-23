//code source: https://github.com/weibenfalk/barfinder
import React,{ useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript
} from "@react-google-maps/api";
import './SearchBar.css';
import { Stack, Autocomplete, TextField } from '@mui/material';
import { container, locationOnLoad } from "./mapSettings";
import { dentistries } from '../../data/dentistries';

export type DentistryType = {
    name: string,
    coordinate: google.maps.LatLngLiteral,
    address: string
}

interface IMapViewProps {
    currentView: (id: string) => void;
}

const Map = (props: IMapViewProps) => {
    const [searchResult, setResult] = useState<string | null> (null) 
    
    const dentistriesList: string[] = dentistries.map((dentistry, index) => {return dentistry.name});

    const [clickedDentistry, setClickedDentistry] = React.useState<DentistryType>({} as DentistryType);

    const selectedDentistry = dentistries.find(e => e.name === searchResult)

    const onClicked = (dentistry: DentistryType) => {
        setClickedDentistry(dentistry);
        props.currentView(dentistries.find(dentist => dentistry.name === dentist.name)!.id)
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY!
    });

    const mapReference = React.useRef<google.maps.Map | null>(null);

    const onLoad = (map: google.maps.Map): void => {
        mapReference.current = map;
    };

    const onUnMount = (): void => {
        mapReference.current = null;
    };

    if (!isLoaded) return <div>Loading</div>;
    return (
        <div>
            <div className='search_bar_container'>
                <Stack id='search-bar' spacing={2}>
                    <Autocomplete
                    disablePortal
                    id="combo-box"
                    sx={{ width: 600 , borderRadius: '10px'}}
                    options={dentistriesList}
                    renderInput={(params) => <TextField {...params} label='Search by name or location'/>}
                    value={searchResult}
                    onChange={(event: any, newValue: string | null) => setResult(newValue)}
                    freeSolo
                    /> 
                </Stack>
            </div>

        <GoogleMap
            mapContainerStyle={container}
            center={locationOnLoad}
            onUnmount={onUnMount}
            zoom={12}
        >

        {
            selectedDentistry?.coordinate && 
            (
                <InfoWindow
                position={selectedDentistry.coordinate}
                onCloseClick={() => {
                    setClickedDentistry({} as DentistryType);
                    props.currentView('')
                }}  
                >
                <>
                <div style={{fontFamily: 'Times New Roman', textAlign: 'center'}}>
                    <p>Name: {selectedDentistry.name}</p> 
                    <p>Address: {selectedDentistry.address}</p>
                    <hr/>   
                    <p>Opening hours:</p>
                    <>{
                    Object.keys(selectedDentistry!.openinghours).map((day, index) => (
                        <p style={{fontSize: '15px', marginBottom: '2px'}}>{day?.charAt(0).toUpperCase()}{day?.slice(1)} : {Object.values(selectedDentistry!.openinghours).at(index)}</p>
                    ))
                    }</>
                    <button style={{marginTop: '15px', paddingBottom: '0px', fontSize: '18px', textAlign: 'center'}}onClick={() => props.currentView(dentistries.find(dentist => selectedDentistry.name === dentist.name)!.id)}>Book</button>
                </div>      
                </>         
                </InfoWindow>
            )
        }   

        {
            dentistries.map(dentistry => {
              return (
                  <Marker
                      key={dentistry.name}
                      position={dentistry.coordinate}
                      title={dentistry.name}
                      onClick={() => onClicked(dentistry)}
                  />
              )
            })
        }
        {
            clickedDentistry.coordinate && 
            (
                <InfoWindow
                position={clickedDentistry.coordinate}
                onCloseClick={() => {
                    setClickedDentistry({} as DentistryType)
                    props.currentView('')
                }}  
                >
                <>
                <div style={{fontFamily: 'Arial', textAlign: 'center'}}>
                    <p>Name: {clickedDentistry.name}</p> 
                    <p>Address: {clickedDentistry.address}</p>
                </div>         
                </>         
                </InfoWindow>
            )
        }
        </GoogleMap>
        </div>
  );
};


export default Map;
