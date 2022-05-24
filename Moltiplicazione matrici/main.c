#include <stdio.h>


typedef struct {
    int Righe;
    int Colonne;
    int Dati[100][100];

}Matrice;


Matrice Matrice_1 = { 2,3, {{1,2,3}, {4,5,6}} };
Matrice Matrice_2 = { 3,2, {{1,2}, {3,4}, {5,6}} };


void StampaMatrice( Matrice matrice){


    for(int R=0; R<matrice.Righe; R++){
        printf("|\t");
        for(int C=0; C<matrice.Colonne; C++){
            printf("%d\t", matrice.Dati[R][C]);
        }
        printf("|\n");
    }

}

void Separatore(){
    for(int i=0; i<50; i++)
        printf("#");
    printf("\n");
}


Matrice Moltiplica(Matrice M1, Matrice M2){

    int Row = M1.Righe;
    int Col = M2.Colonne;

    Matrice M_res = { Row, Col , {{0}}};


    int i,j,R,C;
    for(i=0; i<Row; i++){
        for(j=0; j<Col; j++){

            int v = 0;
            for(int k=0; k<M1.Colonne; k++){
                v += M1.Dati[i][k] * M2.Dati[k][j];
            }

            M_res.Dati[i][j] = v;
        }
    }



    return M_res;

}

int main(){



    Separatore();
    printf("\033[32mMatrice 1\n\033[37m");
    StampaMatrice(Matrice_1);
    Separatore();
    printf("\033[32mMatrice 2\n\033[37m");
    StampaMatrice(Matrice_2);
    Separatore();

    Matrice Risultato = Moltiplica(Matrice_2, Matrice_1);

    printf("\033[32mMatrice res\n\033[37m");
    StampaMatrice(Risultato);

}