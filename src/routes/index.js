import { Router } from 'express';
import passport from "passport";
import { Controller } from '../controller/index.js';
import { Controller2 } from '../controller/info&rnd.controller.js';
import { userAuth } from '../middleware/authlogin.js'
import compression from "compression";

const router = Router()

router.get("/", userAuth, Controller.getIndexPage);

router.post("/login",
    passport.authenticate("login", { failureRedirect: "/fail-login" }),
    Controller.postLogin);
router.get("/loginstatus", Controller.getLoginStatus);
router.get('/login', Controller.getLogin);

router.get("/logout", userAuth, Controller.logout);

router.get("/register", Controller.postRegister);
router.post("/register",
    passport.authenticate("register", { failureRedirect: "/fail-register" }),
    Controller.postRegister);

router.get("/fail-login", Controller.getLoginFailiure);
router.get("/fail-register", Controller.getRegisterFailiure);

router.get("/info", Controller2.getInfo)
router.get("/info-gzip", compression(), Controller2.getInfo)
router.get("/api/randoms", Controller2.getRandomNumber)

export default router;
