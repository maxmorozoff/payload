import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import * as terser from 'terser'
import TerserJSPlugin from 'terser-webpack-plugin' // IMPORTANT - DO NOT REMOVE: This is required for pnpm's default isolated mode to work - even though the import is not used. This is due to a typescript bug: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189. (tsbugisolatedmode)
import OptimizeCSSAssetsPlugin from 'css-minimizer-webpack-plugin'

export default {
  entry: {
    main: [path.resolve(__dirname, '../../admin/components/index.js')],
  },
  externals: {
    react: 'react',
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(t|j)sx?$/,
        /*resolve: {
                    fullySpecified: false
                },*/
        use: [
          {
            loader: require.resolve('swc-loader'),
          },
        ],
      },
      {
        oneOf: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          },
          {
            sideEffects: true,
            test: /\.(sa|sc|c)ss$/,
            use: [
              MiniCSSExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: ['postcss-preset-env'],
                  },
                },
              },
              'sass-loader',
            ],
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../../exports/components'),
    publicPath: '/',
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'styles.css',
      ignoreOrder: true,
    }),
  ],
  resolve: {
    alias: {
      'payload-scss-overrides': path.resolve(__dirname, '../../admin/scss/overrides.scss'),
    },
    mainFiles: ['index'],
    modules: ['node_modules', path.resolve(__dirname, '../../../node_modules')],
  },
  stats: 'errors-only',
}