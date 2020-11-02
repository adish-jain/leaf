// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require("@zeit/next-source-maps")();
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});
const withCSS = require("@zeit/next-css");
const withSASS = require("@zeit/next-sass");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
} = process.env;

const COMMIT_SHA =
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA;

process.env.SENTRY_DSN = SENTRY_DSN;

module.exports = withMDX(
  withSourceMaps(
    withCSS(
      withSASS({
        webpack: (config, options) => {
          config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
              loader: "url-loader",
              options: {
                limit: 100000,
              },
            },
          });

          if (!options.isServer) {
            config.resolve.alias["@sentry/node"] = "@sentry/browser";
          }

          if (
            SENTRY_DSN &&
            SENTRY_ORG &&
            SENTRY_PROJECT &&
            SENTRY_AUTH_TOKEN &&
            COMMIT_SHA &&
            NODE_ENV === "production"
          ) {
            config.plugins.push(
              new SentryWebpackPlugin({
                include: ".next",
                ignore: ["node_modules"],
                urlPrefix: "~/_next",
                release: COMMIT_SHA,
              })
            );
          }

          config.plugins.push(
            new MonacoWebpackPlugin({
              // Add languages as needed...
              languages: [
                "html",
                "css",
                "yaml",
                "json",
                "javascript",
                "typescript",
                "python",
                "java",
                "go",
                "php",
                "ruby",
                "objective-c",
                "cpp",
                "markdown",
                "xml",
                "rust",
                "swift",
                "dockerfile",
              ],
              filename: "static/[name].worker.js",
            })
          );
          return config;
        },
      })
    )
  )
);
