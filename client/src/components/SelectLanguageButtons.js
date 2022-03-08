import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import i18n from '../i18n';

const SelectLanguageButtons = () => {

    function changeLocale (l) {
        i18n.changeLanguage(l);
    }
    
    const [alignment, setAlignment] = useState('pl');

    const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
        setAlignment(newAlignment);
        changeLocale(newAlignment);
    }
    };

    const useStyles = makeStyles({
        root: {
            background: 'linear-gradient(45deg, #FFD700 30%, #FFD700 90%)',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            color: 'white',
            marginBottom: 30
        },
    });
    const classes = useStyles();

    return(
        <ToggleButtonGroup
            className={classes.root}
            value={alignment}
            exclusive
            onChange={handleAlignment}
        >
            <ToggleButton value="pl">Polski</ToggleButton>
            <ToggleButton value="en">English</ToggleButton>
        </ToggleButtonGroup>
    );

}

export default SelectLanguageButtons; 