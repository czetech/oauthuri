# OAuthURI

OAuthURI solves the problem if the OAuth2 authorization provider does not allow
to use the redirect URI that is needed, e.g. localhost, mobile app deep linking,
or an HTTP scheme for testing purposes.

## How it works

URL of the OAuthURI instance is set to the allowed redirect URIs of the OAuth2
provider. The JSON string must be used as the `state` parameter, where in
addition to the original `state` data, there are the keys `redirect_uri` with
the final URL and `response_mode` with the final mode (`query`, `fragment` or
`form_post`). OAuthURI simply redirects the request further to the URL from the
parameters.

Example of OAuth2 request:

```json
{
  "scope": "<scope>",
  "client_id": "<client ID>",
  "redirect_uri": "https://<OAuthURI host>/redirect",
  "state": "{\"redirect_uri\":\"myapp://deeplink\",\"state\":\"<state data>\"}"
}
```

The response from OAuth2 provider to OAuthURI can be a `query`, `fragment`, or
`form_post`.

## Configuration

There are several configuration variables:

| Name              | Description                          | Default value     |
| ----------------- | ------------------------------------ | ----------------- |
| `redirectUri`     | Default redirect URI value           | _null_            |
| `responseMode`    | Default response mode value          | _"query"_         |
| `keyRedirectUri`  | Key to redirect URI in `state` JSON  | _"redirect_uri"_  |
| `keyResponseMode` | Key to response mode in `state` JSON | _"response_mode"_ |

See [Usage options](#usage-options) on how to use them.

## Usage options

The application is a static web page where the response from OAuth2 provider
must point to _redirect.html_ and the configuration is in the _config.json_
file.

OAuthURI can also be used as a JavaScript library.

### Use as a service

Application is deployed at <https://oauthuri.cze.tech>. The URL for response
from OAuth2 provider is:

    https://oauthuri.cze.tech/redirect

Feel free to use the service for testing or simple production purposes.

### Build from code

Requirements:

- [Make]
- [pandoc]
- [npm]

Build is done with:

```shell
make
```

then the output is in the _./build/web_ directory. The web server must redirect
POST requests to the GET and send the data as a query string (see the Nginx
configuration example in [docker-nginx.conf][config-nginx]).

The Dockerfile and Helm chart are also part of this repository so it can be
easily build and deployed to Kubernetes.

### Run from Docker Hub

Run the image from Docker Hub:

```shell
docker run -p 80:80 czetech/oauthuri
```

The endpoint for a response from OAuth2 provider is _/redirect_. The image can be
configured using [config.json][config] file mounted to _/app/config.json_.

### Install to Kubernetes using Helm

Setup Helm repository:

```shell
helm repo add czetech https://charts.cze.tech/
```

Install Helm chart:

```shell
helm install oauthuri czetech/oauthuri \
  --set ingress.enabled=true \
  --set ingress.hosts[0]=<ingress-host>
```

see the [chart] for more options.

As in the Docker image, the endpoint for a response from OAuth2 provider is
_/redirect_. Configuration variables can be passed to the Helm chart.

### Library

OAuthURI as a JavaScript front-end library is available as npm package
[oauthuri][oauthuri-npm].

It is installed with:

```shell
npm install oauthuri
```

Or it is possible to use UMD module from the CDN:

```html
<script src="https://unpkg.com/oauthuri"></script>
```

Usage:

```javascript
const oAuthURI = new OAuthURI(
  redirectUri,
  responseMode,
  keyRedirectUri,
  keyResponseMode
);

oAuthURI.redirect();
```

## Source code

The source code is available at <https://github.com/czetech/oauthuri>.

[chart]: https://github.com/czetech/oauthuri/tree/main/chart
[config]: https://github.com/czetech/oauthuri/tree/main/config.json
[config-nginx]: https://github.com/czetech/oauthuri/tree/main/docker-nginx.conf
[make]: https://www.gnu.org/software/make/
[npm]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[oauthuri-npm]: https://www.npmjs.com/package/oauthuri
[pandoc]: https://pandoc.org/installing.html
