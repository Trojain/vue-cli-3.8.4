import Vue from 'vue'
import Router from 'vue-router'
import { _local } from 'js/store'

// vue路由懒加载  异步加载
const Index = resolve => require(['@/pages/index/Index'], resolve)
const Login = resolve => require(['@/pages/login/login'], resolve)

Vue.use(Router)

let router = new Router({
    routes: [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: '/',
        component: Index,
        meta: {
            title: '首页',
            requireAuth: true // 只要此字段为true，必须做鉴权处理
        }
    }, {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            noNav: true // 不显示nav
        }
    }]
})

let indexScrollTop = 0

router.beforeEach((to, from, next) => {
    // 路由进入下一个路由对象前，判断是否需要登陆
    // 在路由meta对象中由个requireAuth字段，只要此字段为true，必须做鉴权处理
    if (to.matched.some(res => res.meta.requireAuth)) {
        const token = _local.get('access_token');
        console.log(token);
        // 未登录
        if (!token) {
            next({
                path: '/login',
                query: {
                    redirect: to.path // 将跳转的路由path作为参数，登录成功后再跳转到该路由
                }
            })
        } else {
            // 用户信息是否过期
            let overdueTime = token.overdueTime;
            let nowTime = +new Date();
            // 登陆过期和未过期
            if (nowTime > overdueTime) {
                // 登录过期的处理，君可按需处理之后再执行如下方法去登录页面
                // 我这里没有其他处理，直接去了登录页面
                next({
                    path: '/login',
                    query: {
                        redirect: to.path
                    }
                })
            } else {
                next()
            }
        }
    } else {
        next()
    }
    if (to.path !== '/') {
        // 记录现在滚动的位置
        indexScrollTop = document.body.scrollTop
    }
    document.title = to.meta.title || document.title
})
router.afterEach(route => {
    if (route.path !== '/') {
        document.body.scrollTop = 0
    } else {
        Vue.nextTick(() => {
            // 回到之前滚动位置
            document.body.scrollTop = indexScrollTop
        })
    }
})
export default router
