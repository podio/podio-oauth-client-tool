import React, { Component } from 'react';
import Response from './Response';
import _ from 'lodash';

const URL_PARAM_REGEX = /:([a-z0-9-_]+)([/]|$|[?])/g;
const QUERY_PARAM_REGEX = /(\&|\?)([a-zA-Z0-9-_]+)=([a-zA-Z0-9-_]+)/g;

export default class RequestPanel extends Component {

  constructor(props) {

    super();

    let urlParams = this.extractUrlParams(props.url);
    let queryParams = this.extractQueryParams(props.url);

    let urlData = this.generateData(urlParams);
    let queryData = this.generateData(queryParams);
    let bodyData = this.generateData(this.flattenObject(props.body));

    let requestSpec = Object.assign(urlParams, queryParams, props.body);
    let requestData = Object.assign(urlData, queryData, bodyData)

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

  ensureCorrectType(spec, key, value) {

    switch (_.get(spec, key)) {
      case 'number':
      case 'integer':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      default:
        return String(value);
    }
  }

  forEachMatch(regex, input, fn) {

    let match = regex.exec(input);    

    while (match != null) {
      fn(match);
      match = regex.exec(input);
    }
  }

  extractUrlParams(url) {

    let params = {};

    this.forEachMatch(URL_PARAM_REGEX, url, match => {
      params[match[1]] = 'integer';
    });
    return params;
  }

  extractQueryParams(url) {

    let params = {};

    this.forEachMatch(QUERY_PARAM_REGEX, url, match => {
      params[match[2]] = match[3];
    });
    return params;
  }

  formatUrl(url, values) {

    this.forEachMatch(URL_PARAM_REGEX, url, match => {
      url = url.replace(match[0], values[match[1]] + match[2]);
    });

    this.forEachMatch(QUERY_PARAM_REGEX, url, match => {
      url = url.replace(match[0], (match[0].replace(match[3], values[match[2]])));
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
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      } 
    };

    if (!~['GET', 'HEAD'].indexOf(method.toUpperCase())) {
      requestOptions.body = JSON.stringify(this.nestObject(requestData));
    }

    fetch(`/proxy${url}`, requestOptions).then(response => {

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

      let value = evt.target.value;

      // If boolean, we'll be getting the value from a checkbox instead
      if (previousState.requestSpec[key] === 'boolean') {
        value = evt.target.checked;
      }

      previousState.requestData[key] = this.ensureCorrectType(previousState.requestSpec, key, value);
      previousState.url = this.formatUrl(this.props.url, previousState.requestData)
      return previousState;
    });
  }

  _renderInput = key => {

    let input = (
      <div>{key}: 
        <input
          type="text"
          value={this.state.requestData[key]}
          onChange={this.handleChangeParam.bind(this, key)}
        />
      </div>
    );

    if(_.get(this.state.requestSpec, key) === 'boolean') {
      input = (
        <div>{key}: 
          <input
            type="checkbox"
            checked={this.state.requestData[key]}
            onChange={this.handleChangeParam.bind(this, key)}
          />
        </div>
      );
    }
    return <div className="input" key={key}>{input}</div>;
  }

  _renderSuccess = (responseElement, index) => {
    return <div className="success" key={responseElement.props.time.toString()}>{responseElement}</div>;
  }

  _renderError = (responseElement, index) => {
    return <div className="error" key={responseElement.props.time.toString()}>{responseElement}</div>;
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
        {Object.keys(this.flattenObject(requestData)).map(this._renderInput)}
        </div>
        <div className="button">
          <a href="#" onClick={this.send}>{method.toUpperCase()} {url}</a>
        </div>
        {this.state.isRequesting ? <div className="request-progress">Requesting {url}...</div> : ''}
        <div className="successes">{this.state.responses.map(this._renderSuccess)}</div>
        <div className="errors">{this.state.errors.map(this._renderError)}</div>
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