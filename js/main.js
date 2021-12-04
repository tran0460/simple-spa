//app is for general control over the application
//and connections between the other components
const APP = {
  imageUrl: null,
  configData: null,
  getConfig: () => {
    const url = `https://api.themoviedb.org/3/configuration?api_key=f8950444a4c0c67cbff1553083941ae3`
    fetch(url) 
      .then(response => {
      if (response.ok) {
          return response.json()
      } else {
          throw new Error(`something went wrong : ${response.status}`)
      }
    })
    .then(data => {
      APP.imageUrl = data.images.secure_base_url
      APP.configData = data.images
    })
    .catch(error => 
      alert(`Theres been an ERROR!!!!!!!! ${error.name}, ${error.message}`))
  },
  init: () => {
    document.addEventListener('DOMContentLoaded', () => document.getElementById('instructions').classList.add('active'))
    document.addEventListener('DOMContentLoaded',APP.getConfig)
    document.getElementById('btnSearch').addEventListener('click', SEARCH.handleSearch)

    document.getElementById('actors-heading').addEventListener('click', () => {
    document.getElementById('media').classList.remove('active')
    document.getElementById('actors-cards').classList.add('active')
    document.getElementById('actors-heading').classList.remove('big-header')
    })
  },
};

const SEARCH = {
  baseUrl : 'https://api.themoviedb.org/3/',
  api: 'f8950444a4c0c67cbff1553083941ae3',
  actorProfile: [],
  
  
  handleSearch: (ev) => {
    ev.preventDefault();
    document.getElementById('media').classList.remove('active')

    let searchInput = document.getElementById('search').value
    const url = `${SEARCH.baseUrl}search/person?api_key=${SEARCH.api}&query=${searchInput}`
    console.log(url)
    fetch(url) 
    .then(response => {
      if (response.ok) {
        console.log('fetch successful')
        return response.json()
      } else {
        throw new Error(`something went wrong : ${response.status}`)
      }
    })
    .then (data => {
      if (SEARCH.actorProfile.length === 0) {
        data.results.forEach(profile => {
          SEARCH.actorProfile.push(profile)
        }
        )
      } else if (SEARCH.actorProfile.length > 0) {
        SEARCH.actorProfile = []
        data.results.forEach(profile => {
          SEARCH.actorProfile.push(profile)
        })
      }
    })
    window.setTimeout(ACTORS.display, 500)
  }
};

const ACTORS = {
  display: () => {
    const actorCards = document.getElementById('actors-cards')
    actorCards.innerHTML = ''

    actorCards.classList.add('active')
    document.getElementById('actors').classList.add('active')
    document.getElementById('instructions').classList.remove('active')
    
    SEARCH.actorProfile.forEach(actor => {
    let df = new DocumentFragment;
    let div = document.createElement('div')
      div.addEventListener('click', MEDIA.display)
      div.addEventListener('click', () => {
        let heading = document.getElementById('actors-heading')
        heading.classList.add('big-header')
      })
    div.setAttribute('data-actorId',`${actor.id}`)
    let name = document.createElement('h3')
    let pop = document.createElement('p')
    let avatar = document.createElement('img')
    name.innerHTML = actor.name
    avatar.src = `${APP.imageUrl}w154${actor.profile_path}`
    avatar.alt = `${actor.name}`
    pop.innerHTML = `Popularity: ${actor.popularity}`
    if (actor.name === undefined) {
      console.log(`actor not found`)
    } else if (avatar.src === undefined) {
      console.log('avatar not found')
    }
    else {
      div.append(avatar,name,pop)
      df.append(div)
      actorCards.append(df)
    }
  })
  }
};

const MEDIA = {
  display: (ev) => {
    document.getElementById('media').classList.add('active')
    document.getElementById('actors-cards').classList.remove('active')

    let knownFor = document.getElementById('known-for')
    let id = ev.currentTarget.getAttribute('data-actorId')
    knownFor.innerHTML = ''

    SEARCH.actorProfile.forEach(actor => {
      if(id == actor.id) {
        console.log(actor)
          console.log('FOUND EM')
          actor.known_for.forEach(title => {
            if (title.media_type === "movie"){
          let df = new DocumentFragment
          let div = document.createElement('div')
          let name = document.createElement('h3')
          let year = document.createElement('p')
          let poster = document.createElement('img')
            
          name.innerHTML = title.original_title
          poster.src = `${APP.imageUrl}w154${title.poster_path}`
          poster.alt = `${title.original_title}`
          year.innerHTML = `Release date : ${title.release_date}`
          
          div.append(poster,name,year)
          df.append(div)
          knownFor.append(df)
        }
            if (title.media_type === "tv"){
          let df = new DocumentFragment
          let div = document.createElement('div')
          let name = document.createElement('h3')
          let year = document.createElement('p')
          let poster = document.createElement('img')
            
          name.innerHTML = title.original_name
          poster.src = `${APP.imageUrl}w154${title.poster_path}`
          poster.alt = `${title.original_title}`
          year.innerHTML = `Release date : ${title.first_air_date}`
          
          div.append(poster,name,year)
          df.append(div)
          knownFor.append(df)
        }
        })
      }
    })

}
}

//storage is for working with localstorage
const STORAGE = {
  //this will be used in Assign 4
};

//nav is for anything connected to the history api and location
const NAV = {
  //this will be used in Assign 4
};

//Start everything running

APP.init();
