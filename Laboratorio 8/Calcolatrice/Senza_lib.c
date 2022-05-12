#include <stdio.h>


#define MAX_NUMBER_LENGTH 10

/**
 * @brief Controlla se il carattere ricevuto è un segno algebrico, in tal caso ritorna true
 * 
 * @param carattere 
 * @return char 
 */
char IsOperator(char carattere){
    return (carattere == '+' || carattere == '-' || carattere == '*' || carattere == '/');
}


/**
 * @brief Ritorna l'indice del punto decimale 
 * Se non dovesse trovarlo ritorna la lunghezza della stringa
 * 
 * @param string 
 * @return int 
 */
int IndexOfDot(char *string){
    int i;
    for(i=0; string[i] != 0; i++){
        if(string[i] == '.')
        return i;
    }
    return i;
}

/**
 * @brief Ritorna una potenza di 10 avente come esponente il valore exp
 * 
 * @param exp 
 * @return float 
 */
float Power(int exp){
    float res = 1;

    // se l'esponente è positivo moltiplico per 10
    if(exp > 0)
        for(int i=0; i<exp; i++)
            res *= 10;

    // se l'esponente è positivo divido per 10
    else if(exp < 0)
        for(int i=0; i<-exp; i++)
            res /= 10;

    return res;
}

/**
 * @brief Trasforma una stringa in un valore float
 * 
 * @param string 
 * @return float 
 */
float ParseToFloat(char *string){

    /*
        es: string = "1234.56" --->
            (1 * 1000) + (2 * 100) + (3 * 10) + (4 * 1) + (5 * 0.1) + (6 * 0.01) =
            (1 * 10^3) + (2 * 10^2) + (3 * 10^1) + (4 * 10^0) + (5 * 10^(-1)) + (6 * 10^(-2))
    */

    // calcolo l'esponente di 10 con cui iniziare
    // per farlo determino dove si trova il punto decimale
    int esponente = IndexOfDot(string) - 1;
    float number = 0;
    char DotEcounter = 0;
    
    for(int i=0; string[i] != 0; i++){
        char digit = string[i] - '0';     
     


        if(string[i] == '.'){
            DotEcounter = 1;
            continue;
        }
    
        // moltiplico il numero corrente con il valore 
        // della potenza di 10 in base alla sua posizione nella stringa
        float potenza = Power(esponente - i + DotEcounter);


        // compongo il numero finale sommando ogni componente
        // moltiplicato per il suo peso
        number +=  digit * potenza;
    }

    return number;
}


/**
 * @brief Esegue l'eval di una striga ricevuta come argomento
 * La stirnga puo contenere fino a MAX_NUMBER numeri da evaluare
 * Non è in grado di distinguere la precedenza e non valuta le parentesi
 * Se forniti piu o meno valori di quelli dichiarati in MAX_NUMBER, il risultato sarà 0
 * Eventuali spazi tra segni e numeri verranno ignorati
 * 
 * @param string 
 * @return float 
 */
double EvalString(char *string){

    char valoriStriga[2][MAX_NUMBER_LENGTH];

    char Digit_Current_Number = 0;
    char Number_Selector = 0;
    char FisrtNumberSign = 1;

    char SegnoOperazione = '+';
    float Numeri[2];
    float Result;


    int i = 0;

    // se il primo carattere è un meno
    // allora alzo una flag e nel calcolo moltiplico il primo valore per -1
    // inoltre imposto l'indice per fare in modo di iniziare il carattere dopo
    if(string[0] == '-'){
        FisrtNumberSign = -1;
        i = 1;
    }

    for(i; string[i] != '\0'; i++){


        char currentChar = string[i];

        // se è uno spazio lo ignoro
        if(currentChar == ' ')
            continue;
        

        // controllo se il carattere attuale è un segno
        if(IsOperator(currentChar)){

            // incremento il valore che mi permette di stabilire su quale
            // numero devo lavorare
            Number_Selector ++;

            valoriStriga[0][Digit_Current_Number] = 0;

            // avendo trovato un segno, posso salvarlo in memoria
            SegnoOperazione = currentChar;
         
            // questo indice mi aiuta per l'indice per la trascirzione del numero
            Digit_Current_Number = 0;
            continue;
        }

        // determino su quale numero sto lavorando
        // questo viene modificato in base al segno 
        // quando trovo un segno devo trascrivre un'altro numero
        valoriStriga[Number_Selector][Digit_Current_Number] = currentChar;

        // incremento la variabile di idice per il numero corrente
        Digit_Current_Number++;
    }

    valoriStriga[1][Digit_Current_Number] = 0;


    Numeri[0] = ParseToFloat(valoriStriga[0]);
    Numeri[1] = ParseToFloat(valoriStriga[1]);

    // immagazzino il primo valore come risultato
    // se il primo carattere era un '-', allora questo numero diventa negativo
    Result = Numeri[0] * FisrtNumberSign;

    // eseguo l'operazione effettiva e ritorno il valore
    switch (SegnoOperazione){
        case '+':   return Result + Numeri[1];
        case '-':   return Result - Numeri[1];
        case '*':   return Result * Numeri[1];
        case '/':   return Result / Numeri[1];
    }
}

int main(){
    char StirngToEval[] = "-1 * 5.2";               
    char StirngToEva2[] = "-20 + 5.2";             
    char StirngToEva3[] = "100 / 5.2";              
    char StirngToEva4[] = "1000 - 5.2";             
    printf("############################################\n");
    printf("Eval string 1:\t%f\n", EvalString(StirngToEval));   // -5.2
    printf("Eval string 2:\t%f\n", EvalString(StirngToEva2));   // -14.8
    printf("Eval string 3:\t%f\n", EvalString(StirngToEva3));   // 19.230769
    printf("Eval string 4:\t%f\n", EvalString(StirngToEva4));   // 994.8

    
}


