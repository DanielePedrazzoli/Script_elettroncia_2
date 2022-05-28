class TextRecived{
    constructor(TextAreaElement){

        this.textArea = TextAreaElement;

    }



    Reset(AskConfirm){
        if(AskConfirm){
            if(confirm("Cancellare il contenuto dell'aera di testo?")){
                this.textArea.value = ""
            }
        }
       else {
            this.textArea.value = ""
       }
    }

    AddPlain(text){
        
        this.textArea.value += text;

        // autoscroll textarea
        if(this.textArea.selectionStart == this.textArea.selectionEnd) {
            this.textArea.scrollTop = this.textArea.scrollHeight;
        }
    }

    AddFormatted(){

    }


    Export(){

        let parseText = ""
    
        this.textArea.value.split("#").forEach( row=>{
            let m = row.replace(/\n|\r/gm, "").match(/[+-]?\d+(\.\d+)?/g)
            if(!m)return
            parseText += m.join(";") + "\n"
        })
    
        
    
        var blob = new Blob([parseText], { type: "text/csv" });
        var a = document.createElement('a');
        a.download = "STM file.csv";
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = ["text/csv", a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    Setting(){

    }
}

