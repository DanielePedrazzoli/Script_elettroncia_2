
// inizializzaione grafici
let plotG = new Grafico(document.getElementById("canvasG"), {Max:1000, Min:-1000, NumberOfStep:200, NumberOfSet:3, Colors:["red", "green", "yellow"]})
let plotA = new Grafico(document.getElementById("canvasA"), {Max:180,  Min:-180,  NumberOfStep:200, NumberOfSet:2, Colors:["white", "orange"]})
plotA.Hide()


// inizializzazione porta seriale
let port  = new SerialPort(115200);
port.SetOnNewMessage(NewMessage)


// inizializzazione area dati ricevuti 
let textRecived = new TextRecived( document.getElementById("chat"))

//inizializzazione varibili gloabali
let ChartModeSelect = document.getElementById("AngoliMode")
let FromLastChar    = ""

ChartModeSelect.onclick = ToggleActiveCart


async function SelectNewPort(){
    await port.Init(115200);
    port.StartListen(1);
}

function ToggleChart(){
    if(CurrentPlot.IsDrawing){
        CurrentPlot.StopDraw()
    }
    else CurrentPlot.StartDraw()
}

async function SendData(){
    await port.Write(document.getElementById("InputText").value)
    document.getElementById("InputText").value = ""
}

function NewMessage(data){

    
    const string = new TextDecoder().decode(data);
    textRecived.AddPlain(string);
    FromLastChar+= string;

    if(!FromLastChar.includes("#")){
        return
    }

    let LastIndexOfSeparator = FromLastChar.lastIndexOf("#");
    let ValidString = FromLastChar.substring(0, LastIndexOfSeparator);

    FromLastChar = FromLastChar.substring(LastIndexOfSeparator+1,FromLastChar.length-1)



    if(document.getElementById("AngoliMode").checked == true){
        CurrentPlot = plotA
        ValidString.split("#").forEach( r=>{

            // controllo se la riga contiene entrambi gli angoli
            // solo in quel caso cntinuo alrimenti viene ingorata
            if(!r.includes("roll") || !r.includes("pitch"))
                return;
            
            // rimuovo i ritorno a capo
            r = r.replace(/\r/, "")
            let VAngle = r.split(",")
            

    
            VAngle = VAngle.map( Value=>{
                return parseFloat(Value.replace(/\D{1,}:|\n/gm, ""));
            })
    
    
            plotA.InsertData(VAngle[0],0)
            plotA.InsertData(VAngle[1],1)
        })
    }
    else {
        CurrentPlot = plotG
        ValidString.split("#").forEach( r=>{
          
            // controllo se la riga contiene i tre assi
            // solo in quel caso cntinuo alrimenti viene ingorata
            if(!r.includes("x") || !r.includes("y") || !r.includes("z"))
                return;

            // rimuovo i ritorno a capo
            r = r.replace(/\r|\n/, "")

            // divido per virgola
            let VAxis = r.split(",")
            
            // per ogni asse calcolo il valore float eliminando ogni non numero prima dei :
            VAxis.forEach( (Value,i)=>{
                let vf = parseFloat(Value.replace(/\D{1,}:/gm, ""))
                if(i < 3){
                    plotG.InsertData(vf,i);
                }
             
            })
    

        })
    }

    
      
    FromLastChar = ""
}

async function ToggleActiveCart(){
    CurrentPlot.Hide()
    CurrentPlot.StopDraw()
    if(ChartModeSelect.checked){
        CurrentPlot = plotA
    }
    else {
        CurrentPlot = plotG
    }
    CurrentPlot.Show()
    CurrentPlot.StartDraw()


    await port.Write("d")
   
}




