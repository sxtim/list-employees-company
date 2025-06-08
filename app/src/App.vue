<template>
	<v-app>
		<v-overlay :value="isPreloader">
			<span>Идет загрузка...</span>
		</v-overlay>
		<v-card hover color="primary" class="text-center">
			<h2 style="color: white">Отчёт по затраченному времени</h2>
		</v-card>
		<v-main>
			<ReportPage />
		</v-main>
	</v-app>
</template>

<script>
import ReportPage from "./pages/ReportPage"

export default {
	name: "App",

	components: { ReportPage },
	async created() {
		this.$eventBus.$on(
			"preloader",
			() => (this.isPreloader = !this.isPreloader)
		)
	},
	methods: {},
	computed: {
		window: () => window,
	},
	data: () => ({
		isPreloader: false,
	}),
}
</script>
<style>
body,
html {
	overflow-y: auto !important;
}

.v-data-table
	> .v-data-table__wrapper
	tbody
	tr.v-data-table__expanded__content {
	box-shadow: none !important;
}
</style>
