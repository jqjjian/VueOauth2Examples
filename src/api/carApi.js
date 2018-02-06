import config from './config';

let brandUrl = '/car/brand';
let styleUrl = '/car/style';
let styleyearUrl = '/car/styleyear';
let modelUrl = '/car/model';

const requestBrand = {
    p: ['get,/car/brand'],
    r: params => {
        return config.get(brandUrl, params);
    }
};

const requestStyle = {
    p: ['get,/car/style'],
    r: params => {
        return config.get(styleUrl, params);
    }
};

const requestYear = {
    p: ['get,/car/styleyear'],
    r: params => {
        return config.get(styleyearUrl, params);
    }
};

const requestModel = {
    p: ['get,/car/model'],
    r: params => {
        return config.get(modelUrl, params);
    }
};

export default {
    requestBrand,
    requestStyle,
    requestYear,
    requestModel
};
