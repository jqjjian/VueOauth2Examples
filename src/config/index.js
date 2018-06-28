export default {
    client: {
        client_id: '75c666ad-752b-48be-b76a-aca75776eec3',
        client_secret: 'aa6f3fd6-35ff-46da-a70b-2e73ab83ba1e'
    },
    allowUrls: {
        // 'http://47.92.49.1:8090/api/v1/sys/user/resources/token': true,
        // 'http://47.92.49.1:8093/oauth/token': true,
        // '/reservation/index': false
        '/api/v1/sys/user/resources/token': true,
        '/oauth/token': true,
        '/oauth/revoke_token': true,
        '/reservation/index': false
    }
}
