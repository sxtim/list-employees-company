<template>
	<v-card class="mb-4">
		<v-card-title>Фильтр</v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="12" md="3">
					<v-select
						label="Сотрудник"
						:items="userItems"
						item-title="name"
						item-value="id"
						clearable
						@update:modelValue="onFilterChange('userId', $event)"
					/>
				</v-col>
				<v-col cols="12" md="3">
					<v-select
						label="Статус задачи"
						:items="statusItems"
						item-title="text"
						item-value="value"
						clearable
						@update:modelValue="onFilterChange('status', $event)"
					/>
				</v-col>
				<v-col cols="12" md="3">
					<v-text-field
						label="Завершены с"
						type="date"
						clearable
						@update:modelValue="onFilterChange('dateFrom', $event)"
					/>
				</v-col>
				<v-col cols="12" md="3">
					<v-text-field
						label="Завершены по"
						type="date"
						clearable
						@update:modelValue="onFilterChange('dateTo', $event)"
					/>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: "ReportFilter",
	props: {
		users: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["filter-changed"],
	data() {
		return {
			statusItems: [
				{ text: "Новая", value: "2" }, // PENDING
				{ text: "Выполняется", value: "3" }, // IN_PROGRESS
				{ text: "Ждет контроля", value: "4" }, // SUPPLIER_FEEDBACK
				{ text: "Завершена", value: "5" }, // COMPLETED
				{ text: "Отложена", value: "6" }, // DEFERRED
			],
		}
	},
	computed: {
		userItems() {
			return this.users.map(user => ({
				id: user.ID,
				name: `${user.NAME} ${user.LAST_NAME}`,
			}))
		},
	},
	methods: {
		onFilterChange(filterName, value) {
			this.$emit("filter-changed", { filterName, value })
		},
	},
}
</script>
