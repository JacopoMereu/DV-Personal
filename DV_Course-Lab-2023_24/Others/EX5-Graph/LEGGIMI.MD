# Testo dell'Esame 
La visualizzazione di questo progetto mostra un line chart, attualmente con dei dati finti (dummy). L'asse orizzontale rappresenta il tempo, mentre l'asse verticale rappresenta un generico valore numerico.
Il compito dello studente è quello di apportare delle modifiche alla visualizzazione proposta.
Il voto massimo della prova è 11.

# Modifiche che dovete implementare

**Modifica 1:** Cambiare il colore dei nodi in base alla loro etichetta. Se l'etichetta del nodo è dispari (es. 1), il nodo deve essere color marrone; se l'etichetta è pari (es. 2), il nodo deve essere color rosa. (3 punti)

**Modifica 2:** Cambiare la dimensione dei nodi (cerchi) in base al numero di archi incidenti. Maggiore è il numero di archi incidenti su un nodo, maggiore sarà la sua dimensione. Utilizzare la funzione `get_radius` già implementata, che dipende dalla funzione `count_incident_arcs`. Completare la `funzione count_incident_arcs` in modo che restituisca il numero di archi incidenti su un nodo. Nota: il numero di archi incidenti è la somma degli archi uscenti e entranti in un nodo. (3 punti)

**Modifica 3:** Creare una scala di colori binaria per gli archi. Se il valore del nodo sorgente è minore dell'etichetta del nodo di destinazione (es. 1 → 5), l'arco deve essere verde; nel caso contrario (es. 8 → 3), l'arco deve essere rosso. (4 punti)

**Modifica 4:** Rendere le etichette degli archi (es. 4 → 9) in _corsivo_. (1 punto)