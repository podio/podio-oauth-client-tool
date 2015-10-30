import React, { Component } from 'react';
import update from 'react-addons-update';

const PERMISSION_TYPES = ['read', 'write', 'delete', 'all']

export default class Connect extends Component {

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

      let scopePermissions = PERMISSION_TYPES.filter(scopePermission => scope[scopeType][scopePermission]);

      if(scopePermissions.length) {
        return result + scopeType + ':' + scopePermissions.join(',') + ' ';
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
              {PERMISSION_TYPES.map(permission => <th key={permission}>{permission.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.keys(scope).map(scopeType => {
              return (
                <tr key={scopeType}>
                  <td>{scopeType}</td>
                  {PERMISSION_TYPES.map(scopePermission => {

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