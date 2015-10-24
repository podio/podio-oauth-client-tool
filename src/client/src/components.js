import React, { Component } from 'react';

export default class Tester extends Component {

  constructor(props) {

    super();

    let paramsData = this.generateData(props.params);

    this.state = {
      paramsData: paramsData,
      url: this.formatUrl(props.url, paramsData),
      responses: [],
      errors: []
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

    let addResonse = (collection, object) => {

      this.setState(previousState => {

        previousState[collection].unshift(object);
        return previousState
      });
    };

    fetch(`/proxy${this.state.url}`, {
      method: this.props.method,
    })
    .then(response => {

      response.json().then(json => {

        let collection = ['errors', 'responses'][Number(response.ok)];

        addResonse(collection, {
          json: json,
          response: response,
          time: new Date()
        });
      });
    });
  }

  handleChangeParam(key, evt) {

    this.setState(previousState => {

      previousState.paramsData[key] = evt.target.value;
      previousState.url = this.formatUrl(this.props.url, previousState.paramsData)
      return previousState;
    });
  }

  render() {

    let { url, paramsData } = this.state;
    let { title } = this.props;

    return (
      <div className="tester">
        <div className="title">{title}</div>
        <div><label htmlFor=""></label>{url}</div>
        {
          Object.keys(paramsData).map(key => {
            return (
              <div key={key}>
                <label>{key}: </label>
                <input
                  type="text"
                  value={paramsData[key]}
                  onChange={this.handleChangeParam.bind(this, key)}
                />
              </div>
            );
          })
        }
        <div>
          <label></label><a href="#" onClick={this.send.bind(this)}>Send request</a>
        </div>
        <div className="responses">
          {this.state.responses.map((response, index) => {
            return <div className="response" key={index}>{response.time.toString()}</div>;
          })}
        </div>
        <div className="errors">
          {this.state.errors.map((error, index) => {
            return <div className="error" key={index}>{JSON.stringify(error)}</div>;
          })}
        </div>
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
        <Tester url="/user/" title="Get User" />

      </div>
    );
  }
}