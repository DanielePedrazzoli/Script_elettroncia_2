
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



    ValidString.split("#").forEach( r=>{

        // determino a quale grafico devo inviare i dati in base al valore 
        // della checkbox
        if(document.getElementById("AngoliMode").checked){
            CurrentPlot = plotA
            GetValueFromStirng(r).forEach( (valore, index) => plotA.InsertData(parseFloat(valore),index))   
        }else{
            CurrentPlot = plotG
            GetValueFromStirng(r).forEach( (valore, index) => plotG.InsertData(parseFloat(valore),index))
        }

        
    })

    
      
    FromLastChar = ""
}

function GetValueFromStirng(stringa){
    return stringa.replace(/\n|\r/gm, "").match(/[+-]?\d+(\.\d+)?/g)
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



