// iizializzazione impostazioni
let impostazioni = new Impostazioni();



// inizializzaione grafici
let plotG = new Grafico(document.getElementById("canvasG"), {
    Max:180, 
    Min:-180, 
    NumberOfStep:300, 
    Line:[
        { Color:"orangered" , Name:"Ingresso Fir"},
        { Color:"green"     , Name:"Uscita Fir"},
        // { Color:"yellow"          , Name:"z"}
    ] 
})

let plotA = new Grafico(document.getElementById("canvasA"), {
    Max:180,  
    Min:-180,  
    NumberOfStep:120, 
    Line:[
        { Color:"white" , Name:"pitch"},
        { Color:"orange", Name:"roll"},
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
    FromLastChar = FromLastChar.substring(LastIndexOfSeparator+1,FromLastChar.length-1)



    ValidString.split("#").forEach( r=>{

        // determino a quale grafico devo inviare i dati in base al valore 
        // della checkbox
        if(document.getElementById("AngoliMode").checked){
            CurrentPlot = plotA
            GetValueFromStirng(r).forEach( (valore, index) => plotA.InsertData(parseFloat(valore),index))   
        }else{
            CurrentPlot = plotG
            let arr = GetValueFromStirng(r)
            let s = "roll: ";
            arr.forEach( (valore, index) => {
                plotG.InsertData(parseFloat(valore),index)
                s += parseFloat(valore) + "\tpitch: ";
            })
            console.log(s)
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


    if(impostazioni.Get("SendD")){
        await port.Write("d")
    }
    
   
}




