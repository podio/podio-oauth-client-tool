import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import highlight from 'highlight.js';

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

    let className = classNames({
      open: open
    });

    return (
      <div className="response" onClick={this.handleClickJson}>
        <div className="header">
          <div className="url">{url}</div>
          <div className="code">{response.status}</div>
          <div className="time">{moment(time).format('hh:mm:ss')}</div>
        </div>
        <div className={className}>
          <div className="json">
            <pre><code className="javascript" ref="code">{JSON.stringify(json, null, 4)}</code></pre>
          </div>
        </div>
      </div>
    );
  }
}