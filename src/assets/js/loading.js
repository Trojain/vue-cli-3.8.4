import {
    Loading
} from 'element-ui'
// let needLoadingRequestCount = 0
let loading = null;

export function showLoading() {
    loading = Loading.service({
        lock: true,
        spinner: "el-icon-loading",
        text: '拼命加载中…',
        background: 'rgba(0, 0, 0, 0.4)'
    })
    // if (needLoadingRequestCount === 0) {
    //     loading = Loading.service({
    //         lock: true,
    //         spinner: "el-icon-loading",
    //         text: '拼命加载中…',
    //         background: 'rgba(0, 0, 0, 0.4)'
    //     })
    // }
    // needLoadingRequestCount++
}

export function hideLoading() {
    if (loading !== null) loading.close()
    // if (needLoadingRequestCount <= 0) return
    // needLoadingRequestCount--
    // if (needLoadingRequestCount === 0) {
    //     loading.close()
    // }
}
