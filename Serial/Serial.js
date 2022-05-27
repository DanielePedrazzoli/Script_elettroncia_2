class SerialPort{
    constructor(baudRate){
        this.baudRate = baudRate;
        this.ComPort;
        this.PollingIntervall = null;
        this.OnNewMessage = null;
        this.Reading = false;
    }


    async Init(baudRate){
        if(baudRate){
            this.baudRate = baudRate;
        }

        let port = await navigator.serial.requestPort({})
        
        this.ComPort = port;

        this.ComPort.addEventListener('disconnect', event => {
            alert("Serial disconnected")
          });
        await this.ComPort.open({baudRate:115200});

    }

    async Write(data){

        const encoder = new TextEncoder();
        const writer = this.ComPort.writable.getWriter();
        await writer.write(encoder.encode(data + "\r"));
        writer.releaseLock();

    }

    StartListen(time){

        this.PollingIntervall = setInterval( async()=>this.DataAvaiable(), time? time: 10)

    }

    async StopListen(){
        clearInterval(this.PollingIntervall)
    }


    async DataAvaiable(){

        if(!this.ComPort || this.Reading)
            return;

 
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

    }

    SetOnNewMessage(callback){
        this.OnNewMessage = callback;
    }

    Destroy(){
        this.ComPort.close()
        this.ComPort = null
    }
}