import React, { Component } from 'react';
import update from 'react-addons-update';
import classNames from 'classnames';
import moment from 'moment';
import highlight from 'highlight.js';

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

  send() {

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
          <label></label><a href="#" onClick={this.send.bind(this)}>Send request</a>
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

export class Response extends Component {

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
    // highlight.configure({useBR: true})
    highlight.highlightBlock(this.refs.code);
  }

  render() {

    let { open } = this.state;
    let { time, json, response } = this.props;

    let className = classNames({
      open: open
    });

    return (
      <div className="response">
        <div className="time">{moment(time).format('hh:mm:ss')}</div>
        <div className="code">{response.status}</div>
        <div className={className} onClick={this.handleClickJson}>
          Response:
          <div className="json">
            <pre><code className="javascript" ref="code">{JSON.stringify(json, null, 4)}</code></pre>
          </div>
        </div>
      </div>
    );
  }
}

export class Connect extends Component {

  constructor(props) {

    super();

    this.state = {
      scope: {
        user: {},
        org: {},
        space: {},
        app: {}
      }
    };
  }

  handleChange(scopeType, scopePermission, evt) {

    this.setState(update(this.state, {
      scope: {
        [scopeType]: {
          [scopePermission]: {
            $set: evt.target.checked
          }
        }
      }
    }));
  }

  appendScopeParameter(url) {

    let { scope } = this.state;

    return Object.keys(this.state.scope).reduce((result, scopeType) => {

      let scopePermissions = ['read', 'write', 'delete'].filter(scopePermission => scope[scopeType][scopePermission]);

      if(scopePermissions.length) {
        return result + scopeType + ':' + scopePermissions.join(',');
      }
      return result;
    }, url + '&scope=');
  }

  render() {

    let { authUrl } = this.props;
    let { scope } = this.state;

    let url = this.appendScopeParameter(authUrl);

    return (
      <div className="connect">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Read</th>
              <th>Write</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(scope).map(scopeType => {
              return (
                <tr key={scopeType}>
                  <td>{scopeType}</td>
                  {['read', 'write', 'delete'].map(scopePermission => {

                    let checked = scope[scopeType] && scope[scopeType][scopePermission];
                    return (
                      <td key={scopePermission}>
                        <input type="checkbox" checked={checked} onChange={this.handleChange.bind(this, scopeType, scopePermission)} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="connect-button">
          <a href={url}>Connect client</a>
        </div>
      </div>
    );
  }
}

export class Root extends Component {

  render() {
    return (
      <div>
        <RequestPanel url="/org/" title="Get orgs" />
        <RequestPanel url="/org/:id/test/:app" title="Get single org" params={{ id: 'integer', app: 'integer' }} />
        <RequestPanel url="/user/" title="Get User" />
      </div>
    );
  }
}