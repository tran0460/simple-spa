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
    window.addEventListener('popstate', NAV.handlePop)
    document.addEventListener('DOMContentLoaded', () => {
      NAV.homeUrl()
      document.getElementById('instructions').classList.add('active')
      // STORAGE.saveState()
    })
    document.addEventListener('DOMContentLoaded',APP.getConfig)
    document.getElementById('btnSearch').addEventListener('click', SEARCH.handleSearch)

    document.addEventListener('popstate', NAV.handlePop)
    document.getElementById('actors-heading').addEventListener('click', () => {
      document.getElementById('sort').classList.remove('hidden')
    
    document.getElementById('media').classList.remove('active')
    document.getElementById('actors-cards').classList.add('active')
    document.getElementById('actors-heading').classList.remove('big-header')

    NAV.changeUrlActor()
    })
  },
};

const SEARCH = {
  baseUrl : 'https://api.themoviedb.org/3/',
  api: 'f8950444a4c0c67cbff1553083941ae3',
  actorProfile: [],
  
  
  handleSearch: (ev) => {
    ev.preventDefault();
    document.querySelector('.active').classList.remove('active')
    document.getElementById('media').classList.remove('active')

    let searchInput = document.getElementById('search').value
    let key = searchInput
    let getKey = localStorage.getItem(key)
    let data = JSON.parse(getKey)

    const url = `${SEARCH.baseUrl}search/person?api_key=${SEARCH.api}&query=${searchInput}`
    console.log(url)
    if (key in localStorage && getKey.length > 0) {
      if (SEARCH.actorProfile.length === 0) {
        data.forEach(profile => {
          SEARCH.actorProfile.push(profile)
        }
        )
      } else if (SEARCH.actorProfile.length > 0) {
        SEARCH.actorProfile = []
        data.forEach(profile => {
          SEARCH.actorProfile.push(profile)
        })
      }
    } else {
      document.querySelector('.loader').classList.add('active')
    fetch(url) 
    .then(response => {
      if (response.ok) {
        console.log('fetch successful')
        return response.json()
      } else {
        alert(`OOPS something went wrong : ${response.status}`)
      }
    })
    .then (data => {
      SEARCH.actorProfile = []
      data.results.forEach(profile => {
        SEARCH.actorProfile.push(profile)
      })
      document.querySelector('.loader').classList.remove('active')
      console.log(SEARCH.actorProfile)
    })
    .catch(err => {
      alert(`CAUGHT THIS ERROR : ${err.name}`)
  })
  
  }
    ACTORS.display()
  }
};

const ACTORS = {
  display: () => {
    document.getElementById('name-sort').addEventListener('click', SORT.name)
    document.getElementById('pop-sort').addEventListener('click', SORT.pop)
    NAV.changeUrlActor()
    STORAGE.data()

    ACTORS.buildCard()
  },
  buildCard: () => {
    
    const actorCards = document.getElementById('actors-cards')
    actorCards.innerHTML = ''
    actorCards.classList.add('active')
    document.getElementById('actors').classList.add('active')    
    SEARCH.actorProfile.forEach(actor => {
    let df = new DocumentFragment;
    let div = document.createElement('div')
      div.addEventListener('click', MEDIA.display)
      div.addEventListener('click', () => {
        let heading = document.getElementById('actors-heading')
        heading.classList.add('big-header')
      })
    div.setAttribute('data-actorId',`${actor.id}`)
    ACTORS.name = document.createElement('h3')
    let pop = document.createElement('p')
    let avatar = document.createElement('img')
    ACTORS.name.innerHTML = actor.name
    ACTORS.fullName = actor
    avatar.src = `${APP.imageUrl}w154${actor.profile_path}`
    avatar.alt = `${actor.name}`
    pop.innerHTML = `Popularity: ${actor.popularity}`
    if (actor.name === undefined) {
      console.log(`actor not found`)
    } else if (avatar.src === undefined) {
      console.log('avatar not found')
    }
    else {
      div.append(avatar,ACTORS.name,pop)
      df.append(div)
      actorCards.append(df)
    }
  })
  }
  
};

const MEDIA = {
  actorName: undefined,
  display: (ev) => {
    document.getElementById('media').classList.add('active')
    document.getElementById('actors-cards').classList.remove('active')
    document.getElementById('sort').classList.add('hidden')

    
    let knownFor = document.getElementById('known-for')
    let id = ev.currentTarget.getAttribute('data-actorId')
    knownFor.innerHTML = ''
    
    SEARCH.actorProfile.forEach(actor => {
      if(id == actor.id) {
        MEDIA.actorName = actor.name
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
    NAV.changeUrlMedia(id)
    // STORAGE.saveState()
    })
}
}

const STORAGE = {
  data: () => {
    let input = document.getElementById('search').value
    let actorData = JSON.stringify(SEARCH.actorProfile)
    localStorage.setItem(`${input}`, actorData)
  },
  // saveState: () => {
  //   const key = location.href
  //   let pageState = document.body.innerHTML
  //   localStorage.setItem(`${key}`, JSON.stringify(pageState))
  // }
};

const NAV = {
  hrefQuery: null,
  homeUrl: () => {
    location.hash = `#`
  },
  changeUrlActor: () => {
    let input = document.getElementById('search').value
    location.hash = `${input}`
    hrefQuery = location.href.split('#')[1]
    document.title = hrefQuery[0].toUpperCase() + hrefQuery.slice([1])
  },
  changeUrlMedia: (id) => {
    location.hash = `${hrefQuery}/${id}`
    document.title = MEDIA.actorName
  },
  handlePop: () => {
    // let key = location.href
    // let getKey = localStorage.getItem(key)
    // let data = JSON.parse(getKey)
    // if (key in localStorage) {
    //   console.log(data)
    //   document.body.innerHTML = data
    // }
  }
};


const SORT = {
  name: () => {
    document.getElementById('name-sort').removeEventListener('click', SORT.name)
    document.getElementById('name-sort').addEventListener('click', SORT.nameReverse)
    SEARCH.actorProfile.sort((a,b) => {
      if(a.name > b.name) {
        return 1
      } else {
        return -1
      }
    })
    ACTORS.buildCard()
  },
  pop: () => {
    document.getElementById('pop-sort').removeEventListener('click', SORT.pop)
    document.getElementById('pop-sort').addEventListener('click', SORT.popReverse)
    SEARCH.actorProfile.sort((a,b) => {
      if(a.popularity > b.popularity) {
        return 1
      } else {
        return -1
      }
    })
    ACTORS.buildCard()
  },
  nameReverse : () => {
    document.getElementById('name-sort').removeEventListener('click', SORT.nameReverse)
    document.getElementById('name-sort').addEventListener('click', SORT.name)
    SEARCH.actorProfile.sort((a,b) => {
      if(a.name > b.name) {
        return -1
      } else {
        return 1
      }
    })
    ACTORS.buildCard()
  },
  popReverse: () => {
    document.getElementById('pop-sort').removeEventListener('click', SORT.popReverse)
    document.getElementById('pop-sort').addEventListener('click', SORT.pop)
    SEARCH.actorProfile.sort((a,b) => {
      if(a.popularity > b.popularity) {
        return -1
      } else {
        return 1
      }
    })
    ACTORS.buildCard()
  }
}

APP.init();
