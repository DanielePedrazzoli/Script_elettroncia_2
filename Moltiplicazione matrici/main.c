#include <stdio.h>


typedef struct {
    int Righe;
    int Colonne;
    int Dati[100][100];

}Matrice;


Matrice Matrice_1;
Matrice Matrice_2;


void StampaMatrice( Matrice matrice){


    for(int R=0; R<matrice.Righe; R++){
        printf("|\t");
        for(int C=0; C<matrice.Colonne; C++){
            printf("%d\t", matrice.Dati[R][C]);
        }
        printf("|\n");
    }

}

Matrice RiempiMatrice(int Nr, int Nc){

    int c = 1;
    Matrice M_res = { Nr, Nc , {{0}}};


    for(int i=0; i<Nr; i++){
        for(int j=0; j<Nc; j++){
            M_res.Dati[i][j] = c++;
        }
    }

    return M_res;


}


void Separatore(){
    for(int i=0; i<50; i++)
        printf("#");
    printf("\n");
}


int Moltiplica(Matrice M1, Matrice M2,  Matrice* M3){



    if(M1.Colonne != M2.Righe || M1.Righe != M2.Colonne){
        printf("\033[31mErrore:\nIl numero di colonne della prima matrice deve corrispondere al numero di righe della seconda matrice.\n\033[37m");
        return 0;
    }

    int Row = M1.Righe;
    int Col = M2.Colonne;

    M3->Colonne = Col;
    M3->Righe = Row;

    //M3 = (Matrice*) { Row, Col , {{0}}};


    int i,j,R,C;
    for(i=0; i<Row; i++){
        for(j=0; j<Col; j++){

            int v = 0;
            for(int k=0; k<M1.Colonne; k++){
                v += M1.Dati[i][k] * M2.Dati[k][j];
            }

            M3->Dati[i][j] = v;
        }
    }

    return 1;
//    StampaMatrice(*M3);

}


int main(){

    Matrice_1 = RiempiMatrice(2, 2);
    Matrice_2 = RiempiMatrice(2, 2);

    Separatore();
    printf("\033[32mMatrice 1\n\033[37m");
    StampaMatrice(Matrice_1);
    Separatore();
    printf("\033[32mMatrice 2\n\033[37m");
    StampaMatrice(Matrice_2);
    Separatore();

    Matrice Risultato;
    Moltiplica(Matrice_1, Matrice_2, &Risultato);

    printf("\033[32mMatrice res\n\033[37m");
    StampaMatrice(Risultato);



}