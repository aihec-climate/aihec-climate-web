///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
//import { array } from 'prop-types'

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/NationPickerLegend.css';

@inject('store') @observer
class NationPickerLegend extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        return (
            <Control position="bottomright" className="control-top-right">
                <div className="explorer-map-legend">
                    <span className={"explorer-map-legend-color-box brown"}></span><span className="explorer-map-legend-label">Nations</span>
                </div>
            </Control>
        );
    }
}

export default NationPickerLegend;
