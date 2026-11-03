/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Adresse, an die das Anfrageformular sendet (z. B. Formulardienst). Leer = E-Mail-Programm öffnen. */
  readonly VITE_ANFRAGE_ENDPOINT?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
