export default {
    LOGIN_USER(state, result) {
        // 保存用户资料
        state.loginUser = result
    },
    INIT_TIALIZE(state) {
        // 初始化用户资料
        state.loginUser = null
    }
}
