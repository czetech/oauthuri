import path from "path";

const config = {
  entry: "./oauthuri.js",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  output: {
    filename: "oauthuri.js",
    library: { name: "OAuthURI", type: "umd", export: "default" },
    path: path.resolve("dist"),
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  chrome: "49",
                  edge: "17",
                  firefox: "29",
                  opera: "36",
                  safari: "10.1",
                  android: "49",
                },
              },
            ],
          ],
        },
      },
    ],
  },
};

export default config;
