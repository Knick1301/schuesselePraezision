import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const wrap = 'mx-auto w-full max-w-[100rem] px-[clamp(1.25rem,4.5vw,4rem)]'
export const fliess = 'font-sans'

export const TEL = '0176 22 75 92 01'
export const TEL_LINK = 'tel:+4917622759201'
export const MAIL = 'info@schuessele-praezision.de'

export type KopfStil = 'leiste' | 'navy' | 'weiss'

export const VARIANTEN: { basis: string; kopf: KopfStil }[] = [{ basis: '/v2', kopf: 'leiste' }]

export function useV2() {
  const route = useRoute()
  const basis = computed(() => route.matched[0]?.path ?? '/v2')
  const kopf = computed(() => (route.meta.kopf as KopfStil | undefined) ?? 'leiste')
  const pfad = (p = '') => basis.value + p
  const nav = computed(() => [
    { label: 'Leistungen', nr: '01', to: { path: basis.value, hash: '#leistungen' } },
    { label: 'Werkstatt', nr: '02', to: { path: pfad('/werkstatt') } },
    { label: 'Kontakt', nr: '03', to: { path: basis.value, hash: '#kontakt' } },
  ])
  const anfrage = computed(() => ({ path: pfad('/anfrage') }))
  return { basis, kopf, pfad, nav, anfrage }
}
