<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import PlaceholderText from '../components/PlaceholderText.vue'

const ENDPOINT = import.meta.env.VITE_ANFRAGE_ENDPOINT
const MAIL = 'info@schuessele-praezision.de'
const MAX_MB = 20
const ALLOWED = ['pdf', 'step', 'stp', 'iges', 'igs', 'dxf', 'dwg']

const WERKSTOFFE = ['Aluminium', 'Automatenstahl', 'Edelstahl', 'Messing', 'Technische Kunststoffe', 'Anderer Werkstoff']
const OBERFLAECHEN = ['Eloxieren', 'Brünieren', 'Härten', 'Nitrieren', 'Glasperlenstrahlen']

const form = reactive({
  firma: '',
  ansprechpartner: '',
  email: '',
  telefon: '',
  adresse: '',
  bauteil: '',
  stueckzahl: '' as string | number,
  werkstoff: '',
  werkstoffAnders: '',
  oberflaeche: [] as string[],
  oberflaecheAnders: '',
  termin: '',
  bemerkungen: '',
  datenschutz: false,
  website: '',
})
const files = ref<File[]>([])
const errors = reactive<Record<string, string>>({})
const fileHint = ref('')
const dragging = ref(false)
const status = ref<'form' | 'sending' | 'success' | 'mailto' | 'error'>('form')
const fileInput = ref<HTMLInputElement>()

const today = new Date().toISOString().slice(0, 10)

const ext = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''
const sizeLabel = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`)

function addFiles(list: FileList | null) {
  if (!list) return
  const rejected: string[] = []
  for (const f of Array.from(list)) {
    if (!ALLOWED.includes(ext(f.name))) rejected.push(`${f.name} (Format nicht erlaubt)`)
    else if (f.size > MAX_MB * 1024 * 1024) rejected.push(`${f.name} (größer als ${MAX_MB} MB)`)
    else if (!files.value.some((x) => x.name === f.name && x.size === f.size)) files.value.push(f)
  }
  fileHint.value = rejected.length ? `Nicht übernommen: ${rejected.join(', ')}` : ''
  if (files.value.length) delete errors.dateien
  if (fileInput.value) fileInput.value.value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  addFiles(e.dataTransfer?.files ?? null)
}
const removeFile = (i: number) => files.value.splice(i, 1)

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.email.trim()) errors.email = 'Bitte geben Sie Ihre E-Mail-Adresse an – dorthin schicken wir das Angebot.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Diese E-Mail-Adresse sieht nicht vollständig aus.'
  const n = Number(form.stueckzahl)
  if (!form.stueckzahl && form.stueckzahl !== 0) errors.stueckzahl = 'Bitte geben Sie die Stückzahl an.'
  else if (!Number.isInteger(n) || n < 1) errors.stueckzahl = 'Bitte eine ganze Zahl ab 1 eingeben.'
  if (!files.value.length) errors.dateien = 'Bitte laden Sie mindestens eine Zeichnung oder ein 3D-Modell hoch.'
  if (!form.datenschutz) errors.datenschutz = 'Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.'
  return Object.keys(errors).length === 0
}

const errorList = computed(() => Object.entries(errors))

function summaryText() {
  const werkstoff = form.werkstoff === 'Anderer Werkstoff' ? form.werkstoffAnders || 'Anderer Werkstoff' : form.werkstoff
  const oberflaeche = [...form.oberflaeche, form.oberflaecheAnders].filter(Boolean).join(', ')
  return [
    `Firma: ${form.firma}`,
    `Ansprechpartner: ${form.ansprechpartner}`,
    `E-Mail: ${form.email}`,
    `Telefon: ${form.telefon}`,
    `Adresse / Lieferanschrift: ${form.adresse}`,
    '',
    `Bauteil / Zeichnungsnummer: ${form.bauteil}`,
    `Stückzahl: ${form.stueckzahl}`,
    `Werkstoff: ${werkstoff}`,
    `Oberfläche: ${oberflaeche}`,
    `Wunschtermin: ${form.termin}`,
    '',
    `Bemerkungen: ${form.bemerkungen}`,
    '',
    `Dateien: ${files.value.map((f) => f.name).join(', ')}`,
  ].join('\n')
}

async function submit() {
  if (form.website) return
  if (!validate()) {
    await nextTick()
    document.getElementById('fehler')?.focus()
    return
  }

  if (!ENDPOINT) {
    const subject = `Anfrage: ${form.bauteil || 'Bauteil'} – ${form.stueckzahl} Stück`
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summaryText())}`
    status.value = 'mailto'
    window.scrollTo({ top: 0 })
    return
  }

  status.value = 'sending'
  try {
    const fd = new FormData()
    for (const [k, v] of Object.entries(form)) {
      if (k === 'website') continue
      fd.append(k, Array.isArray(v) ? v.join(', ') : String(v))
    }
    fd.append('zusammenfassung', summaryText())
    files.value.forEach((f) => fd.append('dateien[]', f, f.name))
    const res = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(String(res.status))
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
  window.scrollTo({ top: 0 })
}

const label = 'mb-1.5 block text-sm font-semibold'
const input =
  'w-full border border-navy/40 bg-white px-3 py-2.5 text-[0.95rem] text-navy placeholder:text-navy/40 focus:border-navy focus:outline-2 focus:outline-offset-0 focus:outline-teal aria-[invalid=true]:border-red-700'
const errorText = 'mt-1.5 text-sm text-red-700'
const legend = 'mb-5 flex w-full items-center gap-4 font-mono text-lg font-semibold after:h-px after:flex-1 after:bg-navy/20'
</script>

<template>
  <div class="border-b border-navy/15 bg-paper bg-grid">
  <div class="mx-auto max-w-wide px-pad py-12 md:py-20">
    <div class="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
      <aside class="lg:sticky lg:top-32 lg:self-start">
        <h1 class="mb-6 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.1] font-bold text-balance">
          Was können wir für Sie tun?
        </h1>
        <p class="mb-4 max-w-[32rem] text-lg">
          Schicken Sie uns Ihre Zeichnung und schreiben Sie dazu, wie viele Teile Sie brauchen, aus welchem
          Werkstoff und bis wann. Dann bekommen Sie ein Angebot.
        </p>
        <p class="mb-10 max-w-[32rem]">
          Wenn etwas fehlt oder unklar ist, fragen wir nach. Sie müssen also nicht jedes Feld ausfüllen.
        </p>

        <p class="border-t border-navy/20 pt-6">
          Lieber anrufen?<br />
          <a href="tel:+4917622759201" class="font-mono text-2xl text-navy">0176 22 75 92 01</a>
        </p>
        <p class="mt-2">
          oder schreiben an <a :href="`mailto:${MAIL}`" class="font-mono text-sm break-all">{{ MAIL }}</a>
        </p>
        <p class="mt-4 text-sm text-navy/70">Antwort meist <PlaceholderText>Platzhalter: Zeitraum</PlaceholderText>.</p>
      </aside>

      <div>
        <div v-if="status === 'success' || status === 'mailto'" class="border border-navy bg-white p-6 md:p-8"
          role="status">
          <template v-if="status === 'success'">
            <h2 class="mb-3 text-2xl font-semibold">Danke, Ihre Anfrage ist bei uns.</h2>
            <p class="mb-3">
              Wir sehen uns Zeichnung und Angaben an und melden uns bei Ihnen –
              in der Regel <PlaceholderText>Platzhalter: z. B. innerhalb von 2 Werktagen</PlaceholderText>.
            </p>
            <p>Bei Rückfragen rufen wir Sie an, wenn Sie eine Telefonnummer angegeben haben.</p>
          </template>
          <template v-else>
            <h2 class="mb-3 text-2xl font-semibold">Ihr E-Mail-Programm hat sich geöffnet.</h2>
            <p class="mb-3">
              Die Angaben stehen schon in der E-Mail. Bitte hängen Sie dort noch Ihre Dateien an
              (<span class="font-mono text-sm">{{files.map((f) => f.name).join(', ')}}</span>) und senden Sie die E-Mail
              ab.
            </p>
            <p>
              Hat sich nichts geöffnet? Schreiben Sie direkt an
              <a :href="`mailto:${MAIL}`">{{ MAIL }}</a>.
            </p>
          </template>
          <div class="mt-6 flex flex-wrap gap-3">
            <RouterLink to="/"
              class="inline-flex min-h-[2.9rem] items-center border border-navy bg-navy px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline hover:bg-teal-dark">
              Zur Startseite</RouterLink>
            <button v-if="status === 'mailto'" type="button"
              class="inline-flex min-h-[2.9rem] cursor-pointer items-center border border-navy bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-navy hover:bg-navy hover:text-white"
              @click="status = 'form'">Zurück zum Formular</button>
          </div>
        </div>

          <form v-else novalidate class="space-y-12" @submit.prevent="submit">
            <div v-if="errorList.length" id="fehler" tabindex="-1" role="alert"
              class="border border-red-700 bg-red-50 p-4 text-sm text-red-800 focus:outline-none">
              <p class="mb-1 font-semibold">Bitte prüfen Sie noch:</p>
              <ul class="list-disc pl-5">
                <li v-for="[key, msg] in errorList" :key="key"><a :href="`#${key}`" class="text-red-800">{{ msg }}</a></li>
              </ul>
            </div>
            <div v-if="status === 'error'" role="alert" class="border border-red-700 bg-red-50 p-4 text-sm text-red-800">
              Das Senden hat nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie an
              <a :href="`mailto:${MAIL}`" class="text-red-800">{{ MAIL }}</a>.
            </div>

            <fieldset>
              <legend :class="legend">Kontakt</legend>
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="firma" :class="label">Firma</label>
                  <input id="firma" v-model="form.firma" type="text" autocomplete="organization" :class="input" />
                </div>
                <div>
                  <label for="ansprechpartner" :class="label">Ansprechpartner</label>
                  <input id="ansprechpartner" v-model="form.ansprechpartner" type="text" autocomplete="name"
                    placeholder="Vor- und Nachname" :class="input" />
                </div>
                <div>
                  <label for="email" :class="label">E-Mail <span class="text-teal-dark">*</span></label>
                  <input id="email" v-model="form.email" type="email" autocomplete="email" required
                    :aria-invalid="!!errors.email" :aria-describedby="errors.email ? 'email-fehler' : undefined"
                    :class="input" />
                  <p v-if="errors.email" id="email-fehler" :class="errorText">{{ errors.email }}</p>
                </div>
                <div>
                  <label for="telefon" :class="label">Telefon</label>
                  <input id="telefon" v-model="form.telefon" type="tel" autocomplete="tel"
                    aria-describedby="telefon-hinweis" :class="input" />
                  <p id="telefon-hinweis" class="mt-1.5 text-sm text-navy/60">Für schnelle Rückfragen zur Zeichnung.</p>
                </div>
                <div class="sm:col-span-2">
                  <label for="adresse" :class="label">Adresse / Lieferanschrift</label>
                  <textarea id="adresse" v-model="form.adresse" rows="2" autocomplete="street-address" :class="input" />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend :class="legend">Bauteil</legend>
              <div class="grid gap-5 sm:grid-cols-2">
                <div>
                  <label for="bauteil" :class="label">Bauteilbezeichnung / Zeichnungsnummer</label>
                  <input id="bauteil" v-model="form.bauteil" type="text" :class="input" />
                </div>
                <div>
                  <label for="stueckzahl" :class="label">Stückzahl <span class="text-teal-dark">*</span></label>
                  <input id="stueckzahl" v-model="form.stueckzahl" type="number" inputmode="numeric" min="1" step="1"
                    required :aria-invalid="!!errors.stueckzahl"
                    :aria-describedby="errors.stueckzahl ? 'stueckzahl-fehler' : undefined" :class="input" />
                  <p v-if="errors.stueckzahl" id="stueckzahl-fehler" :class="errorText">{{ errors.stueckzahl }}</p>
                </div>
                <div>
                  <label for="werkstoff" :class="label">Werkstoff</label>
                  <select id="werkstoff" v-model="form.werkstoff" :class="input">
                    <option value="">Bitte wählen</option>
                    <option v-for="w in WERKSTOFFE" :key="w" :value="w">{{ w }}</option>
                  </select>
                </div>
                <div v-if="form.werkstoff === 'Anderer Werkstoff'">
                  <label for="werkstoffAnders" :class="label">Welcher Werkstoff?</label>
                  <input id="werkstoffAnders" v-model="form.werkstoffAnders" type="text"
                    placeholder="z. B. 1.4404, POM, CuZn39Pb3" :class="input" />
                </div>
                <div>
                  <label for="termin" :class="label">Wunschliefertermin</label>
                  <input id="termin" v-model="form.termin" type="date" :min="today" :class="input" />
                </div>
              </div>

              <fieldset class="mt-6">
                <legend :class="label">Oberflächenbehandlung</legend>
                <div class="flex flex-wrap gap-x-6 gap-y-2">
                  <label v-for="o in OBERFLAECHEN" :key="o" class="flex cursor-pointer items-center gap-2 text-[0.95rem]">
                    <input v-model="form.oberflaeche" type="checkbox" :value="o" class="size-4 accent-teal-dark" />
                    {{ o }}
                  </label>
                </div>
                <label for="oberflaecheAnders" class="sr-only">Andere Oberflächenbehandlung</label>
                <input id="oberflaecheAnders" v-model="form.oberflaecheAnders" type="text" placeholder="Andere Behandlung"
                  :class="[input, 'mt-3 sm:max-w-[24rem]']" />
              </fieldset>
            </fieldset>

            <fieldset>
              <legend :class="legend">Zeichnung &amp; 3D-Daten <span class="text-teal-dark">*</span></legend>
              <div id="dateien"
                class="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed px-6 py-10 text-center transition-colors"
                :class="[
                  dragging ? 'border-teal bg-teal/5' : errors.dateien ? 'border-red-700 bg-red-50/40' : 'border-navy/35 bg-paper',
                ]" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="onDrop">
                <svg viewBox="0 0 24 24" class="size-8 text-teal-dark" aria-hidden="true">
                  <path d="M12 16V4m0 0-4 4m4-4 4 4M4 15v4h16v-4" fill="none" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="font-semibold">Dateien hierher ziehen</p>
                <p class="text-sm">
                  oder
                  <label for="datei-input" class="cursor-pointer text-teal-dark underline underline-offset-[0.2em]">vom
                    Computer
                    auswählen</label>
                </p>
                <input id="datei-input" ref="fileInput" type="file" multiple class="sr-only"
                  :accept="ALLOWED.map((e) => '.' + e).join(',')"
                  :aria-describedby="'datei-formate' + (errors.dateien ? ' dateien-fehler' : '')"
                  @change="addFiles(($event.target as HTMLInputElement).files)" />
                <p id="datei-formate" class="font-mono text-xs text-navy/60">
                  PDF (2D-Zeichnung mit Toleranzen) · STEP / STP · IGES · DXF / DWG · max. {{ MAX_MB }} MB je Datei
                </p>
              </div>
              <p v-if="errors.dateien" id="dateien-fehler" :class="errorText">{{ errors.dateien }}</p>
              <p v-if="fileHint" class="mt-1.5 text-sm text-red-700">{{ fileHint }}</p>

              <ul v-if="files.length" class="mt-4 divide-y divide-navy/15 border border-navy/25 bg-white">
                <li v-for="(f, i) in files" :key="f.name + f.size"
                  class="flex items-center gap-3 px-3 py-2 font-mono text-sm">
                  <span class="w-12 shrink-0 text-xs text-teal-dark uppercase">{{ ext(f.name) }}</span>
                  <span class="min-w-0 flex-1 truncate">{{ f.name }}</span>
                  <span class="shrink-0 text-xs text-navy/60">{{ sizeLabel(f.size) }}</span>
                  <button type="button" class="shrink-0 cursor-pointer px-2 py-1 text-navy/60 hover:text-red-700"
                    :aria-label="`${f.name} entfernen`" @click="removeFile(i)">✕</button>
                </li>
              </ul>
            </fieldset>

            <fieldset>
              <legend :class="legend">Bemerkungen</legend>
              <label for="bemerkungen" class="sr-only">Bemerkungen</label>
              <textarea id="bemerkungen" v-model="form.bemerkungen" rows="5" :class="input"
                placeholder="z. B. Bauteil muss entgratet sein, Montage zu einer Baugruppe, Prüfprotokoll gewünscht" />
            </fieldset>

            <div class="hidden" aria-hidden="true">
              <label for="website">Website</label>
              <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <div class="space-y-6 border-t border-navy/20 pt-8">
              <div>
                <label for="datenschutz" class="flex cursor-pointer items-start gap-3 text-sm">
                  <input id="datenschutz" v-model="form.datenschutz" type="checkbox" required
                    class="mt-0.5 size-4 shrink-0 accent-teal-dark" :aria-invalid="!!errors.datenschutz"
                    :aria-describedby="errors.datenschutz ? 'datenschutz-fehler' : undefined" />
                  <span>
                    Ich stimme zu, dass meine Angaben und Dateien zur Bearbeitung der Anfrage elektronisch erhoben und
                    gespeichert
                    werden. Weitere Informationen in der <RouterLink to="/datenschutz">Datenschutzerklärung</RouterLink>.
                    <span class="text-teal-dark">*</span>
                  </span>
                </label>
                <p v-if="errors.datenschutz" id="datenschutz-fehler" :class="errorText">{{ errors.datenschutz }}</p>
              </div>

              <button type="submit" :disabled="status === 'sending'"
                class="inline-flex min-h-[3.1rem] cursor-pointer items-center justify-center border border-navy bg-navy px-7 py-3 font-semibold text-white transition-colors hover:border-teal-dark hover:bg-teal-dark disabled:cursor-wait disabled:opacity-60">
                {{ status === 'sending' ? 'Wird gesendet …' : 'Anfrage senden' }}
              </button>
            </div>
          </form>
        <p v-if="status !== 'success' && status !== 'mailto'" class="mt-6 text-sm text-navy/60"><span class="text-teal-dark">*</span> Pflichtfelder</p>
      </div>
    </div>
  </div>
  </div>
</template>
