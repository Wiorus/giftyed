import React from 'react'
import './PeopleList.scss'
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from '@mui/material';

const PeopleList: React.FC = () => {
    return (
        <div className='PeopleList'>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columnSpacing={2} minHeight={100} direction="row">
                    <Grid xs={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Avatar sx={{ width: 100, height: 100 }} src="" />
                        <Typography variant="caption">Avatar 1</Typography>
                    </Grid>
                    <Grid xs={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Avatar sx={{ width: 100, height: 100 }} src="" />
                        <Typography variant="caption">Avatar 2</Typography>
                    </Grid>
                    <Grid xs={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Avatar sx={{ width: 100, height: 100 }} src="" />
                        <Typography variant="caption">Avatar 3</Typography>
                    </Grid>
                    <Grid xs={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                        <Avatar sx={{ width: 100, height: 100 }} src="" />
                        <Typography variant="caption">Avatar 4</Typography>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}
export default PeopleList;