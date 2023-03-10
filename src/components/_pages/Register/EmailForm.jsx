import React from "react";
import Link from "next/link";
import http from "@/utils/http";

import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/firebase";
import * as authReducer from "@/stores/reducers/auth";
import * as helper from "@/utils/helper";

function EmailForm() {
  const router = useRouter()
  const { error, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: helper.validationSchemaRegister,
    onSubmit: (values) => {
      const { type, value } = helper.getValueTypeRegister(values.value);
      dispatch(authReducer.setLoading(true));

      if (!isLoading) {
        handleRegister({ type, value });
      }
    },
  });

  const handleRegister = (payload) => {
    http
      .post("/auth/register", { [payload.type]: payload.value })
      .then((response) => {
        dispatch(
          authReducer.nextOtp({
            ...response.data,
            ...{
              type: payload.type,
              provider: payload.provider,
              [payload.type]: payload.value,
            },
          })
        );
      })
      .catch((error) => {
        const response = error?.response;
        dispatch(
          authReducer.setError({
            status: response?.status,
            message: response?.data?.errors,
          })
        );
      })
      .finally(() => dispatch(authReducer.setLoading(false)));
  };

  const registWithGoogle = () => {
    dispatch(authReducer.setLoading(true));
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        dispatch(
          authReducer.setProvider({
            type: "google",
            data: response.user,
          })
        );

        handleRegister({
          type: "email",
          value: response.user.email,
          provider: "google",
        });
      })
      .catch(() => {
        dispatch(
          authReducer.setError({
            status: true,
            message: "Cannot register with this email",
          })
        );
      })
      .finally(() => dispatch(authReducer.setLoading(false)));
  };

  const registWithFacebook = () => {
    dispatch(authReducer.setLoading(true));
    
    signInWithPopup(auth, facebookProvider)
      .then((response) => {
        dispatch(
          authReducer.setProvider({
            type: "facebook",
            data: response.user,
          })
        );

        handleRegister({
          type: "email",
          value: response.user.email,
          provider: "facebook",
        });
      })
      .catch((error) => {
        dispatch(
          authReducer.setError({
            status: true,
            message: "Cannot register with this email",
          })
        );
      })
      .finally(() => dispatch(authReducer.setLoading(false)));
  };

  const isValError = formik.touched.value && Boolean(formik.errors.value);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h5 class="card-title text-center mb-5 fw-light fs-5">Register</h5>

        {error.status && (
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>Register Failed</strong>
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
          <label for="floatingInput">Email or phone number</label>
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
            {isLoading ? "Loading..." : "Register"}
          </button>
        </div>

        <Link
          class="d-block text-center mt-2 small"
          href={`/${router.locale}/sign-in`}
        >
          Have an account? Sign In
        </Link>

        <hr class="my-4" />
      </form>
      <div class="d-grid mb-2">
        <button
          class="btn btn-lg btn-google btn-login"
          onClick={registWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In with Google"}
        </button>
      </div>

      <div class="d-grid">
        <button
          class="btn btn-lg btn-facebook btn-login"
          disabled={isLoading}
          onClick={registWithFacebook}
        >
          {isLoading ? "Loading..." : "Sign In with Facebook"}
        </button>
      </div>
    </>
  );
}

export default EmailForm;
