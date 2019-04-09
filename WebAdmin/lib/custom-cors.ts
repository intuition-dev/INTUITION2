export class CustomCors {
   cors() {
      return (request, response, next) => {
         response.setHeader('Access-Control-Allow-Origin', '*');
         response.setHeader('Access-Control-Allow-Methods', '*');
         response.setHeader('Access-Control-Allow-Headers', '*');
         if (request.method === 'OPTIONS') {
            response.status(204).send();
         } else {
            return next();
         }
      }
   };
}

module.exports = {
   CustomCors
}