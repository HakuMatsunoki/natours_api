import { model, Schema } from "mongoose";
import slugify from "slugify";

import { appConfig } from "../configs";
import { ModelTableNames, TourDifficulties } from "../constants";
// import { UserObject } from "./userModel";
// import { mustHaveMsg, mustBeMsg } from "../utils";

export interface TourObject {
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  priceDiscount: number;
  summary: string;
  description?: string;
  imageCover: string;
  images: Array<string>;
  createdAt: Date;
  startDates: Array<Date>;
  secretTour: boolean;
  startLocation: Location;
  locations: Array<Location>;
  guides: Array<Schema.Types.ObjectId>;
}

export interface Location {
  type: string;
  coordinates: Array<number>;
  address: string;
  description: string;
  day?: number;
}

const tourSchema: Schema = new Schema<TourObject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: appConfig.TOUR_NAME_MAX_LENGTH,
      minlength: appConfig.TOUR_NAME_MIN_LENGTH
    },
    slug: String,
    duration: {
      type: Number,
      required: true
    },
    maxGroupSize: {
      type: Number,
      required: true
    },
    difficulty: {
      type: String,
      required: true,
      enum: TourDifficulties
    },
    ratingsAverage: {
      type: Number,
      default: appConfig.RATING_DEFAULT,
      min: appConfig.RATING_MIN,
      max: appConfig.RATING_MAX,
      set: (val: number): number => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: true
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: TourObject, val: number): boolean {
          return val < this.price;
        }
      }
    },
    summary: {
      type: String,
      trim: true,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: true
    },
    images: [String],
    createdAt: {
      type: Date,
      default: new Date(Date.now()),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"]
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: ModelTableNames.USER
      }
    ]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

tourSchema.virtual("durationWeeks").get(function (this: TourObject): string {
  return (this.duration / 7).toFixed(1);
});

tourSchema.pre("save", function (next): void {
  this.slug = slugify(this.name, { lower: true });

  next();
});

tourSchema.pre(/^find/, function (next): void {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt"
  });

  next();
});

export const Tour = model<TourObject>(ModelTableNames.TOUR, tourSchema);
