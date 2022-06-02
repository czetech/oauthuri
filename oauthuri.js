/**
 * @file OAuthURI single source file.
 * @author Petr Czepiec
 */

/**
 * The callback that handles the error message from OAuthURI constructor.
 *
 * @callback OAuthURI~errorCallback
 * @param {string} message
 */

/** OAuthURI. */
export default class OAuthURI {
  /**
   * Create OAuthURI.
   *
   * @param {?string} redirectUri - Default redirect URI.
   * @param {?string} responseMode - Default response mode.
   * @param {string} keyRedirectUri - Key to the redirect URI in the state
   *     parameter.
   * @param {string} keyResponseMode - Key to the response mode in the state
   *     parameter.
   * @param {?errorCallback} errorCallback - Callback that handles the error
   *     message.
   */
  constructor(
    redirectUri = null,
    responseMode = "query",
    keyRedirectUri = "redirect_uri",
    keyResponseMode = "response_mode",
    errorCallback = null
  ) {
    this.redirectUri = redirectUri;
    this.responseMode = responseMode;
    this.keyRedirectUri = keyRedirectUri;
    this.keyResponseMode = keyResponseMode;
    this.errorCallback = errorCallback;
  }

  /**
   * Redirect by parameters.
   */
  redirect() {
    let paramsString;
    if (window.location.search) {
      paramsString = window.location.search.substr(1);
    } else if (window.location.hash) {
      paramsString = window.location.hash.substr(1);
    } else {
      this.error("No parameters found.");
      return;
    }

    const params = new URLSearchParams(paramsString);

    let state;
    if (this.redirectUri == null || this.responseMode == null) {
      const stateString = params.get("state");
      if (stateString == null) {
        this.error("The state parameter is missing.");
        return;
      }
      if (stateString === "") {
        this.error("The state parameter is empty.");
        return;
      }

      try {
        state = JSON.parse(stateString);
      } catch (e) {
        if (e instanceof SyntaxError) {
          this.error("The state parameter could not be decoded.");
          return;
        }
        throw e;
      }
    } else {
      state = {};
    }

    const redirectUriString = state[this.keyRedirectUri] || this.redirectUri;
    if (redirectUriString == null) {
      this.error("Redirect URI is missing.");
      return;
    }
    if (redirectUriString === "") {
      this.error("Redirect URI is empty.");
      return;
    }

    let redirectUri;
    try {
      redirectUri = new URL(redirectUriString);
    } catch (e) {
      if (e instanceof TypeError) {
        this.error("Redirect URI is not valid.");
        return;
      }
      throw e;
    }

    const responseMode = state[this.keyResponseMode] || this.responseMode;
    if (responseMode === "query") {
      redirectUri.search = paramsString;
      window.location.replace(redirectUri);
    } else if (responseMode === "fragment") {
      redirectUri.hash = paramsString;
      window.location.replace(redirectUri);
    } else if (responseMode === "form_post") {
      const form = document.createElement("form");
      form.action = redirectUri;
      form.method = "POST";
      params.forEach((value, key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } else if (responseMode == null) {
      this.error("Response mode is missing.");
    } else if (responseMode === "") {
      this.error("Response mode is empty.");
    } else {
      this.error(`Unsupported response mode "${responseMode}".`);
    }
  }

  /**
   * Handle error.
   *
   * @private
   * @param {string} message - Error message.
   */
  error(message) {
    if (this.errorCallback != null) {
      this.errorCallback(message);
    }
  }
}
