import IconButton from '@mui/material/IconButton';
import { Theme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface ThemeButtonProps{
    theme: Theme,
    colorMode: {toggleColorMode: () => void;},
}

function ThemeButton({theme, colorMode}: ThemeButtonProps){
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
