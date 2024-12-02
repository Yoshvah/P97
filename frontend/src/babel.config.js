module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-syntax-nullish-coalescing-operator',
              '@babel/plugin-syntax-optional-chaining',
            ],
          },
        },
      },
    ],
  },
};
