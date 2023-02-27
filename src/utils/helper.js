import * as yup from "yup";

export const rupiah = (money) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(money);
};

export const phoneRegex =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const emailRegex =
  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

export const getValueTypeRegister = (value) => {
  let isValidEmail = emailRegex.test(value);
  let isValidPhone = phoneRegex.test(value);

  if (isValidEmail) {
    return {
      type: "email",
      value: value,
    };
  } else if (isValidPhone) {
    return {
      type: "phone",
      value: value,
    };
  } else {
    return {
      type: "unknown",
      value: value,
    };
  }
};

export const validationSchemaRegister = yup.object({
  value: yup.string("Enter your email/phone number").test(
    "check",
    (e) => {
      if (parseInt(e.originalValue)) {
        return "Phone number is not valid";
      } else {
        return "Email address is not valid";
      }
    },
    (value) => {
      let isValidEmail = emailRegex.test(value);
      let isValidPhone = phoneRegex.test(value);

      if (!isValidEmail && !isValidPhone) {
        return false;
      }
      return true;
    }
  ),
});

export const validationSchemaLogin = yup.object({
  email: yup
    .string("Enter your email/phone number")
    .test(
      "check",
      (e) => {
        if (parseInt(e.originalValue)) {
          return "Phone number is not valid";
        } else {
          return "Email address is not valid";
        }
      },
      (value) => {
        let isValidEmail = emailRegex.test(value);
        let isValidPhone = phoneRegex.test(value);

        if (!isValidEmail && !isValidPhone) {
          return false;
        }
        return true;
      }
    )
    .required("This field cannot empty"),
  password: yup
    .string("Enter your password")
    .required("This field cannot empty"),
});

export const validationSchemaOtp = yup.object({
  value: yup
    .number()
    .integer()
    .required("Code OTP is required")
    .typeError("Invalid code OTP"),
});
