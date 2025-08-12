# Testo dell'Esame 
La visualizzazione di questo progetto mostra un scatter plot, attualmente con dei dati finti (dummy). L'asse orizzontale rappresenta il tempo, mentre l'asse verticale rappresenta un generico valore numerico.
Il compito dello studente è quello di apportare delle modifiche alla visualizzazione proposta.
Il voto massimo della prova è 11.

# Modifiche che dovete implementare

**Modifica 1:** La dimensione dei cerchi deve essere proporzionale al BMI: maggiore è il BMI, più grande sarà il cerchio.
Utilizzare una scala potenza (funzione `scalePow` che funziona in maniera analoga alla funzione `scaleSqrt` che abbiamo già visto) con esponente 6.
I raggi dei cerchi devono avere una dimensione minima di 3 e massima di 20. (4 punti)

**Modifica 2:** Aggiungere un tooltip per ogni cerchio, visibile solo quando il mouse è sopra il cerchio, che mostri il BMI associato al dato del cerchio. (2 punti)

**Modifica 3:** Creare una scala di colori binaria: rosso per i fumatori e verde per i non fumatori.
Colorare i cerchi usando questa scala di colori. (4 punti)

**Modifica 4:** Mettere in grassetto le etichette degli assi ("Charges", "Age"). (1 punto)