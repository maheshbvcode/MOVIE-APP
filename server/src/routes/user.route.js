import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userControllers from "../controllers/user.controllers.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../mongoDB/models/user.model.js";
import tokenMiddleaware from "../middlewares/token.middleaware.js";


const router = express.Router();

router.post(
    "/signup",
    body("username")
        .exists().withMessage("username is required")
        .isLength({ min: 8}).withMessage("username minimum 8 characters")
        .custom(async value => {
            const user = await userModel.findOne({ username: value })
            if (user) return Promise.reject("username already used");
        }),
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
    body("confirmPassword")
        .exists().withMessage("confirmPassword is required")
        .isLength({ min: 8 }).withMessage("confirmPassword minimum 8 characters")
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error("confirmPassword not match")
            return true
        }),
    body("displayName")
        .exists().withMessage("displayName is required")
        .isLength({ min: 8 }).withMessage("displayName minimum 8 characters"),
    requestHandler.validate,
    userControllers.signup
);

router.post(
    "/signin",
    body("username")
        .exists().withMessage("username is required")
        .isLength({ min: 8 }).withMessage("username minimum 8 characters"),
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
    requestHandler.validate,
    userControllers.signin
);

router.put(
    "/update-password",
    tokenMiddleaware.auth,
    body("password")
        .exists().withMessage("password is required")
        .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
    body("newPassword")
        .exists().withMessage("newPassword is required")
        .isLength({ min: 8 }).withMessage("newPassword minimum 8 characters"),
    body("confirmNewPassword")
        .exists().withMessage("confirmNewPassword is required")
        .isLength({ min: 8 }).withMessage("confirmNewPassword minimum 8 characters")
        .custom((value, { req }) => {
            if (value !== req.body.newpassword) throw new Error("confirmNewPassword not match")
            return true
        }),
    requestHandler.validate,
    userControllers.updatePassword


);

router.get(
    "/info",
    tokenMiddleaware.auth,
    userControllers.getInfo

);

router.get(
    "/favorites",
    tokenMiddleaware.auth,
    favoriteController.getFavoritesOfUser

);

router.post(
    "/favorites",
    tokenMiddleaware.auth,
    body("mediaType")
        .exists().withMessage("mediaType is required")
        .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
    body("mediaId")
        .exists().withMessage("mediaId is required")
        .isLength({ min: 8 }).withMessage("mediaId can not be empty"),
    body("mediaTitle")
        .exists().withMessage("mediaTitle is required"),
    body("mediaPoster")
        .exists().withMessage("mediaPoster is required"),
    body("mediaRate")
        .exists().withMessage("mediaRate is required"),
    requestHandler.validate,
    favoriteController.addFavorite

);

router.delete(
    "/favorites/:favoriteId",
    tokenMiddleaware.auth,
    favoriteController.removeFavorite
)


export default router;