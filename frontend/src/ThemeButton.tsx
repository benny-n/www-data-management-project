import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from './App';
import React from 'react';

const ThemeButton: React.FC = () => {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return(
        <IconButton 
            size="large"
            sx={{ ml: 1, left: "90%"}} 
            onClick={colorMode.toggleColorMode}
            color="default"
        >
            {theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
    );
}

export default ThemeButton;
