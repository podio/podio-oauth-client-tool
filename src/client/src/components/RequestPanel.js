import React, { Component } from 'react';
import Response from './Response';


export default class RequestPanel extends Component {

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

  send = (evt) => {

    evt.preventDefault();

    let addResonse = (collection, props) => {

      this.setState(previousState => {

        let responseElement = <Response {...props} />;

        previousState[collection].unshift(responseElement);
        return previousState;
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
          <label></label><a href="#" onClick={this.send}>Send request</a>
        </div>
        <div className="responses">
          {this.state.responses.map((responseElement, index) => {
            return <div className="response" key={index}>{responseElement}</div>;
          })}
        </div>
        <div className="errors">
          {this.state.errors.map((responseElement, index) => {
            return <div className="error" key={index}>{responseElement}</div>;
          })}
        </div>
      </div>
    );
  }
}

RequestPanel.defaultProps = {
  method: 'get',
  params: {}
}

RequestPanel.propTypes = {
  method: React.PropTypes.string,
  url: React.PropTypes.string
}