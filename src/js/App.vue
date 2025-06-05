<template>
	<v-app>
		<v-main>
			<v-container>
				<h1 class="mb-4">Отчет по затраченному времени</h1>
				<report-filter :users="users" @filter-changed="onFilterUpdate" />
				<report-table :tasks="filteredTasks" :users="users" />
				<report-total :tasks="filteredTasks" />
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
import { getAll } from "./bx24.js"
import ReportFilter from "./components/ReportFilter.vue"
import ReportTable from "./components/ReportTable.vue"
import ReportTotal from "./components/ReportTotal.vue"

export default {
	name: "App",
	components: {
		ReportFilter,
		ReportTable,
		ReportTotal,
	},
	data() {
		return {
			users: [],
			tasks: [],
			filters: {
				userId: null,
				status: null,
				dateFrom: null,
				dateTo: null,
			},
		}
	},
	computed: {
		filteredTasks() {
			let tasks = this.tasks

			if (this.filters.userId) {
				tasks = tasks.filter(task => task.responsibleId === this.filters.userId)
			}

			if (this.filters.status) {
				tasks = tasks.filter(task => task.status === this.filters.status)
			}

			if (this.filters.dateFrom) {
				tasks = tasks.filter(task => {
					if (!task.closedDate) return false
					return new Date(task.closedDate) >= new Date(this.filters.dateFrom)
				})
			}

			if (this.filters.dateTo) {
				tasks = tasks.filter(task => {
					if (!task.closedDate) return false
					return new Date(task.closedDate) <= new Date(this.filters.dateTo)
				})
			}

			return tasks
		},
	},
	methods: {
		onFilterUpdate({ filterName, value }) {
			this.filters[filterName] = value
		},
	},
	async created() {
		// Инициализация приложения Битрикс24
		BX24.init(async () => {
			// Получаем пользователей и задачи параллельно
			const [users, tasks] = await Promise.all([
				getAll("user.get", { FILTER: { ACTIVE: true } }),
				getAll("tasks.task.list", {
					select: [
						"ID",
						"TITLE",
						"RESPONSIBLE_ID",
						"CREATED_DATE",
						"CLOSED_DATE",
						"TIME_ESTIMATE",
						"TIME_SPENT_IN_LOGS",
						"STATUS",
					],
				}),
			])

			this.users = users
			// В задачах приходит объект, нам нужен массив
			this.tasks = tasks.map(t => t.task)
		})
	},
}
</script>

<style>
/* Сюда можно будет добавлять глобальные стили для приложения */
</style>
