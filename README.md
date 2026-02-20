# Progetto Dietista

Applicazione React + Vite per creare uno schema alimentare settimanale, modificarlo in modo rapido e stamparlo in formato pagina.

## Funzionalità principali

- Tabella settimanale con 7 giorni e sezioni pasto (colazione, spuntino, pranzo, cena).
- Modifica cella tramite modale: aggiunta/rimozione alimenti, quantità e note.
- Categorie alimentari colorate con legenda.
- Gestione categorie (aggiunta, modifica, eliminazione) in tempo reale.
- Intestazione personalizzabile per paziente, data e titolo schema.
- Salvataggio locale dello schema in file `.dieta` e successivo caricamento.
- Stampa/PDF con layout ottimizzato e disclaimer finale.
- Reset rapido del piano dal menu flottante.

## Stack tecnico

- React 19
- Vite 7
- ESLint 9
- Lucide React (icone)

## Requisiti

- Node.js 18+ (consigliato LTS)
- npm

## Avvio locale

1. Installa le dipendenze:

	```bash
	npm install
	```

2. Avvio consigliato (frontend + API insieme):

  ```bash
  npm run dev:all
  ```

3. In alternativa, avvio separato:

  API categorie (terminale 1)

  ```bash
  npm run dev:api
  ```

  Frontend (terminale 2)

	```bash
	npm run dev
	```

4. Build produzione:

	```bash
	npm run build
	```

5. Preview build:

	```bash
	npm run preview
	```

6. Controllo lint:

	```bash
	npm run lint
	```

## Persistenza categorie

- Le categorie vengono salvate in un file JSON lato server: `server/data/categories.json`.
- Le modifiche fatte da interfaccia (aggiungi/modifica/elimina) sono persistenti tra riavvii dell'app.
- Se l'API non è raggiungibile, il frontend usa le categorie di default in sola lettura runtime.
- In sviluppo, l'API viene avviata in watch mode (`npm run dev:api`) e si riavvia automaticamente quando modifichi i file nel backend.

## Persistenza disclaimer

- Il disclaimer di stampa è salvato in `server/data/settings.json`.
- Puoi modificarlo dal menu flottante con il comando **Disclaimer**.
- La modifica è persistente e viene ricaricata ai successivi avvii del browser/app.

## Uso rapido

- Clicca una cella della tabella per aprire la modale di modifica.
- Inserisci alimento, quantità opzionale e categoria.
- Aggiungi eventuali note della cella.
- Usa il pulsante menu in basso a destra per:
  - aprire la gestione categorie,
  - salvare lo schema su file `.dieta`,
  - caricare uno schema da file `.dieta`,
  - stampare,
  - svuotare il piano.

## Salvataggio e caricamento file `.dieta`

- Dal menu flottante usa **Salva** per esportare lo schema corrente in un file locale con estensione `.dieta`.
- Il nome file viene generato dai campi del foglio: `Paziente - Titolo - YYYYMMDD.dieta`.
- Il file contiene: piano settimanale, nome paziente, data, titolo e disclaimer.
- Usa **Carica** per selezionare un file `.dieta` precedentemente esportato e ripristinare i dati per ulteriori modifiche.

## Stampa

- La stampa usa regole CSS dedicate per il formato pagina.
- I controlli interattivi vengono nascosti automaticamente in print.
- Il footer con disclaimer viene mostrato in fondo al documento stampato.

## Struttura progetto

- src/App.jsx: orchestrazione stato principale e layout.
- src/components: componenti UI (tabella, modali, stampa, menu, legenda).
- src/context: gestione stato condiviso categorie.
- src/data: dati iniziali piano e categorie.

## Troubleshooting

- La stampa non rispetta il layout:
  - verifica anteprima in Chrome/Edge,
  - usa scala 100%,
  - disattiva intestazioni/piè di pagina del browser,
  - abilita grafica di sfondo se necessario.
- PDF tagliato o impaginazione anomala:
  - prova margini predefiniti del browser,
  - evita zoom del browser diverso da 100%,
  - rigenera il PDF dalla preview di stampa.
- Modifiche non visibili dopo aggiornamenti al codice:
  - forza refresh della pagina (Ctrl+F5),
  - riavvia server dev con `npm run dev`.
- Errori dipendenze o ambiente:
  - elimina `node_modules` e file lock,
  - reinstalla con `npm install`,
  - verifica versione Node.js 18+.
- Errori lint:
  - esegui `npm run lint` e correggi i file indicati,
  - se necessario, riavvia editor/TS server.

## Note

Lo schema alimentare ha finalità illustrativa e non sostituisce un parere medico o nutrizionale professionale.
