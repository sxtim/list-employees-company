<template>
	<v-container fluid>
		<v-card class="mb-4 pa-4">
			<v-row>
				<!-- Фильтр по сотрудникам -->
				<v-col cols="12" md="3">
					<v-select
						v-model="filters.users"
						label="Сотрудник"
						:items="users"
						item-text="name"
						item-value="id"
						multiple
						clearable
					></v-select>
				</v-col>

				<!-- Фильтр по статусу -->
				<v-col cols="12" md="3">
					<v-select
						v-model="filters.statuses"
						label="Статус задачи"
						:items="statuses"
						item-text="text"
						item-value="value"
						multiple
						clearable
					></v-select>
				</v-col>

				<!-- Фильтр по периоду -->
				<v-col cols="12" md="4">
					<v-menu
						ref="dateMenu"
						v-model="dateMenu"
						:close-on-content-click="false"
						transition="scale-transition"
						offset-y
						min-width="auto"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								v-model="dateRangeText"
								v-bind="attrs"
								v-on="on"
								label="Период"
								prepend-icon="mdi-calendar"
								readonly
							></v-text-field>
						</template>
						<v-date-picker v-model="filters.period" range no-title scrollable>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="dateMenu = false"
								>Отмена</v-btn
							>
							<v-btn text color="primary" @click="applyDateFilter">OK</v-btn>
						</v-date-picker>
					</v-menu>
				</v-col>

				<!-- Переключатель режима -->
				<v-col cols="12" md="2">
					<v-switch
						v-model="isGrouped"
						label="Группировать по сотрудникам"
					></v-switch>
				</v-col>
			</v-row>
		</v-card>

		<!-- Таблица с отчетом -->
		<v-card>
			<v-data-table
				:headers="reportHeaders"
				:items="reportItems"
				disable-pagination
				hide-default-footer
			>
				<template v-slot:body.append>
					<tr class="font-weight-bold">
						<td :colspan="reportHeaders.length - 3" class="text-right">
							Общий итог:
						</td>
						<td class="text-left">{{ summary.totalPlanned.toFixed(1) }}</td>
						<td class="text-left">{{ summary.totalSpent.toFixed(1) }}</td>
						<td class="text-left">{{ summary.totalTasks }}</td>
					</tr>
				</template>
			</v-data-table>
		</v-card>
	</v-container>
</template>

<script>
import { bx24methods } from "@/utils/methodsBX24"
import moment from "moment"

export default {
	name: "ReportPage",
	mixins: [bx24methods],
	data() {
		return {
			isGrouped: false,
			reportData: [],
			filters: {
				users: [],
				statuses: [],
				period: [],
			},
			users: [],
			statuses: [
				{ text: "Завершена", value: 5 },
				{ text: "Выполняется", value: 3 },
			],
			tasks: [],
			headers: [
				{ text: "Сотрудник", value: "responsibleName" },
				{ text: "Задача", value: "title" },
				{ text: "Плановое время (ч)", value: "timeEstimate" },
				{ text: "Затраченное время (ч)", value: "timeSpentInLogs" },
				{ text: "Длительность (дни)", value: "duration" },
			],
			dateMenu: false,
		}
	},
	computed: {
		dateRangeText() {
			return this.filters.period.join(" ~ ")
		},
		processedTasks() {
			if (!this.tasks) return []
			return this.tasks.map(task => {
				const user = this.users.find(u => u.id === task.responsibleId)
				const startDate = moment(task.createdDate)
				const endDate = task.closedDate ? moment(task.closedDate) : moment()

				return {
					...task,
					responsibleName: user ? user.name : "Не назначен",
					timeEstimate: parseFloat(task.timeEstimate / 3600).toFixed(1),
					timeSpentInLogs: parseFloat(task.timeSpentInLogs / 3600).toFixed(1),
					duration: endDate.diff(startDate, "days"),
				}
			})
		},
		summary() {
			const totalPlanned = this.processedTasks.reduce(
				(sum, task) => sum + parseFloat(task.timeEstimate),
				0
			)
			const totalSpent = this.processedTasks.reduce(
				(sum, task) => sum + parseFloat(task.timeSpentInLogs),
				0
			)
			const totalTasks = this.processedTasks.length

			return { totalPlanned, totalSpent, totalTasks }
		},
		reportHeaders() {
			if (this.isGrouped) {
				return [
					{ text: "Сотрудник", value: "responsibleName" },
					{ text: "Кол-во задач", value: "taskCount" },
					{ text: "Плановое время (ч)", value: "totalTimeEstimate" },
					{ text: "Затраченное время (ч)", value: "totalTimeSpent" },
				]
			}
			return this.headers
		},
		reportItems() {
			if (!this.isGrouped) {
				return this.processedTasks
			}

			const grouped = {}
			this.processedTasks.forEach(task => {
				if (!grouped[task.responsibleName]) {
					grouped[task.responsibleName] = {
						responsibleName: task.responsibleName,
						taskCount: 0,
						totalTimeEstimate: 0,
						totalTimeSpent: 0,
					}
				}
				grouped[task.responsibleName].taskCount++
				grouped[task.responsibleName].totalTimeEstimate += parseFloat(
					task.timeEstimate
				)
				grouped[task.responsibleName].totalTimeSpent += parseFloat(
					task.timeSpentInLogs
				)
			})

			return Object.values(grouped).map(group => ({
				...group,
				totalTimeEstimate: group.totalTimeEstimate.toFixed(1),
				totalTimeSpent: group.totalTimeSpent.toFixed(1),
			}))
		},
	},
	watch: {
		"filters.users": "getTasks",
		"filters.statuses": "getTasks",
	},
	async created() {
		await this.getUsers()
		await this.getTasks()
	},
	methods: {
		async getTasks() {
			this.$eventBus.$emit("preloader")
			try {
				const filter = {}
				if (this.filters.users.length) {
					filter.RESPONSIBLE_ID = this.filters.users
				}
				if (this.filters.statuses.length) {
					filter.REAL_STATUS = this.filters.statuses
				}
				if (this.filters.period.length === 2) {
					filter[">=CLOSED_DATE"] = moment(this.filters.period[0]).toISOString()
					filter["<=CLOSED_DATE"] = moment(this.filters.period[1]).toISOString()
				}

				const response = await this.callMethod("tasks.task.list", {
					select: ["*", "UF_*"],
					filter: filter,
				})

				if (response && response[0] && response[0].tasks) {
					this.tasks = response[0].tasks
				} else {
					this.tasks = []
				}
			} catch (e) {
				console.error(e)
			} finally {
				this.$eventBus.$emit("preloader")
			}
		},
		async getUsers() {
			try {
				const usersList = await this.callMethod("user.get", { ACTIVE: true })
				if (Array.isArray(usersList)) {
					this.users = usersList.map(user => ({
						id: user.ID,
						name: `${user.NAME} ${user.LAST_NAME}`,
					}))
				}
			} catch (e) {
				console.error(e)
			}
		},
		applyDateFilter() {
			this.dateMenu = false
			this.getTasks()
		},
	},
}
</script>

<style scoped></style>
