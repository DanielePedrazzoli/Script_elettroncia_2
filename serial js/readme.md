# Plotter seriale (UART) STEM32

Plotter seriale multicanale scritto in javascript e utilizzabile grazie al browser


## Installazione
Scaricare al cartella da
https://minhaskamal.github.io/DownGit/#/home?url=https:%2F%2Fgithub.com%2FDanielePedrazzoli%2FScript_elettroncia_2%2Ftree%2Fmain%2Fserial%20js%2Fsrc

Per iniziare ad usarlo è sufficiente scaricare i file presenti nella cartella e aprire il file .html con browser tra:
- Google Chrome
- Opera
- Edge

>nota gli atri browser non funzioneranno poiché non posseggono la API serial

## Utilizzo
- Una volta aperta la pagina, collegare la scheda e premere sul pulsante di connessione in alto a sinistra
- Scegliere la porta seriale opportuna e premere connetti
- Se non vengono visualizzati errori la connessione è andata a buon fine

## Ricezione dati

Il monitor di destra permette di visualizzare ogni carattere inviato dalla scheda sulla UART
Questi caratteri verranno poi analizzati per il grafico
- Pulsante di pulizia, questo pulsante cancella completamente la cronologia dei messaggi ricevuti
- Pulsante di export, questo pulsante permette di prendere tutti i dati ricevuti, dividere le stringhe grazie al separatore (di base #) e crea in uscita un file .csv con ogni riga presente nell'aera di testo al momento della pressione. Il file .csv verrà poi in automatico scaricato.

## Invio dati

Per inviare dati è sufficente digitare i dati da inviare nell'area in basso e premere il pulsante invia
Verrà già inserito un **\n** alla fine della stringa prima di essere inviata

## Utilizzo del grafico

Di base il grafico è spento e non si aggiornerà.
Per permettere l'aggiornamento in tempo reale con i dati che arrivano è necessario premere sull'apposito pulsanti di toggle.
Ogni volta che arriva un dato questo viene sommato ad una stringa temporanea.
Quando viene letto un carattere delimitatore, la stringa ottenuta fino a quel momento viene analizzata e i dati vengono inviati al grafico opportuno.
La scelta dei dati al quale inviare i dati è decisa dalla checkbox in alto a destra (sopra il grafico).
Sono infatti presenti 2 grafici ( accelerazione su 3 assi e rotazione su 2 assi).
Quando si visualizza il grafico delle accelerazioni, verranno presi come valori validi i primi 3 valori rispettivamente per assi : **x**,**y** e **z**
Quando si visualizza il grafico degli angoli, verranno presi come valori validi i primi 2 valori rispettivamente per assi : **pitch** e **roll**
**Ogni altro carattere verrà ignorato**

>Si consiglia di non utilizzare il grafico troppo a lungo e fermarlo quando non necessario a causa della grande quantità di Heap che utilizza.
Per quanto ottimizzato su alcuni computer potrebbe creare un problema.
In tal caso è sufficiente chiudere e riaprire

Cambiare da un grafico all'altro invierà in automatico un carattere **d** alla scheda

## Programmatore

Pedrazzoli Daniele