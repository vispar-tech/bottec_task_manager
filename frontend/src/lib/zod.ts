import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as z from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from 'zod-i18n-map/locales/ru/zod.json'

i18next.use(initReactI18next).init({
	lng: 'ru',
	resources: {
		ru: { zod: translation },
	},
})

z.setErrorMap(zodI18nMap)

export { z }
