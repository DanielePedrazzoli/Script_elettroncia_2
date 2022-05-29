class Impostazioni{
    constructor(){

        

        this.Settings = window.localStorage.getItem("SerialComunicationSTM32");

        if(!this.Settings){

            this.Settings = {
                Tema:"dark",
                EOL:true
            }
            
            window.localStorage.setItem("SerialComunicationSTM32", JSON.stringify(this.Settings));
        } else {
            this.Settings = JSON.parse(this.Settings)
        }



        this.SettingWindow = document.getElementById("SettingWindow");
        this.SettingWindow.classList.add("Hide")

        document.getElementById("Tema").checked = this.Settings.Tema == "dark"? false : true
        document.getElementById("EOL").checked = this.Settings.EOL


        if(this.Settings.Tema == "light"){
            this.CambiaTema()
        }
    }

    Show(){
        this.SettingWindow.classList.remove("Hide")
    }

    Hide(){
        this.SettingWindow.classList.add("Hide")
    }


    Get(Key){
        return this.Settings[Key] 
    }


    Set(Key, value){
        this.Settings[Key] = value
    }

    Save(){

        this.Set("Tema", document.getElementById("Tema").checked? "ligth": "dark");
        this.Set("EOL" , document.getElementById("EOL").checked);



        window.localStorage.setItem("SerialComunicationSTM32", JSON.stringify(this.Settings));

        this.Hide()
    }

    CambiaTema(element){
        let Html = document.getElementsByTagName("html")[0]
        if(element.checked){
            Html.classList.add("light")
            Html.classList.remove("dark")
        } else {
            Html.classList.add("dark")
            Html.classList.remove("light")
        }
    }
}