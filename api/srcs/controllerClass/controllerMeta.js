async function checkTable() {
	var scheme = await db.run('schema ' + this.name)
	var sentences = scheme
		.replace('(', ',')
		.replace(/[\(\)\n\t;]/g, ' ')
		.split(',')
	var name = sentences.splice(0, 1)

	sentences = sentences.map((instr) => {
		return instr.split(' ').filter((e) => e)
	})

	var controllerScheme = this.getCreateStr()
	controllerScheme = controllerScheme
		.replace('(', ',')
		.replace(/[\(\)\n\t;]/g, ' ')
		.split(',')
	var nameController = controllerScheme.splice(0, 1)
	controllerScheme = controllerScheme.map((instr) => {
		return instr.split(' ').filter((e) => e)
	})

	//check name table
	controllerScheme.forEach((attribute, j) => {
		attribute.forEach((keyword, i) => {
			if (keyword != sentences[j][i])
				console.log(
					'difference between ' + keyword + ' and ' + sentences[j][i]
				)
		})
	})
}
