import morphdom from 'morphdom'

const navigate = async (link) => {
  const resp = await fetch(link)
  const body = await resp.text()
  const parser = new DOMParser()
  const responseDoc = parser.parseFromString(body, 'text/html')

  morphdom(document.body, responseDoc.body)
  document.title = responseDoc.title
  attachListeners()
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
