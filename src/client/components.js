import React, { Component } from 'react';

export default class Tester extends Component {

  constructor(props) {
    super();
    this.state = {
      paramsData: this.generateData(props.params),
      response: null,
      error: null
    };
  }

  generateData(spec) {

    let getValue = type => {

      switch (type) {
        case 'number':
        case 'float':
          return Math.random() * 100;
        case 'integer':
          return Math.round(Math.random() * 100);
        default:
          return 'Default value'
      }
    };

    return Object.keys(spec).reduce((result, key, index) => {

      let type = spec[key];
      result[key] = getValue(type);
      return result;
    }, {});
  }

  // Merges in variables to the URL
  formatUrl(url, values) {

    let regex = /:([a-z0-9]+)([/]|$)/g;
    let match = regex.exec(url);

    while (match != null) {
      url = url.replace(match[0], values[match[1]] + match[2]);
      match = regex.exec(url);
    }

    return url;
  }

  send() {

    let url = `/proxy${this.props.url}`;

    fetch(url, {
      method: this.props.method,
    })
    .then(response => {
      this.setState({
        response: response
      })
    })
    .catch(err => {
      this.setState({
        error: err
      })
    });
  }

  handleChangeParam(key, evt) {
    this.setState(previousState => {
      previousState.paramsData[key] = evt.target.value;
      return previousState;
    });
  }

  render() {

    let { url } = this.props;

    url = this.formatUrl(url, this.state.paramsData);

    return (
      <div className="tester">
        <div className="title">{this.props.title}</div>
        <div><label htmlFor=""></label>{url}</div>
        {
          Object.keys(this.state.paramsData).map(key => {
            return (
              <div key={key}>
                <label>{key}: </label>
                <input
                  type="text"
                  value={this.state.paramsData[key]}
                  onChange={this.handleChangeParam.bind(this, key)}
                />
              </div>
            );
          })
        }
        <div>
          <label></label><a href="#" onClick={this.send.bind(this)}>Send request</a>
        </div>
        <div className="response">{this.state.response}</div>
        <div className="error">{this.state.error}</div>
      </div>
    );
  }
}

Tester.defaultProps = {
  method: 'get',
  params: {}
}

Tester.propTypes = {
  method: React.PropTypes.string,
  url: React.PropTypes.string
}

export class Root extends Component {
  render() {
    return (
      <div>
        <Tester url="/org/" title="Get orgs" />
        <Tester url="/org/:id/test/:app" title="Get single org" params={{ id: 'integer', app: 'integer' }} />
      </div>
    );
  }
}