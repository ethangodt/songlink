var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'inline-source-map',
	entry: [
		'webpack-hot-middleware/client',
		'./client/client.js'
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [
		{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				optional: [ 'runtime' ],
				stage: 2,
				env: {
					development: {
						plugins: [
							'react-display-name',
							'react-transform'
						],
						extra: {
							'react-transform': {
								transforms: [
									{
										transform:	'react-transform-hmr',
										imports: [ 'react' ],
										locals:	[ 'module' ]
									}
								]
							}
						}
					}
				}
			}
		},
		{
			test: /\.scss$/,
			loaders: ["style", "css", "sass"]
		}
		]
	}
}
