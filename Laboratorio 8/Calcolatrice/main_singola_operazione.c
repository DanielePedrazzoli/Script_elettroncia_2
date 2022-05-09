#include <stdio.h>
#include <stdlib.h>

#define DEBUG 0
#define MAX_NUMBER_LENGTH 10

/**
 * @brief Controlla se il carattere ricevuto è un segno algebrico, in tal caso ritorna true
 * 
 * @param carattere 
 * @return char 
 */
char IsCharASign(char carattere){
    return (carattere == '+' || carattere == '-' || carattere == '*' || carattere == '/');
}

/**
 * @brief Controlla se il carattere ricevuto è uno spazio, in tal caso ritorna true
 * 
 * @param carattere 
 * @return char 
 */
char IsCharASpace(char carattere){
    return carattere == ' ';
}


/**
 * @brief Controlla se il valore intero e ritorna true in tal caso
 * Ritorna false se il valore non è intero
 * 
 * @param NumberDouble 
 * @return char 
 */
char IsInteger(double NumberDouble)
{
    // eseguo un parsing a INT
    int NumberInteger = NumberDouble;
 
    // eseguo la differenza dei due
    // se il risultato è diverso da 0 allora è float
    return  (NumberDouble - NumberInteger);
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

    char currentSign = 0;
    char IndexOfNumber = 1;
    char ColumsForCurretnNumber = 0;
    char RowForCurretnNumber = 0;

    char SegnoOperazione;
    double Numeri[2];
    double Result;


    for(int i=0; string[i] != '\0'; i++){

        // prelevo il carattere attuale
        char currentChar = string[i];

        if(IsCharASpace(currentChar)){
            continue;
        }

        // controllo se il carattere attuale è un segne
        // in questo caso devo modificare il numero da eval
        if(IsCharASign(currentChar)){

            // incremento il valore che mi permette di stabilire su quale
            // numero devo lavorare
            RowForCurretnNumber ++;

            // avendo trovato un segno, posso salvarlo in memoria
            SegnoOperazione = currentChar;
         
            // questo indice mi aiuta per l'indice per la trascirzione del numero
            ColumsForCurretnNumber = 0;
            continue;
        }

        // determino su quale numero sto lavorando
        // questo viene modificato in base al segno 
        // quando trovo un segno devo trascrivre un'altro numero
        valoriStriga[RowForCurretnNumber][ColumsForCurretnNumber] = currentChar;

        // incremento la variabile di idice per il numero corrente
        ColumsForCurretnNumber++;
        
    }

    // esegue l'evaluate delle stringhe e memorizzo i valori nell'array
    for(int i=0; i<RowForCurretnNumber+1; i++){
        Numeri[i] = atof(valoriStriga[i]);
    }


    // immagazzino il primo valore
    Result = Numeri[0];

    // eseguo l'operazione effettiva
    switch (SegnoOperazione){
        case '+':
            Result +=  Numeri[1];
            break;

        case '-':
            Result -=  Numeri[1];
            break;

        case '*':
            Result *=  Numeri[1];
            break;

        case '/':
            Result /=  Numeri[1];
            break;
    }
    return Result;
}

int main(){
    char StirngToEval[] = "1 * 5.2";
    char StirngToEva2[] = "1000 + 5.2";
    char StirngToEva3[] = "1000 / 5.2";
    char StirngToEva4[] = "1000 - 5.2";
    printf("Eval string 1:\t%f\n", EvalString(StirngToEval));
    printf("Eval string 2:\t%f\n", EvalString(StirngToEva2));
    printf("Eval string 3:\t%f\n", EvalString(StirngToEva3));
    printf("Eval string 4:\t%f\n", EvalString(StirngToEva4));
}


