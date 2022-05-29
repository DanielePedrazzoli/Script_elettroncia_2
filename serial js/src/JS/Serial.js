class SerialPort{

    /**
     * 
     * @param {number} baudRate il baudRate della porta seriale
     */
    constructor(baudRate){
        this.baudRate = baudRate;
        this.ComPort;
        this.PollingIntervall = null;
        this.OnNewMessage = null;
        this.Reading = false;
    }

    /**
     * 
     * @param {number?} baudRate il baudRate della porta seriale, parametro facoltativo 
     */
    async Init(baudRate ){
        if(baudRate) this.baudRate = baudRate;
        this.ComPort = await navigator.serial.requestPort({})
        this.ComPort.addEventListener('disconnect',  event => alert("Serial disconnected"));
        await this.ComPort.open({baudRate:115200});
    }

    /**
     * Invia in maneira asincorna il dato su seriale aggiungendogli un '\n' alla fine
     * @param {string} data IL dato o la stirnga da inviare tramite seriale
     * @returns void
     */
    async Write(data){
        if(this.ComPort == null){
            alert("Nessuna scheda connessa")
            return;
        }
        const encoder = new TextEncoder();
        const writer = this.ComPort.writable.getWriter();
        await writer.write(encoder.encode(data + "\r"));
        writer.releaseLock();
    }

    /**
     * 
     * @param {number} timeout Timeout per l'intervallo di polling della seriale
     */
    StartListen(timeout){
        this.PollingIntervall = setInterval( async()=>this.DataAvaiable(), timeout? timeout: 10)
    }

    /**
     * Rimuove l'intervallo e quindi il polling dalla seriale
     */
    StopListen(){
        clearInterval(this.PollingIntervall)
    }

    /**
     * 
     * @returns Esegue un polling sulla seria e legge fino a 250 byte dalla seriale alla volta
     */
    async DataAvaiable(){

        if(!this.ComPort || this.Reading) return;

 
        while (this.ComPort.readable) {
            this.reader = this.ComPort.readable.getReader();
            try {
                while (true) {

                    this.Reading = true
                    const { value, done } = await this.reader.read();

                    if (done) {
                        this.Reading = false
                        break;
                    }
                    this.OnNewMessage(value, this)
                }
            } catch (error) {
                console.log(error)
            } finally {
                this.reader.releaseLock();
            }
        }

        if(!this.PollingIntervall){
            await this.reader.cancel()
            await this.ComPort.close()
        }

    }

    SetOnNewMessage(callback){
        this.OnNewMessage = callback;
    }

    async Destroy(){
        if(this.ComPort == null){
            alert("Nessuna scheda connessa")
            return
        }
        this.StopListen()
      
        
    }
}