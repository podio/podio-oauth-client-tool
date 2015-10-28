#Podio oAuth Client Test Tool

##Installation

`$ npm run setup`

##Starting

`$ npm start`

##Resetting

`$ npm run reset`

##Usage

###First run

The app will look for a `client.json` file at `./tmp/`. If it does not find one, it will prompt you for a `clientId`, `clientSecret` and `apiURL` and generate the file based on your input.

Afterwards, the app can be accessed on `http://localhost:8000`.

###Connecting the client

If the client is not connected, the `/auth` page will be shown. Here you can select specific scopes and permissions that the client should ask for, when directed to the authentication screen in Podio.

###Sending requests

When the client has been succesfully connected, the user is taken to the main dashboard containing all available request panels. Request panels that support dynamic parameters in their URL (and body in the future) are automatically populated with random sample data, but each piece of data can be manually altered before each request by using the input fields.

##Adding Request Panels

Each request panel is a React component and have the following structure:

```html
<RequestPanel title="Request title" url="resource/:id/resource2/:id2" method="GET" />
```

Notice that URL parameters that are specifified via a `:` prefix will be made available as input fields in the rendered component.

The RequestPanel components are found in `src/client/src/components/Root.js`.