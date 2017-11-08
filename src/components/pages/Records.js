/**
 * @author Philip Van Raalte
 * @date 2017-10-17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import _ from 'lodash';
import {getSongs, getSingles, getAlbums, getWeek} from '../../actions';

class Records extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlbums: false
    };

    this.renderSingles = this.renderSingles.bind(this);
    this.renderAlbums = this.renderAlbums.bind(this);
    this.renderSinglesOrAlbumsSwitch = this.renderSinglesOrAlbumsSwitch.bind(this);
  }

  componentWillMount() {
    this.props.getWeek();
    this.props.getSongs();
    this.props.getSingles();
    this.props.getAlbums();
  }

  componentDidUpdate() {
    // fixes bug where window scrolls down
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  renderSinglesOrAlbumsSwitch() {
    const {showAlbums} = this.state;
    return(
      <span className="form-group text-right float-right">
        {`Singles `}
        <label className="form-switch">
          <input type="checkbox"
                 onChange={(e) => {this.setState({showAlbums: e.target.checked})}}
                 checked={showAlbums}
          />
          <i className="form-icon"/> Albums
        </label>
      </span>
    );
  }

  renderSingles() {
    let {singles, week} = this.props;
    singles = _.sortBy(singles, (({released}) => {
      return -released;
    }));

    if(_.isEmpty(singles)){
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa fa-file-audio-o fa-4x" aria-hidden="true"/>
          </div>
          <p className="empty-title h5">You haven't released any singles yet</p>
        </div>
      );
    }

    let totalSingleSales = 0, bestSellingSingle = {sales: 0};
    singles.forEach(({sales, title}) => {
      if(sales > bestSellingSingle.sales) {
        bestSellingSingle = {sales, title};
      }
      totalSingleSales += sales;
    });

    return(
      <div>
        <div>
          <span className="float-left">
            Total Single Sales: {totalSingleSales.toLocaleString()} <br/>
            Best Selling Single: {`${bestSellingSingle.title} - ${bestSellingSingle.sales.toLocaleString()}`}
          </span>
          {this.renderSinglesOrAlbumsSwitch()}
        </div>
        <div className="scrollable centered full-width">
          {
            singles.map(({id, title, quality, released, salesLastWeek, sales}) => {
              const age = week - released;
              return(
                <div className="card" key={id}>
                  <div className="card-header">
                    <div className="card-title h5">{title}</div>
                  </div>
                  <div className="card-body">
                    Age: {`${age} ${age === 1 ? "week" : "weeks"}`}<br/>
                    Quality: {quality}<br/>
                    Sales Last Week: {salesLastWeek.toLocaleString()}<br/>
                    Total Sales: {sales.toLocaleString()}<br/>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  renderAlbums() {
    let {albums, week} = this.props;
    albums = _.sortBy(albums, (({released}) => {
      return -released;
    }));

    if(_.isEmpty(albums)){
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa fa-file-audio-o fa-4x" aria-hidden="true"/>
          </div>
          <p className="empty-title h5">You haven't released any albums yet</p>
        </div>
      );
    }

    let totalAlbumSales = 0, bestSellingAlbum = {sales: 0};
    albums.forEach(({sales, title}) => {
      if(sales > bestSellingAlbum.sales) {
        bestSellingAlbum = {sales, title};
      }
      totalAlbumSales += sales;
    });

    return(
      <div>
        <div>
          <span className="float-left">
            Total Album Sales: {totalAlbumSales.toLocaleString()} <br/>
            Best Selling Album: {`${bestSellingAlbum.title} - ${bestSellingAlbum.sales.toLocaleString()}`}
          </span>
          {this.renderSinglesOrAlbumsSwitch()}
        </div>
        <div className="scrollable centered full-width">
          {
            albums.map(({id, title, quality, released, salesLastWeek, sales}) => {
              return(
                <div className="card" key={id}>
                  <div className="card-header">
                    <div className="card-title h5">{title}</div>
                  </div>
                  <div className="card-body">
                    Age: {week - released} weeks<br/>
                    Quality: {quality}<br/>
                    Sales Last Week: {salesLastWeek.toLocaleString()}<br/>
                    Total Sales: {sales.toLocaleString()}<br/>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const {showAlbums} = this.state;
    const {singles, albums} = this.props;

    return(
      <div className="page container" id="page-records">
        <div className="btn-group btn-group-block centered col-2">
          <Link to="/records/release" className="btn btn-lg btn-primary">
            Release New Record
          </Link>
        </div>
        <br/>
        <div>
          {
            _.isEmpty(singles) && _.isEmpty(albums)
            ?
              <div className="empty">
                <div className="empty-icon">
                  <i className="fa fa-file-audio-o fa-4x" aria-hidden="true"/>
                </div>
                <p className="empty-title h5">You haven't released any records yet</p>
              </div>
            :
              <div>
                {
                  showAlbums
                    ?
                    this.renderAlbums()
                    :
                    this.renderSingles()
                }
              </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    songs: state.songs,
    singles: state.singles,
    albums: state.albums,
    week: state.week
  };
}

export default connect(mapStateToProps, {getSongs, getSingles, getAlbums, getWeek})(Records);