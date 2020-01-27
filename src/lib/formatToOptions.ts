import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import has from 'lodash/has'
import lowerCase from 'lodash/lowerCase'
import upperFirst from 'lodash/upperFirst'

export default (options: Array<{}>) => Array.from(options, (option: { title: string, label: string, value: any, options: Array<{}>, id: string, hint: string, disabled: boolean }) => {
	if (isString(option) || isNumber(option)) {
		return { label: upperFirst(lowerCase(isString(option) ? option : option.toString())), value: option }
	} else if (has(option, 'title') && has(option, 'id')) {
		return { label: option.title, value: option.id, hint: option.hint, disabled: option.disabled }
	} else if (has(option, 'label') && has(option, 'options')) {
		return { label: option.label, options: option.options, hint: option.hint, disabled: option.disabled }
	} else {
		return { label: option.label || upperFirst(lowerCase(option.value)), value: option.value, hint: option.hint, disabled: option.disabled }
	}
})
