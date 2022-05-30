#include <stdio.h>

#define N 10
#define N_coeff 3

float Input_f32_1kHz_15kHz[N] = {0,1,2,3,4,5,6,7,8,9};
float FIRCoeffs32[N_coeff]               = {1,2,3};


float Output[N] = {0};
float x[N_coeff];

void StampaProgressi(){
    printf("\nIngresso:\t");
    for(int i=0; i<N ; i++){
        printf("%f\t", Input_f32_1kHz_15kHz[i]);
    }


    printf("\ncoefficenti:\t");
    for(int i=0; i<N_coeff ; i++){
        printf("%f\t", FIRCoeffs32[i]);
    }

    printf("\nOutput:\t\t");
    for(int i=0; i<N ; i++){
        printf("%f\t", Output[i]);
    }

    printf("\nBuffer:\t\t");
    for(int i=0; i<N_coeff ; i++){
        printf("%f\t", x[i]);
    }
    printf("\n");
}


void noARM_FIR(float * Input_f32_1kHz_15kHz, float * FIRCoeffs32, int TEST_LENGTH, int N_TAPS, float *Output, float * x_i)
{
    int i,k;
    float yn = 0;
    printf("pre iterazione:\n");




	for(i=0; i<TEST_LENGTH; i++)
    {
        
        printf("\033[32m################################ iterazione %d #######################################\033[37m", i);
                                         //  Alternative implementation
        for( k=0; k < N_TAPS-1; k++)               //  for(int k=N-1; k>0; k--)
        {                                        //  {
        	*(x_i + N_TAPS-k-1) = *(x_i +N_TAPS-k-2);//shift the data   //    x[k] = x[k-1];
        }                                        //  }

        (StampaProgressi());

        *(x_i) = Input_f32_1kHz_15kHz[i]; // move input sample to buffer
        yn = 0; // clear output sample

        for(int k=0; k < N_TAPS; k++)
        {
            yn += FIRCoeffs32[k] * *(x_i + k); // multiply data on coefficients with accumulation
        }

        *(Output + i) = yn;
    }

    

}



int main (){
    noARM_FIR(Input_f32_1kHz_15kHz, FIRCoeffs32, N, N_coeff, Output, x);
}