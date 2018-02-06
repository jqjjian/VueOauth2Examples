// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    plugins: {
        'postcss-cssnext': {
            warnForDuplicates: false
        },
        'postcss-import': {},
        'postcss-url': {},
        precss: {},
        cssnano: {
            //calc: { precision: 10 }
        }

        // to edit target browsers: use "browserslist" field in package.json
        // "autoprefixer": {}
    }
};
