import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import ThemeButton from './ThemeButton';

const NavBar: React.FC = () => { 
    return(
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
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
                        <ThemeButton />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;