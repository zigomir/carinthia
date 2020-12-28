import morphdom from 'morphdom'
const parser = new DOMParser()

const navigate = async (link) => {
  const response = await fetch(link)
  if (response.ok) {
    const responseText = await response.text()
    const responseDoc = parser.parseFromString(responseText, 'text/html')

    morphdom(document.body, responseDoc.body)
    document.title = responseDoc.title
    attachListeners()
  } else {
    // "classic" link follow
    location.replace(link)
  }
}

const handleLink = (e) => {
  e.preventDefault()
  navigate(e.target.href)
  window.history.pushState({}, '', e.target.href)
}

const attachListeners = () => {
  document.querySelectorAll('a').forEach((link) => link.addEventListener('click', handleLink))
}

document.addEventListener('DOMContentLoaded', () => {
  attachListeners()
  window.onpopstate = (event) => navigate(event.path[0]?.location?.href)
})
