import React, { Component } from 'react';
import Response from './Response';
import _ from 'lodash';

export default class RequestPanel extends Component {

  constructor(props) {

    super();

    let urlParams = this.extractUrlParams(props.url);

    let urlData = this.generateData(urlParams);
    let bodyData = this.generateData(this.flattenObject(props.body))

    let requestSpec = Object.assign(urlParams, props.body);
    let requestData = Object.assign(urlData, bodyData)

    this.state = {
      requestData: requestData,
      requestSpec: requestSpec,
      url: this.formatUrl(props.url, urlData),
      responses: [],
      errors: [],
      isRequesting: false,
    };
  }

  flattenObject(object, prefix="") {

    return Object.keys(object).reduce((result, key) => {

      if (typeof object[key] === 'object') {
        return Object.assign(result, this.flattenObject(object[key], prefix + key + '.'))
      } else {
        result[prefix + key] = object[key];
      }
      return result;
    }, {});
  }

  nestObject(flatObject) {

    return Object.keys(flatObject).reduce((result, key) => {
      return _.set(result, key, flatObject[key])
    }, {});
  }

  generateData(spec) {

    let getValue = type => {

      switch (type) {
        case 'string':
          return 'Hello there';
        case 'number':
        case 'float':
          return Math.random() * 100;
        case 'integer':
          return Math.round(Math.random() * 100);
        case 'boolean':
          return true;
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

  forEachUrlParam(url, fn) {

    let regex = /:([a-z0-9-_]+)([/]|$)/g;
    let match = regex.exec(url);    

    while (match != null) {
      fn(match);
      match = regex.exec(url);
    }
  }

  extractUrlParams(url) {

    let params = {};

    this.forEachUrlParam(url, match => {
      params[match[1]] = 'integer'
    })

    return params;
  }

  formatUrl(url, values) {

    this.forEachUrlParam(url, match => {
      url = url.replace(match[0], values[match[1]] + match[2]);
    });   

    return url;
  }

  send = (evt) => {

    evt.preventDefault();

    this.setState({
      isRequesting: true
    });

    let { method } = this.props;
    let { requestData, url } = this.state;

    let addResonse = (collection, props) => {

      this.setState(previousState => {

        let responseElement = <Response {...props} />;

        previousState[collection].unshift(responseElement);
        previousState.isRequesting = false;

        return previousState;
      });
    };

    let requestOptions = {
      method: method
    };

    if (!~['GET', 'HEAD'].indexOf(method.toUpperCase())) {
      requestOptions.body = JSON.stringify(this.nestObject(requestData))
    }

    fetch(`/proxy${url}`, requestOptions)
    .then(response => {

      response.json().then(json => {

        let collection = ['errors', 'responses'][Number(response.ok)];

        addResonse(collection, {
          json: json,
          response: response,
          time: new Date(),
          url: url
        });
      });
    });
  }

  handleChangeParam(key, evt) {

    this.setState(previousState => {

      previousState.requestData[key] = evt.target.value;
      previousState.url = this.formatUrl(this.props.url, previousState.requestData)
      return previousState;
    });
  }

  render() {

    let { url, requestData } = this.state;
    let { title, method } = this.props;

    return (
      <div className="request-panel">
      <div className="header">
        <div className="title">{title}</div>
      </div>
      <div className="inputs">
        {
          Object.keys(this.flattenObject(requestData)).map(key => {
            return (
              <div className="input" key={key}>
                <div>{key}:
                  <input
                    type="text"
                    value={requestData[key]}
                    onChange={this.handleChangeParam.bind(this, key)}
                  />
                </div>
              </div>
            );
          })
        }
        </div>
        <div className="button">
          <a href="#" onClick={this.send}>{method.toUpperCase()} {url}</a>
        </div>
        {this.state.isRequesting ? <div className="request-progress">Requesting {url}...</div> : ''}
        <div className="successes">
          {this.state.responses.map((responseElement, index) => {
            return <div className="success" key={responseElement.props.time.toString()}>{responseElement}</div>;
          })}
        </div>
        <div className="errors">
          {this.state.errors.map((responseElement, index) => {
            return <div className="error" key={responseElement.props.time.toString()}>{responseElement}</div>;
          })}
        </div>
      </div>
    );
  }
}

RequestPanel.defaultProps = {
  method: 'get',
  body: {}
}

RequestPanel.propTypes = {
  method: React.PropTypes.string,
  url: React.PropTypes.string.isRequired
}