var app =new Vue({
  el:'#app',
  data:{
    apiKey:'8f23d254d7ec1835913633d0b0a45c83',
    search:'',
    bandieraImg:'',
    bandieraArray:[],
    filmsArray:[],
  },
  methods:{
    //funzione per cercare i film
    ricerca:function () {
      axios.get('https://api.themoviedb.org/3/search/movie?api_key='+this.apiKey+'&language=it-IT&query='+this.search).then(response => {
        this.filmsArray = response.data.results; //i film risultati dalla ricerca li inserisco nel mio filmsArray
        this.filmsArray.forEach((item) => { //trasformo il voto in base 10, in base 5
          item.vote_average=Math.ceil(item.vote_average/2);
        });
        this.filmsArray.forEach((item) => {
          if (!this.bandieraArray.includes(item.original_language)) {
            this.bandieraArray.push('img/'+item.original_language+'.svg');
          }
        });
        console.log(this.bandieraArray);
      });
    },

    setAltImg:function (event) {
      event.target.src = "img/world.jpg"
    }
  }
})
