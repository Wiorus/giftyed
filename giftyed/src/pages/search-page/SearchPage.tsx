import React from 'react'
import Navbar from '../../components/navbar/Navbar';
import wavesTwo from '../../utils/wavesTwo.png'
import './SearchPage.scss'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import SearchList from '../../components/searchList/SearchList';
import { Chip } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));



const SearchPage: React.FC = () => {
    return (

        <div className='SearchPage'>
            <Navbar />
            <div className='SearchPage__search'>
                <input type="text" />
            </div>
            <div className='SearchPage__categories'>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid xs={6} md={8}>
                            <Chip label="Clickable" />
                        </Grid>
                        <Grid xs={6} md={4}>
                            <Chip label="Clickable" />
                        </Grid>
                        <Grid xs={6} md={4}>
                            <Chip label="Clickable" />
                        </Grid>
                        <Grid xs={6} md={8}>
                            <Chip label="Clickable" />
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <SearchList />
            <img className="FollowPage__wavesTwoImg" src={wavesTwo} alt="wavesTwo" />
        </div>
    )
}
export default SearchPage;