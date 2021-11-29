import { filterRequestObject } from "..";
import { JoiValidatorsObj, UnknownObj } from "../../common";
import { UserFields } from "../../constants";
import { userRegularValidators, userRequiredValidators } from "../../validators";

interface JestObj {
  obj: UnknownObj;
  allowedFields: string[];
  validators: JoiValidatorsObj;
  errorMsg?: string;
  output?: UnknownObj;
}

const testingData: JestObj[] = [
  // not required fields
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix" },
    allowedFields: [UserFields.NAME],
    validators: userRegularValidators,
    output: { [UserFields.NAME]: "Jimi Hendrix" }
  },
  {
    obj: {},
    allowedFields: [UserFields.NAME],
    validators: userRegularValidators,
    output: {}
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix" },
    allowedFields: [UserFields.NAME, UserFields.EMAIL],
    validators: userRegularValidators,
    output: { [UserFields.NAME]: "Jimi Hendrix" }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix", [UserFields.EMAIL]: "jimi@example.com" },
    allowedFields: [UserFields.NAME, UserFields.EMAIL],
    validators: userRegularValidators,
    output: { [UserFields.NAME]: "Jimi Hendrix", [UserFields.EMAIL]: "jimi@example.com" }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix", [UserFields.EMAIL]: "jimi@example.com" },
    allowedFields: [UserFields.NAME],
    validators: userRegularValidators,
    output: { error: true }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix", wrongProp: "wrong" },
    allowedFields: [UserFields.NAME],
    validators: userRegularValidators,
    output: { error: true }
  },
  // required fields
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix" },
    allowedFields: [UserFields.NAME],
    validators: userRequiredValidators,
    output: { [UserFields.NAME]: "Jimi Hendrix" }
  },
  {
    obj: {},
    allowedFields: [UserFields.NAME],
    validators: userRequiredValidators,
    output: { error: true }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix" },
    allowedFields: [UserFields.NAME, UserFields.EMAIL],
    validators: userRequiredValidators,
    output: { error: true }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix", [UserFields.EMAIL]: "jimi@example.com" },
    allowedFields: [UserFields.NAME, UserFields.EMAIL],
    validators: userRequiredValidators,
    output: { [UserFields.NAME]: "Jimi Hendrix", [UserFields.EMAIL]: "jimi@example.com" }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix", [UserFields.EMAIL]: "jimi@example.com" },
    allowedFields: [UserFields.NAME],
    validators: userRequiredValidators,
    output: { error: true }
  },
  {
    obj: { [UserFields.NAME]: "Jimi Hendrix", wrongProp: "wrong" },
    allowedFields: [UserFields.NAME],
    validators: userRequiredValidators,
    output: { error: true }
  }
];

describe("Test utils", () => {
  test("Test filterRequestObject", () => {
    for (const item of testingData) {
      try {
        const filteredRequest = filterRequestObject(
          item.obj,
          item.allowedFields,
          item.validators,
          ""
        );

        expect(JSON.stringify(filteredRequest)).toBe(JSON.stringify(item.output));
      } catch (_err) {
        expect(item.output.error).toBe(true);
      }
    }
  });
});
