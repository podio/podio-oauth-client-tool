import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import highlight from 'highlight.js';
import _ from 'lodash';

export default class Response extends Component {

  constructor() {
    super();

    this.state = {
      open: false
    };
  }

  handleClickJson = () => {
    this.setState({
      open: !this.state.open
    });
  }

  componentDidMount = () => {
    highlight.highlightBlock(this.refs.code);
  }

  render() {

    let { open } = this.state;
    let { time, json, response, url } = this.props;

    let error_description = _.get(json, 'message.error_description');

    let className = classNames({
      open: open
    });

    return (
      <div className="response">
        <div className="header" onClick={this.handleClickJson}>
          <div className="url">{url}</div>
          <div className="code">{response.status}</div>
          <div className="time">{moment(time).format('hh:mm:ss')}</div>
        </div>
        <div className={className}>
          <div className="json">
            <pre><code className="javascript" ref="code">{JSON.stringify(json, null, 4)}</code></pre>
          </div>
        </div>
        <div>{error_description}</div>
      </div>
    );
  }
}