import React, { Component } from 'react';
import { Box } from '@material-ui/core';

export default class MapIcon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let style = {
            width: 'max-content',
            height: 'max-content',
            margin:'10px 0 0 -10px',
            background: 'white',
            MozBorderRadius: '10px',
            WebkitBorderRadius: '10px',
            borderRadius: '10px',
            padding: '3px',
            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.18) 0px 1px 2px',
            backgroundColor: ''
        };
        style.backgroundColor = this.props.withinDistance ? '#afeb78' : '#ffffff';
        return(
            <div style={style}>
                <Box fontWeight="fontWeightBold" fontSize="14px">{this.props.text}</Box>
            </div>
        );
    }
}