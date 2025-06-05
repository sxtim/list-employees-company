<template>
	<v-card>
		<v-card-title>
			Отчет
			<v-spacer></v-spacer>
			<v-switch
				v-model="isGrouped"
				label="Группировать по сотруднику"
			></v-switch>
		</v-card-title>
		<v-card-text>
			<v-data-table
				:headers="tableHeaders"
				:items="tableItems"
				class="elevation-1"
			></v-data-table>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: "ReportTable",
	props: {
		tasks: {
			type: Array,
			default: () => [],
		},
		users: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			isGrouped: false,
		}
	},
	computed: {
		userMap() {
			const map = new Map()
			this.users.forEach(user =>
				map.set(user.ID, `${user.NAME} ${user.LAST_NAME}`)
			)
			return map
		},
		tableHeaders() {
			if (this.isGrouped) {
				return [
					{ title: "Сотрудник", key: "responsible" },
					{ title: "Кол-во задач", key: "taskCount" },
					{ title: "Запланировано (ч)", key: "timeEstimate" },
					{ title: "Затрачено (ч)", key: "timeSpent" },
				]
			}
			return [
				{ title: "Сотрудник", key: "responsible" },
				{ title: "Задача", key: "title" },
				{ title: "Запланировано (ч)", key: "timeEstimate" },
				{ title: "Затрачено (ч)", key: "timeSpent" },
				{ title: "Дней на выполнение", key: "daysToComplete" },
			]
		},
		tableItems() {
			if (this.isGrouped) {
				// Режим №1: Группировка по сотруднику
				const grouped = {}
				this.tasks.forEach(task => {
					const userId = task.responsibleId
					if (!grouped[userId]) {
						grouped[userId] = {
							responsible: this.userMap.get(userId) || "Не назначен",
							taskCount: 0,
							timeEstimate: 0,
							timeSpent: 0,
						}
					}
					grouped[userId].taskCount++
					grouped[userId].timeEstimate += Number(task.timeEstimate || 0)
					grouped[userId].timeSpent += Number(task.timeSpentInLogs || 0)
				})
				return Object.values(grouped).map(item => ({
					...item,
					timeEstimate: (item.timeEstimate / 3600).toFixed(2),
					timeSpent: (item.timeSpent / 3600).toFixed(2),
				}))
			} else {
				// Режим №2: Одна строка - одна задача
				return this.tasks.map(task => {
					const startDate = task.createdDate ? new Date(task.createdDate) : null
					const closedDate = task.closedDate ? new Date(task.closedDate) : null
					let daysToComplete = "N/A"
					if (startDate && closedDate) {
						const diffTime = Math.abs(closedDate - startDate)
						daysToComplete = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
					}

					return {
						responsible: this.userMap.get(task.responsibleId) || "Не назначен",
						title: task.title,
						timeEstimate: (Number(task.timeEstimate || 0) / 3600).toFixed(2),
						timeSpent: (Number(task.timeSpentInLogs || 0) / 3600).toFixed(2),
						daysToComplete: daysToComplete,
					}
				})
			}
		},
	},
}
</script>
