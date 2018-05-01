import * as R from 'ramda';
export default {
    SET_CUSTOMER_INFO(state, payload) {
        state.seCustomerInfo = R.clone(payload);
    },
    SET_SELECT_CAR_INDEX(state, payload) {
        state.brandCodeData = R.clone(payload);
    }
};
