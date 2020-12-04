var app =new Vue({
  el:'#app',
  data:{
    apiKey:'8f23d254d7ec1835913633d0b0a45c83',
    search:'',  //input di ricerca
    display:'block',
    ricercaArray:[],
    bandieraArray:[],
    copertinaArray:[],
    castArray:[]
  },
  mounted:function () {
    //focus automatico sull'input
    document.getElementById('input').focus();
  },

  methods:{

    //funzione di ricerca
    ricerca:function () {
      this.ricercaArray=[];
      this.copertinaArray=[];
      this.bandieraArray=[];
      this.castArray=[];
      //cerco i film
      axios.get('https://api.themoviedb.org/3/search/multi?api_key='+this.apiKey+'&language=it-IT&sort_by=popularity.desc&query='+this.search).then(response => {
        this.ricercaArray=response.data.results;
        this.ricercaArray.forEach((item, i) => {
          //se film
          if (item.media_type=='movie') {
            axios.get('https://api.themoviedb.org/3/movie/'+item.id+'/credits?api_key='+this.apiKey+'&language=it-IT').then(response => {
              if (response.data.cast.length>0) {
                let nuovoCast={
                  attori1:response.data.cast[0].original_name,
                  attori2:response.data.cast[1].original_name,
                  attore3:response.data.cast[2].original_name
                }
                this.castArray.push(nuovoCast);
              }else {
                this.castArray.push({nessuno:'Non disponibile'})
              }
            });
          }else { //se serie tv
            axios.get('https://api.themoviedb.org/3/tv/'+item.id+'/credits?api_key='+this.apiKey+'&language=it-IT').then(response => {
              if (response.data.cast.length>0) {
                let nuovoCast={
                  attori1:response.data.cast[0].original_name,
                  attori2:response.data.cast[1].original_name,
                  attori3:response.data.cast[2].original_name
                }
                this.castArray.push(nuovoCast);
              }else {
                this.castArray.push({nessuno:'Non disponibile'})
              }
            });
          }
          console.log(this.castArray);
          item.vote_average=Math.ceil(item.vote_average/2);    //trasformo il voto in base 10, in base 5

          this.copertinaArray.push('https://image.tmdb.org/t/p/w342/'+item.poster_path);  //inserisco l'immagine di copertina

          this.bandieraArray.push('img/'+item.original_language+'.svg');   //inserisco la bandiera in base alla lingua
        });
      });
    },

    //funzione per copertina non disponibile
    setAltImgCopertina:function (event) {
      event.target.src='img/img-vuota.svg';
    },

    //funzione per bandiera non europea
    setAltImgBandiera:function (event) {
      event.target.src = "img/world.svg"
    },
  }
})
