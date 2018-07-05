

const service = axios.create({
   baseURL: 'http://localhost:9090'
})


/**
 * Represents a book.
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
async function getUser() {
   try {
     const response = await service.get('/hello/vic')
     console.log(response)
   } catch (error) {
     console.error(error)
   }
 }

 getUser()
