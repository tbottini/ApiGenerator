//renvoie les requetes sql selon les types d'actions
const assert = require('assert')

class ControllerPostgresql {
	constructor(param) {
		this.attr = param.attr
		this.dict = param.dict
		this.name = param.name
	}

	getInsertSql() {
		let attrField = this.attr.map((a) => a.name).join(',')

		let valuesUnknow = this.attr
			.map((attribute) => attribute.strInsert(this.name))
			.join(',')
		return `INSERT INTO ${this.name} (${attrField}) VALUES (${valuesUnknow})`
	}

	getCreateSql() {
		let attrFields = this.attr
			.map((attr) => attr.getCreateStr())
			.join(',\n')
		return `CREATE TABLE IF NOT EXISTS ${this.name} (
						id SERIAL PRIMARY KEY ,
						${attrFields})`
	}

	filterSql(filter) {
		var filterStr =
			' where ' +
			filter
				.map((f) => {
					var value = this.dict[f[0]].wrapper(f[1])
					return f[0] + ' = ' + value
				})
				.join(' and ')
		return filterStr
	}

	sort(sortAttr) {
		return ' order by ' + sortAttr.map((f) => f[0]).join(', ')
	}

	getAllSql(research, filterStr, sortStr, innerJoinSql) {
		return (
			`select ${research} from ` +
			this.name +
			innerJoinSql +
			filterStr +
			sortStr
		)
	}

	searchSql(attribute, token) {
		return (
			`select * from ${this.name} where ` + attribute.getSearchSql(token)
		)
	}

	get(research, tableName) {
		return `select ${research} from ${tableName} where \\? = \\?`
	}

	getDefaultSql() {
		return (
			this.name +
			'.id, ' +
			this.attr
				.filter((a) => {
					return !a.private
				})
				.map((a) => this.name + '.' + a.name)
				.join(', ')
		)
	}

	/*
    renvoie des str Sql permettant de récupéré un attribut
    sur une autre table
    en fonction de l'id procuré par ce controlleur
  */
	getRelationInterSql(rel) {
		return {
			attr: rel.attr_name || rel.table_get,
			table_name: rel.table_get,
			sql: `select ${rel.table_get}.* from ${rel.table_link}
            inner join ${rel.table_get}
            on ${rel.table_get}.id = ${rel.table_link}.${rel.search_attr}
            where ${rel.table_link}.${rel.link_attr} = `
		}
	}

	getRelationSimpleSql(rel) {
		return {
			attr: rel.attr_name || rel.table_get,
			table_name: rel.table_get,
			sql: `select * from ${rel.table_get}
            where ${rel.link_attr} = `
		}
	}

	//return array of sql String
	getRelationSql(relation) {
		var relationSql = []
		if (!relation) return relationSql
		relation.forEach((rel) => {
			if (rel.link == 'inter') rel = this.getRelationInterSql(rel)
			else if (rel.link == 'simple' || rel.link == 'image')
				rel = this.getRelationSimpleSql(rel)
			else return assert('bad relation type for relation table')
			relationSql.push(rel)
		})
		return relationSql
	}

	innerJoinSql(rel) {
		return ` inner join ${rel.table_get}
    on ${this.name}.id = ${rel.table_link}.${rel.link_attr}`
	}

	async ajustNextInterval() {
		const results = await Promise.all([
			db.get(`SELECT MAX(id) FROM ${this.name}`),
			db.get(`SELECT nextval('${this.name}_id_seq')`)
		])

		if (results[0].max > parseInt(results[1].nextval)) {
			await db.run(
				`SELECT setval('${this.name}_id_seq', (SELECT MAX(id) FROM ${this.name})+1)`
			)
		}
	}
}

module.exports = ControllerPostgresql
