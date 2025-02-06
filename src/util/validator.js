export default {
  /**
   * Validation for required field
   * @param {*} req
   * @param {*} field
   * @returns
   */
  required: (req, field) => {
    return req[field] ? { key: field, value: "valid" } : { key: field, value: "required" };
  },

  /**
   * Validation for checking unique value
   * @param {*} req
   * @param {*} table
   * @param {*} field
   * @returns
   */
  unique: (req, result, field) => {
    return result.length ? { key: field, value: "already exist" } : { key: field, value: "valid" };
  },

  /**
   * Check results
   * @param {*} validation
   * @returns
   */
  check: (validation) => {
    let validated = {};

    validation.forEach((i) => {
      if (i.value != "valid") {
        validated[i.key] = i.value;
      }
      console.log(i);
    });

    if (Object.keys(validated).length > 0) {
      return { pass: false, result: validated };
    }
    return { pass: true, result: validated };
  },
};
