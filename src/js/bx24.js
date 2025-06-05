/**
 * Обертка для вызова методов API Bitrix24.
 * @param {string} method - Название метода API.
 * @param {object} params - Параметры метода.
 * @returns {Promise<any>} - Возвращает Promise с результатом вызова.
 */
function callMethod(method, params) {
	return new Promise((resolve, reject) => {
		BX24.callMethod(method, params, result => {
			if (result.error()) {
				console.error(result.error())
				reject(result.error())
			} else {
				resolve(result.data())
			}
		})
	})
}

/**
 * Получает данные постранично, используя BX24.callBatch.
 * @param {string} method - Метод API для вызова.
 * @param {object} params - Параметры для метода.
 * @returns {Promise<Array>} - Массив всех элементов.
 */
async function getAll(method, params = {}) {
	let allItems = []
	let start = 0
	const BATCH_SIZE = 50 // Максимальное количество команд в одном пакете

	while (true) {
		const commands = []
		for (let i = 0; i < BATCH_SIZE; i++) {
			commands.push([method, { ...params, start: start + i * 50 }])
		}

		const results = await callBatch(commands)
		const items = results.flat()

		allItems = allItems.concat(items)

		if (items.length < 50 * BATCH_SIZE) {
			// Если последняя пачка неполная, значит, мы получили все
			break
		}

		start += BATCH_SIZE * 50
	}

	return allItems
}

/**
 * Выполняет пакетные запросы к API.
 * @param {Array<[string, object]>} commands - Массив команд.
 * @returns {Promise<Array<any>>}
 */
function callBatch(commands) {
	return new Promise((resolve, reject) => {
		const cmd = {}
		commands.forEach((command, index) => {
			cmd[index] = `${command[0]}?` + new URLSearchParams(command[1]).toString()
		})

		BX24.callBatch(cmd, result => {
			const data = Object.values(result).map(r => {
				if (r.error()) {
					console.error(r.error())
					// В зависимости от требований, можно или пробросить ошибку, или вернуть пустой массив
					return []
				}
				return r.data()
			})
			resolve(data)
		})
	})
}

export { callMethod, getAll }
