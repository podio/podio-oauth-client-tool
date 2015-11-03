#Podio oAuth Client Test Tool

##Installation

`$ npm run setup`

##Starting

`$ npm start`

##Resetting

`$ npm run reset`

##Usage

###First Run

The app will look for a `client.json` file at `./tmp/`. If it does not find one, it will prompt you for a `clientId`, `clientSecret` and `apiURL` and generate the file based on your input.

Afterwards, the app can be accessed on `http://localhost:8000`.

###Connecting the Client

If the client is not connected, the `/auth` page will be shown. Here you can select specific scopes and permissions that the client should ask for, when directed to the authentication screen in Podio.

###Sending Requests

When the client has been succesfully connected, the user is taken to the main dashboard containing all available request panels.

Request panels that specify dynamic parameters either in their `url` or `body` props are automatically populated with sample data, but each piece of data can be manually altered before requesting by using the automatically rendered input fields.

##Adding Request Panels

Each request panel is a React component and have the following props:

| Prop | Description
| :------------- |:-------------|
| **method** | The HTTP method used in the request. Defaults to `GET`
| **url** | The URL spec for the request
| **body** | The spec for the request body

**Fully featured (Podio non-compliant) example:**

```html
<RequestPanel
  title="Filter items"
  method="POST"
  url="app/:app_id/items/:item_id?sort_by=string&pretty=boolean"
  body={{
    view: 'integer',
    responseFormat: 'string'
  }}
/>
```

### URI Parameters

URI parameters are automatically extracted from the `url` prop and are rendered as editable input fields in the component.

They are specified with a colon (`:`) prefix.

### Query Parameters

Query parameters are automatically extracted from the `url` prop and are rendered as editable input fields in the component.

They are specificed in the following format: `parameter=type`.

### Request Body Parameters

Input fields for request body parameters can be made available via the `body` parameter. Simply make it known what each field have. Nested parameters are also supported:

```json
{
  "field": "type",
  "(nested)": {
    "field": "type",
    "field": "type"
  }
}
```

The RequestPanel components are found in `src/client/src/components/Routes.js`.