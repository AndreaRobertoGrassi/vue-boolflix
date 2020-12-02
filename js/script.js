var app =new Vue({
  el:'#app',
  data:{
    apiKey:'8f23d254d7ec1835913633d0b0a45c83',
    search:'',
    bandieraFilmsArray:[],
    bandieraSerieTvArray:[],
    filmsArray:[],
    serieTvArray:[]
  },
  methods:{
    //funzione per cercare i film
    ricerca:function () {

      //cerco i film
      this.bandieraFilmsArray=[];   //array per le bandiere
      axios.get('https://api.themoviedb.org/3/search/movie?api_key='+this.apiKey+'&language=it-IT&query='+this.search).then(response => {
        this.filmsArray = response.data.results; //i film risultati dalla ricerca li inserisco nel mio filmsArray
        this.filmsArray.forEach((item) => { //trasformo il voto in base 10, in base 5
          item.vote_average=Math.ceil(item.vote_average/2);
        });
        this.filmsArray.forEach((item) => {
          this.bandieraFilmsArray.push('img/'+item.original_language+'.svg');
        });
      });

      //cerco le serie tv
      this.bandieraSerieTvArray=[];   //array per le bandiere
      axios.get('https://api.themoviedb.org/3/search/tv?api_key='+this.apiKey+'&language=it-IT&query='+this.search).then(response => {
        this.serieTvArray = response.data.results; //i film risultati dalla ricerca li inserisco nel mio serieTvArray
        this.serieTvArray.forEach((item) => { //trasformo il voto in base 10, in base 5
          item.vote_average=Math.ceil(item.vote_average/2);
        });
        this.serieTvArray.forEach((item) => { //trasformo la lingua originale in bandierina
          this.bandieraSerieTvArray.push('img/'+item.original_language+'.svg');
        });
      });
    },

    //funzione per bandiera non europea
    setAltImg:function (event) {
      event.target.src = "img/world.svg"
    }
  }
})
