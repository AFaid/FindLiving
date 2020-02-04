import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 5,
  },
});

function parseUnit(unit) {
  if (!isNaN(unit)) unit = 'Unit ' + unit;
  return unit;
}

export default function Listing(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <hr style={{width: "97%", backgroundColor: '#e3e3e3', color: '#e3e3e3', border: '1px solid #e3e3e3'}}></hr>

      {/* <div > */}
      <CardContent style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
        {(props.unit ? `${parseUnit(props.unit)}` : 'Entire House')}
        </Typography>
        <Typography style={{textTransform: 'capitalize'}}variant="h5" component="h2">
            {props.address}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {`${props.bedrooms} bedrooms` + (props.bathrooms ? ` · ${props.bathrooms} baths` : '')}
        </Typography>
        </div>
        <Box style={{float: 'right'}}>🚶 {Math.ceil(props.walkingDistance/60)} mins</Box>

      </CardContent>
      {/* </div> */}

      <CardActions style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={() => window.open(props.link, '_blank')} size="small">View Listing</Button>
        <Box fontWeight="fontWeightBold" style={{marginRight: '10px'}}>{`$${props.price} CAD / month`}</Box>

      </CardActions>
    </Card>
  );
}