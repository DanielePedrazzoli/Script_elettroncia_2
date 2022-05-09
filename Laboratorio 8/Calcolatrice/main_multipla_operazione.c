#include <stdio.h>
#include <stdlib.h>
#include <string.h>


#define DEBUG 0
#define MAX_NUMBER_LENGTH 10
#define MAX_NUMBER 10



char IsCharASign(char c){
    return (c == '+' || c == '-' || c == '*' || c == '/');
}

char IsCharASpace(char c){
    return c == ' ';
}

char IsInteger(double N)
{
    // eseguo un parsing a INT
    int X = N;
 
    // eseguo la differenza dei due
    // se il risultato è diverso da 0 allora è float
    return  (N - X);
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
float EvalString(char *string){

    int Lenght = strlen(string);
    char valori[MAX_NUMBER][MAX_NUMBER_LENGTH];

    char currentSign = 0;
    char IndexOfNumber = 1;
    char ColumsForCurretnNumber = 0;
    char RowForCurretnNumber = 0;


    char Segni[MAX_NUMBER];
    float Numbers[MAX_NUMBER];
    float Result;


    for(int i=0; i<Lenght; i++){

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
            Segni[RowForCurretnNumber] = currentChar;
         
            // questo indice mi aiuta per l'indice per la trascirzione del numero
            ColumsForCurretnNumber = 0;
            continue;
        }

        // determino su quale numero sto lavorando
        // questo viene modificato in base al segno 
        // quando trovo un segno devo trascrivre un'altro numero
        valori[RowForCurretnNumber][ColumsForCurretnNumber] = currentChar;

        // incremento la variabile di idice per il numero corrente
        ColumsForCurretnNumber++;
        
    }

    // esegue l'evaluate delle stringhe e memorizzo i valori nell'array
    for(int i=0; i<RowForCurretnNumber+1; i++){
        Numbers[i] = atof(valori[i]);
    }


    // immagazzino il primo valore
    Result = Numbers[0];


    //  eseguo l'effettivo calcolo tra i due numeri e il segno
    for(int i=1; i<RowForCurretnNumber+1; i++){
        switch (Segni[i]){
            case '+':
                Result +=  Numbers[i];
                break;

            case '-':
                Result -=  Numbers[i];
                break;

            case '*':
                Result *=  Numbers[i];
                break;

            case '/':
                Result /=  Numbers[i];
                break;
        }
    }
    return Result;
}

int main(){
    char StirngToEval[] = "1000 * 5.2 - 0.2";
    char StirngToEva2[] = "1000 + 5.2 - 10 + 5 + 2";
    char StirngToEva3[] = "1000 / 5.2";
    char StirngToEva4[] = "1000 - 5.2";
    printf("Eval string 1:\t%f\n", EvalString(StirngToEval));
    printf("Eval string 2:\t%f\n", EvalString(StirngToEva2));
    printf("Eval string 3:\t%f\n", EvalString(StirngToEva3));
    printf("Eval string 4:\t%f\n", EvalString(StirngToEva4));
}


