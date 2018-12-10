import * as asyncHandler from 'express-async-handler'
import { Firestore } from "../lib/Firestore.js";

module.exports = () => {
    const express = require("express");
    const bodyParser = require("body-parser");
    const customCors = require('./custom-cors');
    const prodAuth = require('./prod-auth');
    const db = require('./db');

    const prodApp = express();


    
    prodApp.use(customCors);
    prodApp.use(prodAuth);
    prodApp.use(bodyParser.json());
    prodApp.use(bodyParser.urlencoded({ extended: true })); //To handle HTTP POST request in Express

    const fireStore = new Firestore();

    prodApp.get("/", (req, res) => {
        res.send('If you see this then token is valid');
    });

    //prodApp.get("/demand-breakdown", (req, result, next) => {
        //console.log('req.body.demand_id: ', req.query.demand_id);
        //return db.getDemandBreakdown(req.query.demand_id, result)
    //});

    // demand breakdown chart - slavica
    prodApp.get("/demand-breakdown", (req, result, next) => {
        let demand_id = req.query.demand_id;
        if (typeof demand_id !== 'undefined') {
            console.log('req: ', demand_id);
            db.getDemandBreakdown(demand_id)
                .then(res => { console.log('RES-demand-breakdown:', res); result.send(res) })
                .catch(e => console.error(e.stack));
        } else {
            result.status(400);
            result.send({ error: 'no demand_id' });
        }
    });
    
    // market overview chart
    prodApp.get("/market-overview", (req, result, next) => {
        let project_id = req.query.project_id;
        if (typeof project_id !== 'undefined') {
            console.log('req: ', project_id);
            db.getMarketOverview(project_id)
                .then(res => { console.log('RES-market-overview:', res); result.send(res) })
                .catch(e => console.error(e.stack));
        } else {
            result.status(400);
            result.send({ error: 'no project_id' });
        }
    });

    // supply breakdown chart
    prodApp.get("/supply-breakdown", (req, result, next) => {
        let project_id = req.query.project_id;
        if (typeof project_id !== 'undefined') {
            console.log('req: ', project_id);
            db.getSupplyBreakdownChartData(project_id)
                .then(res => { console.log('RES-supply-breakdown:', res); result.send(res) })
                .catch(e => console.error(e.stack));
        } else {
            result.status(400);
            result.send({ error: 'no project_id' });
        }
    });

    // Slavica test
    prodApp.get("/supply-list", (req, result, next) => {
        console.log('req: ', req.query.project_id);
        db.getSupplyList(req.query.project_id)
            .then(res => { console.log('RES:', res); result.send(res) })
            .catch(e => console.error(e.stack))
    });

    // Slavica - sessions per project
    prodApp.get("/sparkline", (req, result, next) => {
        db.getProjectSessions()
            .then(res => { console.log('RES:', res); result.send(res) })
            .catch(e => console.error(e.stack))
    });

    prodApp.post("/mapping", asyncHandler(async (req, result, next) => {
        let demand_id = req.body.demand_id;
        let sessionsIds = req.body.sessions; //ids of the sessions
    
        try {
            const data = await fireStore.getSessions(sessionsIds);
            const sessions = await db.getSession(data, demand_id);
    
            const isMapped = await Promise.all(sessions.map(async (session) => {
                const checkSession = await db.checkSession(session);
                if (checkSession.count < 1) {
                    return await db.saveSession(session);
                } else {
                    return await db.updateSession(session);
                }
            }))
            const mapped = await db.cleanMapped(isMapped);
    
            await fireStore.setMappedSessionFirestore(mapped, true, demand_id);
            const demand_name = await fireStore.getDemand(demand_id);
    
            result.send({ mapped, demand_name });
        } catch (e) {
            //this will eventually be handled by your error handling middleware
            next(e);
        }
    }));

    prodApp.post("/removeAllSessions", asyncHandler(async (req, result, next) => {
        let demand_id = req.body.demand_id;
        try {
            let check = await db.checkIfDemandGroupExists(demand_id);
            const demand_name = await fireStore.getDemand(demand_id);
            if (check.count > 0) {
                console.log('check.count.length: ', check.count);
                const sessions = await db.removeAllSessionsFromDemandGroup(demand_id);
                const sessions_ids = await db.cleanMapped(sessions);
                await fireStore.setMappedSessionFirestore(sessions_ids, false, demand_id);
    
                result.send({ sessions_ids, demand_name })
            } else {
                console.log('check.count.length: no sessions');
                result.send({ sessions_ids: [], demand_name });
            }
    
    
        } catch (e) {
            next(e);
        }
    }));

    prodApp.post("/removeSessionsfromAllDemand", (req, result, next) => {
        let sessions = req.body.sessions_id;
        console.log('node: sessions_id: ', sessions);
        sessions.map(session => {
            db.removeSessionsfromAllDemand(session, result);
        });
    
    });

    return prodApp;
};