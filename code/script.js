//DOM Selectors
const toggleSwitch = document.getElementById('switch')

//eventlistener
toggleSwitch.addEventListener('click', () => {
  console.log('hej')
})

//Global variables
const username = 'emmahogberg88'
const URL_REPO = `https://api.github.com/users/${username}/repos`
//const API_TOKEN = TOKEN || process.env.API_KEY


//option for authorization
const options = {
  method: 'GET',
  headers: {
    Authorization: `token ${API_TOKEN}`  // you need to paste your token over here.
  }
}

///////////////////////////////////////////////////////////////////////////
//////////////////////           REPO DATA         ////////////////////////
///////////////////////////////////////////////////////////////////////////
const gitHubData = () => {

fetch(URL_REPO, options)
  .then(res => res.json())
  .then(data => {
  userData(data)
  repoData(data)

  })
  .catch(err => console.error(err))
}

//--get and display user information--//
const userData = (data) => {

//Get image from user profile and display on website
  document.getElementById('profile-picture').innerHTML = `
  <img class="box-shadow" src='${data[0].owner.avatar_url}' alt='image of emmahogberg88 at GitHub'>
  `
  //Get url to user profile and show on website
  document.getElementById('username').innerHTML = `
  <h4><a class="header" href='${data[0].html_url}'><i class="fab fa-github"></i> ${username}</a></h4>
  `
}

//--display repo information--//
const repoData = (data) => {

//Get technigo projects by filtering data by repos that starts with "project- and is forked"
  const technigoProjects = data.filter(repo => repo.name.startsWith('project-') && repo.fork)

  //Pass amount of finished technigo projects to progressChart in chart.js file
  progressChart(technigoProjects.length)  
  
  //ADD EVENTLISTENER AND TOGGLEBAR!!
  //Create toggle bar, 
  //create sort-function that is listening to an event. 


    //Sort repos by latest push date
  const sortByLatestUpdate = technigoProjects.sort((oldest, newest) => new Date(newest.updated_at) - new Date(oldest.updated_at))
  console.log(sortByLatestUpdate)

  //Sort repos by latest push date
  const sortByNewestRepo = technigoProjects.sort((oldest, newest) => new Date(newest.pushed_at) - new Date(oldest.pushed_at))
  console.log(sortByNewestRepo)

  //Loop through array to get data about each item in array
  technigoProjects.forEach(repo => {
    
  //Get name of repo
  const reponame = repo.name

  //Get url to each repo 
  const projectUrl = repo.html_url
  
  //Get default branch
  const defaultBranch = repo.default_branch
  
  //Get the date of latest update of the repo
  const latestUpdateRepo = new Date(repo.updated_at).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'})
  
  //Display HTML for all GitHub repos on website, setting dynamic ID to be able to add on more HTML in another function
  document.getElementById('section-projects').innerHTML += `
  <div class="section-projects__card box-shadow">
    <h3 class="repo-title bold-text"><a href='${projectUrl}'>${reponame}</a></h3>
    <p><span class="bold-text">Default branch:</span> ${defaultBranch}</p>
    <p><span class="bold-text">Latest update:</span> ${latestUpdateRepo}</p>
    <p id="commits-${reponame}"></p>
    <p id="comments-${reponame}"></p>
    <div class="card-btn flex">
      <p id="website-${reponame}"></p>
      <p id="comments-btn-${reponame}"></p>
    </div>
  </div>  
  `

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////      PULL REQUEST DATA      ///////////////////////
  ///////////////////////////////////////////////////////////////////////////
  fetch(`https://api.github.com/repos/Technigo/${reponame}/pulls?per_page=100`, options)
    .then(res => res.json())
    .then(data => {
      
      data.forEach( repo => {
        if(repo.user.login === username) {

          let reponame = repo.base.repo.name
         
          //get url for commits to use in new fetch
          const commitsUrl = repo.commits_url
          displayCommits(commitsUrl, reponame)        
          //get url for comments to use in new fetch  
          const commentsUrl = repo.review_comments_url
          displayComments(commentsUrl, reponame) 

          //get url for netlify
          const netlifyUrl = repo.body
          displayLink(netlifyUrl, reponame)

        } else if (repo.user.login === 'tiiliu' && reponame === 'project-chatbot') {
          displayCommits(repo.commits_url, reponame)   
          displayComments(repo.review_comments_url, reponame) 
          displayLink('https://movie-bot.netlify.app/', reponame)     
            
        } else {
          document.getElementById(`commits-${reponame}`).innerHTML = 'No commits for this repo'
          document.getElementById(`comments-${reponame}`).innerHTML = ''
        }
      })
    })
    .catch(err => console.error(err))
  })
}


////////////////////////////////////////////////////////////////////////////
///////////////////////////      COMMITS DATA     /////////////////////////
//////////////////////////////////////////////////////////////////////////
const displayCommits = (commitsUrl, reponame) => {
  fetch(commitsUrl, options)
  .then(res => res.json())
  .then(data => {
    document.getElementById(`commits-${reponame}`).innerHTML = `
    <p>
    <span class="bold-text">Amount of commits:</span> ${data.length}
    </p>`
  })
  .catch(err => console.error(err))
}

////////////////////////////////////////////////////////////////////////////
//////////////////////////      COMMENTS DATA     /////////////////////////
//////////////////////////////////////////////////////////////////////////
const displayComments = (commentsUrl, reponame) => {
  fetch(commentsUrl, options)
  .then(res => res.json())
  .then(data => {
    if (data.length > 0) {
      data.forEach(comment => {
        if (comment.user.login !== username) {
          document.getElementById(`comments-${reponame}`).innerHTML = `
          <p>
            <span class="bold-text">Reviewed by:</span> 
            <a href="${data[0].user.html_url}"> ${data[0].user.login}</a>
            </p>
          `
          const comments = comment.body
          console.log(comment.body)

          document.getElementById(`comments-btn-${reponame}`).innerHTML = `
            <button class="outlined-button">comments 💬</button> 
          `
          //take this and print in an accordion!
          //gör ev. som i guess who med onclick..
        }
      })
    }
  })
  .catch(err => console.error(err))
}

////////////////////////////////////////////////////////////////////////////
///////////////////////////      NETLIFY LINK     /////////////////////////
//////////////////////////////////////////////////////////////////////////
const displayLink = (netlifyUrl, reponame) => {
  
    document.getElementById(`website-${reponame}`).innerHTML = `
    <a href="${netlifyUrl}">
    <button class="filled-button">visit website</button>
    </a>
    `
  }

gitHubData()


const getComment = (comment) => {
  // document.getElementById('modal').innerHTML += `<p>${comment}</p>` 
  console.log(comment)
}