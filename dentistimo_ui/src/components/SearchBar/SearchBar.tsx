import React, { useState } from 'react';
import './SearchBar.css';
import { dentistries } from '../../data/dentistries';
import { Stack, Autocomplete, TextField } from '@mui/material';
import Map, { DentistryType } from '../../components/GoogleMapsApi/Map';

const SearchBar = () => {

    const [value, setValue] = useState<string | null> (null) 
    const dentistriesList: string[] = dentistries.map((dentistry, index) => {return dentistry.name});
    
    return (
        <Stack id='search-bar' spacing= {2}>
            <Autocomplete
            disablePortal
            id="combo-box"
            sx={{ width: 600 , borderRadius: '10px'}}
            options={dentistriesList}
            renderInput={(params) => <TextField {...params} label='Search by name or location'/>}
            value={value}
            onChange={(event: any, newValue: string | null) => setValue(newValue)}
            freeSolo
            /> 
        </Stack>
    )
}

export default SearchBar;
