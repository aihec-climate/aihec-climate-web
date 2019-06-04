///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
//import white from '@material-ui/core/colors/white';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
//import Typography from "@material-ui/core/Typography";

import ReactModal from 'react-modal';

// Styles
//import '../../styles/ChartRangeSelector.css';

const styles = theme => ({
  //button: {
  //  color: green[500],
  //},
  mainSelect: {
    marginLeft: '0px'
  },
});

var app;
var history;

@inject('store') @observer
class ChartRangeSelector extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    onChangeClick = (v) => {
        app.setChartView(v);
    }

    getButtonVariant = (b) => {
        let v
        if (b) {
            v = "contained";
        } else {
            v = "outlined";
        }
        return v
    }

    render() {

        const { classes } = this.props;

        return (
          <div>
              <Grid container item spacing="24" direction="row" justify="flex-start" alignItems="flex-start" className={classes.mainSelect}>
                <Grid item>
                    <Button variant={this.getButtonVariant(app.chartViewIsPast)} color='primary' onClick={() => {this.onChangeClick('past')}}>
                      Past
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant={this.getButtonVariant(app.chartViewIsPresent)} color='primary' onClick={() => {this.onChangeClick('present')}}>
                      Present
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant={this.getButtonVariant(app.chartViewIsFuture)} color='primary' onClick={() => {this.onChangeClick('future')}}>
                      Future
                    </Button>
                </Grid>
              </Grid>
          </div>
        );
    }
}

ChartRangeSelector.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ChartRangeSelector));