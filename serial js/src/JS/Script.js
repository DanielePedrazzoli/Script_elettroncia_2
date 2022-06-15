// iizializzazione impostazioni
let impostazioni = new Impostazioni();



// inizializzaione grafici
let plotG = new Grafico(document.getElementById("canvasG"), {
    Max:1000, 
    Min:-1000, 
    NumberOfStep:50, 
    Line:[
        { Color:"orangered" , Name:"R"},
        { Color:"green"     , Name:"P"},
        { Color:"red"     , Name:"R5"},
        { Color:"white"     , Name:"P5"},
    ] 
})

let plotA = new Grafico(document.getElementById("canvasA"), {
    Max:180,  
    Min:-180,  
    NumberOfStep:120, 
    Line:[
        { Color:"white" , Name:"roll"},
        { Color:"orange", Name:"pitch"},

    ] 
})

let CurrentPlot = plotG
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
    FromLastChar = FromLastChar.substring(LastIndexOfSeparator,FromLastChar.length)



    ValidString.split("#").forEach( r=>{

        // se la stringa è vuota non la analizzo
        if(!r){
            return
        }
        // determino a quale grafico devo inviare i dati in base al valore 
        // della checkbox
        if(document.getElementById("AngoliMode").checked)
            CurrentPlot = plotA
        else
            CurrentPlot = plotG
        


        let arr = GetValueFromStirng(r) || []
        if(CurrentPlot.NumberOfline != arr.length){
            console.error("Il numero di valori non corrisponde con i valori del grafico");
            return
        }
        arr.forEach( (valore, index) => CurrentPlot.InsertData(parseFloat(valore),index))   
    })

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


    if(impostazioni.Get("SendD")){
        await port.Write("d")
    }
    
   
}




