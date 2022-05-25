export default class Utility {
  static isValidField = (term) => {
    let length = term.trim().length;
    return length > 0 ? true : false;
  };

  static isEmailValid = (term) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    let isValid = expression.test(String(term).toLowerCase());
    return isValid;
  };

  static isEmpty = (string) => {
    /* trim will remove white spaces at both ends of string */
    if (string.trim() === "") {
      return true; /* if the string is empty return true */
    } else {
      return false; /* if the string is not empty return false */
    }
  };


  static isValidPassword = (password) => {
    const regaxPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}$/;
    /* if the string matches the regex */
    if (password.match(regaxPassword)) {
      return true; /* return true if matches */
    } else if (!password.match(regaxPassword)) {
      return false; /* return false if does not match */
    }
  };

  static isValidContactNumber = (string) => {
    const regaxContactNumber = /[689]{1}[0-9]{7}$/;
    /* if the string matches the regex */
    if (string.match(regaxContactNumber)) {
      return true; /* return true if matches */
    } else if (!string.match(regaxContactNumber)) {
      return false; /* return false if does not match */
    }
  };

  static isAlphabet = (string) => {
    const regexName = /[a-zA-Z]{1,}$/;
    /* if the string matches the regex */
    if (string.match(regexName)) {
      return true; /* return true if matches */
    } else if (!string.match(regexName)) {
      return false; /* return false if does not match */
    }
  };

  static isPriceNumber = (number) => {
    const regexNumber = /^[0-9]+(\.[0-9]{1,2})?$/;
    /* if the string matches the regex */
    if (number.match(regexNumber)) {
      return true; /* return true if matches */
    } else if (!number.match(regexNumber)) {
      return false; /* return false if does not match */
    }
  };

}
