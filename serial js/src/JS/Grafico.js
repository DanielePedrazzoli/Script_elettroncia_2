class Grafico{
    constructor(canvas, options){
        
        this.MaxLenght      = options.NumberOfStep;
        this.MaxValue       = options.Max;
        this.MinValue       = options.Min;
        this.ScaleStep      = 10;
        this.IsDrawing      = false
        this.Intervall      = null;
        this.IntervallTime  = 1000
        this.canvas         = canvas
        this.ctx            = canvas.getContext("2d");
        this.lables         = []
        this.Chart          = null

        this.Amplification  = document.getElementById("Amplification")
        this.AmplificationValue = document.getElementById("AmplificationValue")
        this.Amplification.onchange = ()=>{
            this.AmplificationValue.value =  this.Amplification.value;
        }

        this.AmplificationValue.onchange = ()=>{
            this.Amplification.value = this.AmplificationValue.value;
        }


        if(options.Colors){
            this.Stroke = options.Colors;
        }
        else this.Stroke = ["rgba(200,0,250,1)", "rgba(255,0,0,1)", "rgba(0,220,0,1)"]

 


        for(let i=0; i<this.MaxLenght; i++){
            this.lables.push("")
        }



        let dataset = []

        for(let i=0; i<options.NumberOfSet; i++){
            dataset.push({
                label: "X",
                fillColor: "rgba(220,220,220,0.0)",
                strokeColor: this.Stroke[i],
                pointColor: "rgba(220,220,220,0)",
                pointStrokeColor: "#fff",
                type:"line",
                data: Array(this.MaxLenght).fill(1)
            })
        }

        this.PlotData = {
            labels:this.lables,
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
            bezierCurveTension:false
        };
        this.Chart = new Chart(this.ctx)

        this.Draw()


    }

    StartDraw(){
        this.Intervall = setInterval( ()=>{this.Draw()}, this.IntervallTime )
        this.IsDrawing = true;
    }


    InsertData(value, index){
        this.PlotData.datasets[index].data.push(value * parseFloat(this.Amplification.value));
        this.PlotData.datasets[index].data.shift();
    }

    StopDraw(){
        clearInterval(this.Intervall)
        this.IsDrawing = false;
    }


    Draw(){
        this.Chart = new Chart(this.ctx)
        this.Chart.Line(this.PlotData,  this.options)
    }

    Hide(){   
        this.canvas.style.display = "none"
    }

    Show(){
        this.canvas.style.display = "block"
    }

    Clear(){
        if(!confirm("Eliminare tutti i dati dal grafico? (non reversibile)"))
        this.PlotData.datasets.forEach( ds=>{
            ds.data = Array(this.MaxLenght).fill(0)
        })
    }


    Update(){
        this.PlotData.datasets.map( ds=>{
            ds.data = ds.data.map( v=>{
                return v * parseFloat(this.Amplification.value)
            })
        })
    }

}