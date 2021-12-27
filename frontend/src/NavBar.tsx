import { AppBar, Box, Container, Theme, Toolbar, Typography } from '@mui/material';
import ThemeButton from './ThemeButton';

interface NavBarProps{
    theme: Theme,
    colorMode: {toggleColorMode: () => void;},
}

function NavBar(props: NavBarProps){
    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="relative" > 
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        color="text.primary"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        Welcome to Telegram Polls!
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex'} }}>
                        <ThemeButton {...props}/>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;