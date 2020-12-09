var app =new Vue({
  el:'#app',
  data:{
    apiKey:'8f23d254d7ec1835913633d0b0a45c83',  //codice apikey
    search:'',  //input di ricerca
    filmSerieArray:[],   //per film e serie tv
    bandieraArray:[],    //contine le bandiere delle nazioni in base alla lingua del film o serie
    copertinaArray:[],   //per la copertina di film o serie
    castArray:[],    //per il cast
    arrayAppoggio:[],  //array di appoggio per i film e serie popolari al caricamento
    attoriArray:[],   //serivirà a salvare l'id dell'attore
    displayCast:false,  // rende invisibile la parola cast al caricamento della pagina per film popolari
    idAttore:undefined

  },

  mounted:function () {
    //focus automatico sull'input
    document.getElementById('input').focus();

    // al caricamento inserisco in oagina i film/serie tv piu popolari
    axios.get('https://api.themoviedb.org/3/discover/movie?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc').then(response =>{
      this.arrayAppoggio=response.data.results;
      if (this.arrayAppoggio.length==20) {
        axios.get('https://api.themoviedb.org/3/discover/tv?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc').then(response =>{
          this.filmSerieArray=[...this.arrayAppoggio,...response.data.results];
          this.filmSerieArray.forEach((item, i) => {
            item.vote_average=Math.ceil(item.vote_average/2);    //trasformo il voto in base 10, in base 5
            Vue.set(this.copertinaArray,i,'https://image.tmdb.org/t/p/w342/'+item.poster_path);  //inserisco l'immagine di copertina
            Vue.set(this.bandieraArray,i,'img/'+item.original_language+'.svg');   //inserisco la bandiera in base alla lingua
          });
        });
      }
    });

  },

  methods:{

    ricerca:function () {  //funzione di ricerca
      this.filmSerieArray=[];
      this.attoriArray=[];
      this.copertinaArray=[];
      this.bandieraArray=[];
      this.castArray=[];
      this.displayCast=true;
      this.idAttore=undefined;

      //cerco film, serie tv o attori
      axios.get('https://api.themoviedb.org/3/search/multi?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc&query='+this.search).then(response => {
        this.filmSerieArray=response.data.results;    //inserisco la ricerca in filmSerieArray
        this.filmSerieArray.forEach((item, i) => { //inserisco in filmSerieArray: voto,cast,lingua e copertina

          if (item.media_type=='person') {    //salvo nella variabile idAttore l'id nella prima posizione
            if (i==0) {
              this.idAttore=item.id;
            }
            //inserisco l'id della ricerca nell'api
            axios.get('https://api.themoviedb.org/3/person/'+this.idAttore+'/combined_credits?api_key='+this.apiKey+'&language=it-IT').then(response => {
              this.attoriArray=response.data.cast;
              this.attoriArray.forEach((el, i) => {
                el.vote_average=Math.ceil(el.vote_average/2);    //trasformo il voto in base 10, in base 5
                Vue.set(this.copertinaArray,i,'https://image.tmdb.org/t/p/w342/'+el.poster_path);    //inserisco l'immagine di copertina
                Vue.set(this.bandieraArray,i,'img/'+el.original_language+'.svg');   //inserisco la bandiera in base alla lingua
              });
            });
          }else if (item.media_type=='movie') {   //se film
            axios.get('https://api.themoviedb.org/3/movie/'+item.id+'/credits?api_key='+this.apiKey+'&language=it-IT').then(response => {
              this.inserimentoCast(response,i);
            });
          }else if(item.media_type=='tv') { //se serie tv
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

    inserimentoCast:function (response,i) {  //funzione per inserie il cast
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

    setAltImgBandiera:function (event) {  //funzione per bandiera non europea
      event.target.src = "img/world.svg"
    },
  }
});
