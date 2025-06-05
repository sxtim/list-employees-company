<template>
	<v-card class="mt-4">
		<v-card-title>Общий итог</v-card-title>
		<v-card-text>
			<v-row>
				<v-col>
					<strong>Всего времени запланировано:</strong>
					{{ totalTimeEstimate }} ч
				</v-col>
				<v-col>
					<strong>Всего времени затрачено:</strong> {{ totalTimeSpent }} ч
				</v-col>
				<v-col> <strong>Всего задач:</strong> {{ totalTasks }} </v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: "ReportTotal",
	props: {
		tasks: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		totalTimeEstimate() {
			const totalSeconds = this.tasks.reduce(
				(sum, task) => sum + Number(task.timeEstimate || 0),
				0
			)
			return (totalSeconds / 3600).toFixed(2)
		},
		totalTimeSpent() {
			const totalSeconds = this.tasks.reduce(
				(sum, task) => sum + Number(task.timeSpentInLogs || 0),
				0
			)
			return (totalSeconds / 3600).toFixed(2)
		},
		totalTasks() {
			return this.tasks.length
		},
	},
}
</script>
