import config from './config';

let brandUrl = '/car/brand';
let styleUrl = '/car/style';
let styleyearUrl = '/car/styleyear';
let modelUrl = '/car/model';

const requestBrand = {
    p: ['get,/car/brand'],
    r: params => config.get(brandUrl, params)
};

const requestStyle = {
    p: ['get,/car/style'],
    r: params => config.get(styleUrl, params)
};

const requestYear = {
    p: ['get,/car/styleyear'],
    r: params => config.get(styleyearUrl, params)
};

const requestModel = {
    p: ['get,/car/model'],
    r: params => config.get(modelUrl, params)
};

export default {
    requestBrand,
    requestStyle,
    requestYear,
    requestModel
};
