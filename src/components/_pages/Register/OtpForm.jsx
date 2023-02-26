import React from "react";
import http from "@/utils/http";
import Image from "next/image";

import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "@/stores/reducers/auth";
import * as helper from "@/utils/helper";

function OtpForm() {
  const [minutes, setMinutes] = React.useState(1);
  const [seconds, setSeconds] = React.useState(0);
  const [start, setStart] = React.useState(false);
  const [isSend, setIsSend] = React.useState(false);

  const { error, isLoading, profile } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: helper.validationSchemaOtp,
    onSubmit: (values) => {
      dispatch(authReducer.setLoading(true));

      if (!isLoading) {
        http
          .post("/auth/register/otp/confirm", { otp: values.value })
          .then((response) => {
            dispatch(authReducer.nextProfile(response.data));
          })
          .catch((error) => {
            const response = error?.response;
            dispatch(
              authReducer.setError({
                status: response?.status,
                message: response?.data?.errors ?? response?.data?.message,
              })
            );
          })
          .finally(() => dispatch(authReducer.setLoading(false)));
      }
    },
  });

  React.useEffect(() => {
    if (start) {
      let interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setStart(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [seconds, minutes, start]);

  const sendOtp = () => {
    setIsSend(true);
    http
      .post("/auth/register/otp/resend", {
        identifier: profile?.email,
      })
      .then(() => {
        setStart(true);
        setIsSend(false);
      })
      .catch(() => {});
  };

  const Countdown = () =>
    (minutes === 0 && seconds === 0) || !start ? (
      "Resend OTP"
    ) : (
      <React.Fragment>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </React.Fragment>
    );

  const isValError = formik.touched.value && Boolean(formik.errors.value);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h5 class="card-title text-center mb-5 fw-light fs-5">
          Confirmation OTP
        </h5>

        <div className="d-flex justify-content-center mb-4">
          <Image
            src="/images/undraw_opened_re_i38e.svg"
            alt="icon"
            width="200"
            height="200"
          />
        </div>

        {error.status && (
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>Confirmation Failed</strong>
            <p>{error.message}</p>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => dispatch(authReducer.removeError())}
            ></button>
          </div>
        )}

        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="floatingInput"
            placeholder="Enter your email / phone number"
            value={formik.values.value}
            name="value"
            onChange={formik.handleChange}
          />
          <label for="floatingInput">Enter code here...</label>
        </div>

        {isValError && (
          <small class="d-grid mb-3 text-danger">{formik.errors.value}</small>
        )}

        <div class="d-grid mb-2">
          <button
            class="btn btn-lg btn-primary btn-login"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Confirm"}
          </button>
        </div>
      </form>
      <div class="d-grid mb-2">
        <button
          class="btn btn-lg btn-outline-primary"
          disabled={start || isSend}
          onClick={sendOtp}
        >
          {isSend ? "Sending..." : <Countdown />}
        </button>
      </div>
    </>
  );
}

export default OtpForm;
