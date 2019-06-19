import {
    getStore
} from 'js/store'


const state = {
	news: localStorage.getItem('news'),
	// 主题颜色
	theme: getStore({
		name: 'theme'
	}) || '#1E56A0',
	options: getStore({
		name: 'options'
	}) || [{
		name: '首页',
		route: "/"
	}],
	activeIndex: getStore({
		name: 'activeIndex'
	}) || '/',
	userInfo: getStore({
		name: 'userInfo'
	}),
	// 窗口高度
	windowH: null,
	// 窗口宽度
	windowW: null,
	// 是显示侧边栏
	isOpenSidebar: false,
	// 域名相关
	domain: {
		prefix: "www.",
		suffix: ".ec-chain.com"
	},
}

export default state
