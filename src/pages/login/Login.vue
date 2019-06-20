<!--
 * @Description:
 * @Author: xiabing
 * @Date: 2019-06-19 10:31:35
 * @LastEditors: xiabing
 * @LastEditTime: 2019-06-19 18:42:02
 -->

<template>
	<div class="">
		Login
		<div @click="set">set</div>
		<div @click="get">get</div>

	</div>
</template>

<script>
import { _local } from 'js/store'
export default {
	name: 'Login',
	data() {
		return {}
	},
	components: {},
	methods: {
		set() {
			_local.set('access_token', '123456');
		},
		get() {
			alert(_local.get('access_token'));
		},
		getList() {
			let data = {
				pageNum: 1
			};
			this.axios.get("/api/journalismApi", data).then((res) => {
				console.log(res);
				this.$message.success("删除成功");
			});
		}
	},
	activated() {
		this.getList();
	}
}
</script>

<style scoped lang="stylus"></style>
