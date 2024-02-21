import { Path } from "@config/Path";
import qs from "qs";
import { UserModel } from "@model/UserModel";
import LocalStorageUtility from "@utils/LocalStorageUtility";
import { message } from "antd";
import axios, { AxiosError, AxiosRequestConfig, } from "axios";

const instance = axios.create({
    timeout: 20000,
    withCredentials: false,
    responseType: "json",
    headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json; charset:UTF-8'
    },
    // baseURL: "http://localhost:3000",
    // baseUrl: 'https://dev-admin.gongsiltoday.com/',
    baseUrl: "api-proxy123",
    paramsSerializer: params => qs.stringify(params),
} as AxiosRequestConfig);

instance.interceptors.request.use((config) => {
    const user = LocalStorageUtility.getJSON(LocalStorageUtility.user_key)

    if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user?.accessToken}`
    }

    // if (config.params) {
    //     if (config.params.isLock) return config;

    //     history.push({
    //         search: `?${queryString.stringify(config.params)}`
    //     });
    // }

    return config;
});

instance.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response) {

        const { status, data, config } = error.response;
        if (status === 401 || status === 403) {
            // TODO: 토큰만료의 경우 토큰 재발급 받는 Process 개발
            //return axios.post("/api/accounts/token/refresh").then(() => instance.request(config));
            if (
                error?.config?.url === '/api/accounts/login'
                // (error?.config?.url || '').startsWith('/api/accounts/exists/login-id/')
            ) {
                return error.response;
            } else {
                LocalStorageUtility.remove(LocalStorageUtility.user_key, () => {
                    location.href = Path.account.login
                })
            }

            // if (data?.message == "접근 권한이 없습니다.") {
            //     return message.info('가입 심사중입니다.');
            // }

            // if (data?.message.indexOf("비밀번호") >= 0) {
            //     return message.info('가입 심사중입니다.');
            // }

            // message.error('인증되지 않은 사용자입니다.', 1, () => {
            // location.href = Path.account.login
            // })

            // throw Error('인증되지 않은 사용자입니다.')
        }

        //         if (status === 403) {
        //             console.log("403", data, config);
        //         }

        if (status === 500) {
            console.log("500", data, config);
        }
    }

    return error.response;
});

export default instance;