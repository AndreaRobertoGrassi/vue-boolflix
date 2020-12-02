var app =new Vue({
  el:'#app',
  data:{
    apiKey:'8f23d254d7ec1835913633d0b0a45c83',
    search:'',
    bandieraFilmsArray:[],  //bandiere per film
    bandieraSerieTvArray:[],  //bandiere per serietv
    filmsArray:[],    //films
    serieTvArray:[],   //serie tv
    copertinaFilmsArray:[],   //copertine per film
    copertinaSerieTvArray:[]   //copertine per serie tv
  },
  methods:{

    //funzione di ricerca
    ricerca:function () {

      //cerco i film
      axios.get('https://api.themoviedb.org/3/search/movie?api_key='+this.apiKey+'&language=it-IT&query='+this.search).then(response => {
        this.filmsArray = response.data.results; //i film risultati dalla ricerca li inserisco nel mio filmsArray
        this.fnFilmsArray();
      });

      //cerco le serie tv
      axios.get('https://api.themoviedb.org/3/search/tv?api_key='+this.apiKey+'&language=it-IT&query='+this.search).then(response => {
        this.serieTvArray = response.data.results; //i film risultati dalla ricerca li inserisco nel mio serieTvArray
        this.fnSerieTvArray();
      });
    },

    //funzione che riguardai film per inserire media voto in base 5, la copertina e la bandiera 
    fnFilmsArray:function () {
      this.bandieraFilmsArray=[];   //per le bandiere
      this.copertinaFilmsArray=[];   //per le copertine
      this.filmsArray.forEach(item => {
        item.vote_average=Math.ceil(item.vote_average/2);    //trasformo il voto in base 10, in base 5
        this.copertinaFilmsArray.push('https://image.tmdb.org/t/p/w154'+item.poster_path);  //inserisco l'immagine di copertina
        this.bandieraFilmsArray.push('img/'+item.original_language+'.svg');   //inserisco la bandiera in base alla lingua
      });
    },

    //funzione che riguardai film per inserire media voto in base 5, la copertina e la bandiera
    fnSerieTvArray:function () {
      this.bandieraSerieTvArray=[];   //array per le bandiere
      this.copertinaSerieTvArray=[];   //per le copertine
      this.serieTvArray.forEach(item => {
        item.vote_average=Math.ceil(item.vote_average/2);   //trasformo il voto in base 10, in base 5
        this.copertinaSerieTvArray.push('https://image.tmdb.org/t/p/w154'+item.poster_path);   //inserisco l'immagine di copertina
        this.bandieraSerieTvArray.push('img/'+item.original_language+'.svg');   //inserisco la bandiera in base alla lingua
      });
    },

    //funzione per bandiera non europea
    setAltImg:function (event) {
      event.target.src = "img/world.svg"
    }
  }
})
