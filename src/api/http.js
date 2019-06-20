/*
 * @Description: 封装axios
 * @Author: xiabing
 * @Date: 2018-09-26 10:27:15
 * @LastEditors: xiabing
 * @LastEditTime: 2019-06-19 18:41:43
 */

import Vue from 'vue'
import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import router from '../router'
// import { setStore, getStore, removeStore } from 'js/store'
import { _local } from 'js/store'
import { showLoading, hideLoading } from '../assets/js/loading';

// 环境的切换(暂时改用本地代理跨域,以下代码暂时不启用)
if (process.env.NODE_ENV === 'development') {
    // 开发模式暂时使用代理，以下代码不需要
    // axios.defaults.baseURL = 'http://192.168.212.11:8080/'; // 可以设置axios的默认请求地址
} else if (process.env.NODE_ENV === 'debug') {
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = '';
}

// 请求超时时间
// axios.defaults.timeout = 10000;

// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(config => {
    console.log('请求拦截器', config);
    showLoading();
    const token = _local.get('access_token');
    // 每次发送请求之前判断是否存在token
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    if (token) {
        // 统一在http请求的header都加上token，不用每次请求都手动添加了
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
}, error => {
    hideLoading();
    return Promise.error(error);
})

// 响应拦截器
axios.interceptors.response.use(response => {
    console.log('响应拦截器', response);
    hideLoading();
    if (Number(response.status) === 200) {
        // blob不拦截， object 非200的报错提示
        if (response.data.constructor !== Blob && Number(response.data.code) !== 200) {
            Vue.prototype.$message.error(response.data.msg)
        }
        return Promise.resolve(response);
    } else {
        Vue.prototype.$message.error(response.data.msg)
        return Promise.reject(response);
    }
}, (error) => {
    hideLoading();
    console.log(error.response);
    // 服务器状态码不是200的情况
    if (error.response.status) {
        switch (error.response.status) {
            // 登录过期则跳转登录页面，并携带当前页面的路径
            // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
            _local.remove('access_token');
            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            });
            break;

        default:
            break;
        }
    }
    Vue.prototype.$message.error(error.response.data.message)
    return Promise.reject(error)
})

// 响应拦截器
// axios.interceptors.response.use(response => {
// 	if (response.status === 200) {
// 		return Promise.resolve(response);
// 	} else {
// 		return Promise.reject(response);
// 	}
// }, error => {
// 	// 服务器状态码不是200的情况
// 	if (error.response.status) {
// 		switch (error.response.status) {
// 			// 401: 未登录
// 			// 未登录则跳转登录页面，并携带当前页面的路径
// 			// 在登录成功后返回当前页面，这一步需要在登录页操作。
// 			case 401:
// 				router.replace({
// 					path: '/login',
// 					query: {
// 						redirect: router.currentRoute.fullPath
// 					}
// 				});
// 				break;
// 				// 403 token过期
// 				// 登录过期对用户进行提示
// 				// 清除本地token和清空vuex中token对象
// 				// 跳转登录页面
// 			case 403:
// 				Toast({
// 					message: '登录过期，请重新登录',
// 					duration: 1000,
// 					forbidClick: true
// 				});
// 				// 清除token
// 				localStorage.removeItem('token');
// 				store.commit('loginSuccess', null);
// 				// 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
// 				setTimeout(() => {
// 					router.replace({
// 						path: '/login',
// 						query: {
// 							redirect: router.currentRoute.fullPath
// 						}
// 					});
// 				}, 1000);
// 				break;
// 				// 404请求不存在
// 			case 404:
// 				Toast({
// 					message: '网络请求不存在',
// 					duration: 1500,
// 					forbidClick: true
// 				});
// 				break;
// 				// 其他错误，直接抛出错误提示
// 			default:
// 				Toast({
// 					message: error.response.data.message,
// 					duration: 1500,
// 					forbidClick: true
// 				});
// 		}
// 		return Promise.reject(error.response);
// 	}
// });

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
                params: params
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err)
            })
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function post(url, params) {
    return new Promise((resolve, reject) => {
        // debugger
        var parameters = url.indexOf('/core/') >= 0 ? params : QS.stringify(params);
        axios.post(url, parameters)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * put方法， 对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * del方法， 对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function del(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, QS.stringify({ data: params }))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * upload方法   文件上传
 * @param {Array} files [文件对象数组]
 */
function upload(files) {
    let param = new FormData(); //创建form对象
    files.map((item) => {
        param.append('files', item); //通过append向form对象添加数据
    })
    let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
    };
    return new Promise((resolve, reject) => {
        axios.post('/api/file-service/file/upload', param, config)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * download方法
 * @param {String} type [请求的方式]
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {String} fileType [导出文件类型] 默认值 xls
 * @param {String} fileName [导出文件名称] 默认值 导出文件
 */
function download(url, params, fileType, fileName) {
    fileType = fileType || 'xls';
    fileName = fileName || '导出文件';
    let config = {
        params: params,
        headers: {
            'content-disposition': "attachment;filename=total." + fileType,
            'Content-Type': 'application/x-download;charset=utf-8'
        },
        responseType: 'blob'
    };
    return new Promise((resolve, reject) => {
        axios.get(url, config)
            .then(err => {
                resolve(err.data);
                if (!err) {
                    return
                }
                let url = window.URL.createObjectURL(err.data);
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `${fileName}.${fileType}`);
                document.body.appendChild(link);
                link.click();
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

export default {
    get,
    post,
    put,
    del,
    upload,
    download
}
