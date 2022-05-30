class Grafico{
    constructor(canvas, options){
        
        // variabili di controllo del grafico
        this.Chart          = null
        this.canvas         = canvas
        this.ctx            = this.canvas.getContext("2d");
        this.MaxLenght      = options.NumberOfStep;
        this.MaxValue       = options.Max;
        this.MinValue       = options.Min;
        this.ScaleStep      = 10;

        // variabili di visualizzaione del grafico
        this.IsDrawing      = false;
        this.Intervall      = null;

        // i dati vengono salvati anche se il grafico non è aggiornato
        // velocizzare questo timeout riduce solaemnte le prestazioni
        this.IntervallTime  = 1000
    
       // variabili per la legenda
        this.legendSpan     = []


        // Sezione amplificazione valori
        this.Amplification  = document.getElementById("Amplification")
        this.AmplificationValue = document.getElementById("AmplificationValue")
        this.Amplification.onchange = () => this.AmplificationValue.value =  this.Amplification.value
        this.AmplificationValue.onchange = () => this.Amplification.value = this.AmplificationValue.value;
        

        // impostazione e creazione dei valori iniziali
        let container = document.getElementById("CanvasLegend")
        let dataset = []

        options.Line.forEach( line=>{
            dataset.push({
                label: line.Name,
                fillColor: "rgba(220,220,220,0.0)",
                strokeColor: line.Color,
                pointColor: "rgba(220,220,220,0)",
                pointStrokeColor: "#fff",
                type:"line",
                data: Array(this.MaxLenght).fill(0),
            })

            let span = container.appendChild(document.createElement("span"))
            span.innerText = line.Name;
            span.style.setProperty("--Bg_color_Line", line.Color)
            this.legendSpan.push(span)
        })


       

        this.PlotData = {
            labels:Array(this.MaxLenght).fill(""),
            datasets:dataset            
        }

   

        this.options = {
            animation:false,
            scaleOverride: true,
            scaleSteps: this.ScaleStep,
            scaleStepWidth: (this.MaxValue - this.MinValue) / this.ScaleStep,
            scaleStartValue: this.MinValue,
            showTooltips:false,
            animationEasing:false,
            bezierCurve:false,
            pointDotRadius:0,
            scaleGridLineColor:"rgba(0,0,0,0)",
            scaleShowGridLines:false,
            scaleShowHorizontalLines:false,
            scaleShowVerticalLines:false,
            bezierCurveTension:false,
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 99, 132)'
                }
            }
        };


        // creazione oggetto
        this.Chart = new Chart(this.ctx)


        // rpimo disegno per la base
        this.Draw()   
    }

    /**
     * Imposta il timeout per l'aggiornamento del grafico
     */
    StartDraw(){
        this.Intervall = setInterval( ()=>{this.Draw()}, this.IntervallTime )
        this.IsDrawing = true;
    }

    /**
     * 
     * @param {number} value il valore da inserire 
     * @param {number} index la linea su cui inserire il valore
     */
    InsertData(value, index){
        this.PlotData.datasets[index].data.push(value * parseFloat(this.Amplification.value));
        this.PlotData.datasets[index].data.shift();
    }

    /**
     * Resetta il timout per l'aggiornamento del grafico
     */
    StopDraw(){
        clearInterval(this.Intervall)
        this.IsDrawing = false;
    }

    /**
     * Aggiorna il grafico
     */
    Draw(){
        this.Chart = new Chart(this.ctx)
        this.Chart.Line(this.PlotData,  this.options)
    }


    /**
     * Nasconde il grafico e le relative legende
     */
    Hide(){   
        this.canvas.style.display = "none"
        this.legendSpan.forEach( span=> span.classList.add("Hide"))
    }

    /**
     * Mostra il grafico e le relative legende
     */
    Show(){
        this.canvas.style.display = "block"
        this.legendSpan.forEach( span=> span.classList.remove("Hide"))
    }

    /**
     * Elimina tutti i punti salvati sul grafico reimpostandoli a 0
     */
    Clear(){
        if(confirm("Eliminare tutti i dati dal grafico? (non reversibile)")){
            this.PlotData.datasets.forEach( ds=>{
                ds.data = Array(this.MaxLenght).fill(0)
            })
        }
       
    }

    /**
     * Aggiorna il grafico con il corretto valore di amplificazione impostato
     * Si consiglia di non usare questa funzione nel mentre sta aggiornado il grafico
     * POiche si altera la visualizzazzione corretta
     */
    Update(){
        this.PlotData.datasets.map( ds=>{
            ds.data = ds.data.map( v=>{
                return v * parseFloat(this.Amplification.value)
            })
        })
    }

}