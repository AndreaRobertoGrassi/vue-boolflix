var app =new Vue({
  el:'#app',
  data:{
    apiKey:'8f23d254d7ec1835913633d0b0a45c83',
    search:'',  //input di ricerca
    ricercaArray:[],
    bandieraArray:[],
    copertinaArray:[],
    castArray:[],
    popularArray:[],
    displayCast:false  // rende invisibile la parola cast al caricamento della pagina per film popolari
  },

  mounted:function () {
    //focus automatico sull'input
    document.getElementById('input').focus();

    // al caricamento inserisco in oagina i film/serie tv piu popolari
    axios.get('https://api.themoviedb.org/3/discover/movie?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc').then(response =>{
      this.popularArray=response.data.results;
      if (this.popularArray.length==20) {
        axios.get('https://api.themoviedb.org/3/discover/tv?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc').then(response =>{
          this.ricercaArray=[...this.popularArray,...response.data.results];
          this.ricercaArray.forEach((item, i) => {
            item.vote_average=Math.ceil(item.vote_average/2);    //trasformo il voto in base 10, in base 5
            Vue.set(this.copertinaArray,i,'https://image.tmdb.org/t/p/w342/'+item.poster_path);  //inserisco l'immagine di copertina
            Vue.set(this.bandieraArray,i,'img/'+item.original_language+'.svg');   //inserisco la bandiera in base alla lingua
          });
        });
      }
    });

  },

  methods:{

    //funzione di ricerca
    ricerca:function () {
      this.ricercaArray=[];
      this.copertinaArray=[];
      this.bandieraArray=[];
      this.castArray=[];
      this.displayCast=true;

      //cerco i film/serie tv
      axios.get('https://api.themoviedb.org/3/search/multi?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc&query='+this.search).then(response => {
        this.ricercaArray=response.data.results;
        this.ricercaArray.forEach((item, i) => {   //elimino gli elementi senza copertina
          if (item.poster_path==null) {
            Vue.delete(this.ricercaArray,i);
          }
        });
        this.ricercaArray.forEach((item, i) => {
          //se film
          if (item.media_type=='movie') {
            axios.get('https://api.themoviedb.org/3/movie/'+item.id+'/credits?api_key='+this.apiKey+'&language=it-IT').then(response => {
              this.inserimentoCast(response,i);
            });
          }else { //se serie tv
            axios.get('https://api.themoviedb.org/3/tv/'+item.id+'/credits?api_key='+this.apiKey+'&language=it-IT').then(response => {
              this.inserimentoCast(response,i);
            });
          }
          item.vote_average=Math.ceil(item.vote_average/2);    //trasformo il voto in base 10, in base 5
          Vue.set(this.copertinaArray,i,'https://image.tmdb.org/t/p/w342/'+item.poster_path);    //inserisco l'immagine di copertina
          Vue.set(this.bandieraArray,i,'img/'+item.original_language+'.svg');   //inserisco la bandiera in base alla lingua
        });
      });
    },

    //funzione per inserie il cast
    inserimentoCast:function (response,i) {
      if (response.data.cast.length>2) {
        let nuovoCast={
          attoriUno:response.data.cast[0].original_name,
          attoriDue:response.data.cast[1].original_name,
          attoreTre:response.data.cast[2].original_name
        }
        Vue.set(this.castArray,i,nuovoCast);
      }else {
        Vue.set(this.castArray,i,{nessuno:'Non disponibile'});
      }
    },

    //funzione per bandiera non europea
    setAltImgBandiera:function (event) {
      event.target.src = "img/world.svg"
    },
  }
});
