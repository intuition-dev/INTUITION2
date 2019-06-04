import { ExpressRPC } from 'mbake/lib/Serv';
import { EditorRoutes } from './lib/editor';
import { Wa } from 'mbake/lib/Wa';
import { AdminRoutes } from './lib/admin';

const mainAppG = ExpressRPC.makeInstance(['http://localhost:9080']);
const appGPORT = '9081';

/*
* E D I T O R S
*/

const editorRoutes = new EditorRoutes();
mainAppG.use('/api/editors', editorRoutes.routes());
mainAppG.use('/editors', ExpressRPC.serveStatic('www'));


// Wa.watch('/Users/liza/work/mbakeCLI/CMS', 9082);

/*
* A D M I N
*/

const adminRoutes = new AdminRoutes();
mainAppG.use('/api/admin', adminRoutes.routes());
mainAppG.use('/admin', ExpressRPC.serveStatic('wwwAdmin'));

mainAppG.listen(appGPORT, () => {
   console.log(`mainAppG listening on port ${appGPORT}!`);

   console.log(`======================================================`);
   console.log(`App is running at http://localhost:${appGPORT}/editors/`);
   console.log(`Admin is running at http://localhost:${appGPORT}/admin/`);
   console.log(`======================================================`);
});