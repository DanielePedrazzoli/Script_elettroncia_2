

let plotG = new Grafico(document.getElementById("canvasG"), {Max:1000, Min:-1000, NumberOfStep:200, NumberOfSet:3})
let plotA = new Grafico(document.getElementById("canvasA"), {Max:180, Min:-180, NumberOfStep:200, NumberOfSet:2})

let CurrentPlot = plotG;

let port = new SerialPort(115200);

let FromLastChar = ""
let SelectPort      = document.getElementById("ChosePort")
let DestroyPort     = document.getElementById("DesotryPort")
let StopChart       = document.getElementById("StopChart")
let SendBTN         = document.getElementById("Send")
let ExportBtn       = document.getElementById("ExportBtn")
let ClearChatBtn    = document.getElementById("ClearChatBtn")
let Chat            = document.getElementById("chat")
let ChartModeSelect = document.getElementById("AngoliMode")

ClearChatBtn.onclick    = ClearChat
DestroyPort.onclick     = port.Destroy
ExportBtn.onclick       = Export
SelectPort.onclick      = SelectNewPort
StopChart.onclick       = ToggleChart
SendBTN.onclick         = SendData
ChartModeSelect.onclick = ToggleActiveCart

port.SetOnNewMessage(NewMessage)

plotA.Hide()


function ClearChat(){
    if(confirm("Eliminare tutta la cronologia dei messaggi?")){
        Chat.value = ""
    }
}


function Export(){

    let text = document.getElementById("chat").value

    text = text.replace(/#|x|y|z|:/gmi, "")

    var blob = new Blob([text], { type: "text/csv" });
    var a = document.createElement('a');
    a.download = "STM file.csv";
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/csv", a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

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
    Chat.value += string;



    // autoscroll textarea
    if(Chat.selectionStart == Chat.selectionEnd) {
        Chat.scrollTop = Chat.scrollHeight;
    }

    FromLastChar+= string;

    if(!FromLastChar.includes("#"))
        return;
    

    if(document.getElementById("AngoliMode").checked == true){
        CurrentPlot = plotA

        FromLastChar.split("#").forEach( r=>{

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

        FromLastChar.split("#").forEach( r=>{
          
            // controllo se la riga contiene i tre assi
            // solo in quel caso cntinuo alrimenti viene ingorata
            if(!r.includes("x") || !r.includes("y") || !r.includes("z"))
                return;

            // rimuovo i ritorno a capo
            r = r.replace(/\r|\n/, "")

            // divido per virgola
            let VAxis = r.split(",")
            
            // per ogni asse calcolo il valore float eliminando ogni non numero prima dei :
            VAxis = VAxis.map( Value=>{
                return parseFloat(Value.replace(/\D{1,}:/gm, ""));
            })
    
    
            // infine assegno il valore 
            plotG.InsertData(VAxis[0],0)
            plotG.InsertData(VAxis[1],1)
            plotG.InsertData(VAxis[2],2)
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




