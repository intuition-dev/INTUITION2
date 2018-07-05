const service = axios.create({
   baseURL: 'http://localhost:9090',
   /*auth: {
      username: 'admin',
      password: '123'
    }*/
})



// jsdoc service.js
/**
 * Represents a book.
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function getUser() {
   return service.get('/hello/vic')
}

getUser().then(function(resp) {
   console.log(resp.data)
}).catch(function (error) {
   console.log(error.response.data.message)
})

