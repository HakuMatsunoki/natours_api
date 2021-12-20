import * as Joi from "joi";
// import { required } from "joi";

import type { JoiValidatorsObj } from "../common";
import { appConfig, regexp } from "../configs";
import { LocationFields, TourDifficulties, TourFields } from "../constants";

// TODO: check !!!
export const tourRegularValidators: JoiValidatorsObj = {
  [TourFields.NAME]: Joi.string()
    .regex(regexp.NAME)
    .trim()
    .required()
    .default("New_Tour"),
  [TourFields.DURATION]: Joi.number()
    .min(1)
    .max(appConfig.TOUR_MAX_DURATION)
    .required()
    .default(1),
  [TourFields.MAX_GROUP]: Joi.number()
    .min(1)
    .max(appConfig.TOUR_MAX_GROUP)
    .required()
    .default(1),
  [TourFields.DIFFICULTY]: Joi.string().valid(...Object.keys(TourDifficulties)),
  [TourFields.PRICE]: Joi.number().min(0).required().default(0),
  [TourFields.DISCOUNT]: Joi.number().min(0),
  [TourFields.SUMM]: Joi.string().max(appConfig.TOUR_SUMM_MAX_LEN).trim(),
  [TourFields.DESC]: Joi.string().max(appConfig.TOUR_DESC_MAX_LEN).trim(),
  [TourFields.START_DATES]: Joi.array().items(Joi.date().iso()),
  [TourFields.START_LOCATION]: Joi.object({ 
    // Obj {"type":"Point","description":"California, USA","coordinates":[-118.803461,34.006072],"address":"29130 Cliffside Dr, Malibu, CA 90265, USA"},
    [LocationFields.TYPE]: Joi.string().required().default('Point'),
    [LocationFields.COORDS]: Joi.array().items(Joi.number()),
    [LocationFields.ADDR]: Joi.string().max(100),
    [LocationFields.DESC]: Joi.string().max(30),
    [LocationFields.DAY]: Joi.number().max(180)
  }), 
  //[TourFields.LOCATIONS]: Joi.array().items(Joi.ref(`...${[TourFields.START_LOCATION]}`)), // Array obj
  [TourFields.GUIDES]: Joi.array().items(Joi.string().regex(regexp.HEX)), // Arr objIDs
  [TourFields.SECRET]: Joi.boolean() // Arr objIDs
};
