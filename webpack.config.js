// Webpack uses this to work with directories
const path = require('path');

// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = (env) => {
    return {
        // Path to your entry point. From this file Webpack will begin his work
        entry: './src/index.js',
      
        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'jstream.bundle.js',
          library: 'jstream',
          libraryTarget: 'commonjs-module'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        },
      
        // Default mode for Webpack is production.
        // Depending on mode Webpack will apply different things
        // on final bundle. For now we don't need production's JavaScript 
        // minifying and other thing so let's set mode to development
        mode: 'development'        
    };
};
