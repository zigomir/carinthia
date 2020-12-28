import morphdom from 'morphdom'

const navigate = async (link) => {
  const resp = await fetch(link)
  const body = await resp.text()
  const parser = new DOMParser()
  const responseDoc = parser.parseFromString(body, 'text/html')

  morphdom(document.body, responseDoc.body)
  document.title = responseDoc.title
}

const handleLink = (e) => {
  e.preventDefault()
  navigate(e.target.href)
  window.history.pushState({}, '', e.target.href)
}

document.querySelectorAll('a').forEach((link) => link.addEventListener('click', handleLink))
window.onpopstate = (event) => navigate(event.path[0]?.location?.href)
