import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    title: {
        flexGrow: 1,
    },
    txtField: {
        marginRight: 20,
        flexGrow: 1
    }
}));

function valuetext(value) {
    return `${value}`;
  }
export default function ButtonAppBar(props) {
    const classes = useStyles();
    const marks = [
        {
            value: 1,
            label: '1m'
        },
        {
            value: 500,
            label: '500m'
        },
        {
            value: 1000,
            label: '1km'
        },
        {
            value: 1500,
            label: '1.5km'
        },
        {
            value: 2000,
            label: '2km'
        },
        {
            value: 2500,
            label: '2.5km'
        },
        {
            value: 3000,
            label: '3km'
        },
    ]
    return (
        <div className={classes.root}>
            <AppBar borderBottom={1} elevation={0} position="fixed" style={{ backgroundColor: 'white' }}>
                <Toolbar style={{
                    borderBottom: 1,
                    borderTop: 0,
                    borderLeft: 0,
                    borderRight: 0,
                    borderColor: '#e3e3e3',
                    borderStyle: 'solid'
                }}>
                    <div style={{ width: '20%', display: 'flex', marginRight: '50px' }}>
                        <Typography style={{color: 'black', marginRight: '25px', marginTop: '10px'}}>Distance: </Typography>
                        <Slider
                            track={false}
                            getAriaValueText={valuetext}
                            defaultValue={500}
                            marks={marks}
                            min={1}
                            max={3000}
                            step={500}
                            onChange={props.onDistanceChange}
                        />
                    </div>
                    <div style={{ width: '20%', display: 'flex', marginRight: '10px' }}>
                        <Typography style={{color: 'black', marginRight: '25px', marginTop: '10px'}}>Bedrooms: </Typography>
                        <TextField
                            id="outlined-number"
                            label="# of bedrooms"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            min={1}
                            onChange={props.onBedroomsChange}
                        />
                    </div>


                    <div style={{ width: '20%', display: 'flex' }}>
                        <Typography style={{color: 'black', marginRight: '25px', marginTop: '10px'}}>Bathrooms: </Typography>
                        <TextField
                            id="outlined-number"
                            label="# of bathrooms"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            min={1}
                            onChange={props.onBathroomsChange}
                        />
                    </div>
                    
                    {/* <Typography style={{ float: 'right', color: 'black' }} variant="h6">
                        findliving.space
                    </Typography> */}
                </Toolbar>
            </AppBar>
        </div>
    );
}