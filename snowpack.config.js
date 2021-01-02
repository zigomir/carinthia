module.exports = {
  devOptions: {
    fallback: 'no.html',
  },
  proxy: {
    '/api': 'http://localhost:3000',
  },
}
