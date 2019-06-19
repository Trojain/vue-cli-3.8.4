// 通常通过getters取数据 (this.$store.getters.news;)

export const news = state => state.news
export const theme = state => state.theme // 主题颜色

export const options = state => state.options
export const activeIndex = state => state.activeIndex
export const userInfo = state => state.userInfo
export const windowH = state => state.windowH
export const windowW = state => state.windowW
export const isOpenSidebar = state => state.isOpenSidebar
export const domain = state => state.domain
