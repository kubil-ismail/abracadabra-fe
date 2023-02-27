import React from "react";
import Link from "next/link";
import http from "@/utils/http";

import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/firebase";
import * as authReducer from "@/stores/reducers/auth";
import * as helper from '@/utils/helper'

function Login() {
  const router = useRouter();
  const { error, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: helper.validationSchemaLogin,
    onSubmit: (values) => {
      dispatch(authReducer.setLoading(true));

      if (!isLoading) {
        handleLogin(values);
      }
    },
  });

  const handleLogin = (values) => {
    http
      .post("/auth/login", {
        identity: values.email,
        password: values.password,
      })
      .then((response) => {
        dispatch(authReducer.login(response?.data?.data));
        router.replace("/profile");
      })
      .catch((error) => {
        const response = error?.response;
        dispatch(
          authReducer.setError({
            status: response?.status,
            message: response?.data?.errors ?? "Email or password invalid",
          })
        );
      })
      .finally(() => dispatch(authReducer.setLoading(false)));
  };

  const loginWithGoogle = () => {
    dispatch(authReducer.setLoading(true));
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        dispatch(
          authReducer.setProvider({
            type: "google",
            data: response.user,
          })
        );

        handleLogin({
          email: response.user.email,
          password: response.user.uid,
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

  const loginWithFacebook = () => {
    dispatch(authReducer.setLoading(true));
    signInWithPopup(auth, facebookProvider)
      .then((response) => {
        dispatch(
          authReducer.setProvider({
            type: "facebook",
            data: response.user,
          })
        );

        handleLogin({
          email: response.user.email,
          password: response.user.uid,
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

  React.useEffect(() => {
    dispatch(authReducer.removeError());
  }, []);

  return (
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <h5 class="card-title text-center mb-5 fw-light fs-5">Sign In</h5>

              {error.status && (
                <div
                  class="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <strong>Sign In Failed</strong>
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

              <form onSubmit={formik.handleSubmit}>
                <div class="form-floating mb-3">
                  <input
                    // type="email"
                    class="form-control"
                    id="floatingInput"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    name="email"
                    onChange={formik.handleChange}
                  />
                  <label for="floatingInput">
                    Phone number or Email address
                  </label>
                </div>
                {formik.touched.email && Boolean(formik.errors.email) && (
                  <small class="d-grid mb-3 text-danger">
                    {formik.errors.email}
                  </small>
                )}
                <div class="form-floating mb-3">
                  <input
                    type="password"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    name="password"
                    onChange={formik.handleChange}
                  />
                  <label for="floatingPassword">Password</label>
                </div>
                {formik.touched.password && Boolean(formik.errors.password) && (
                  <small class="d-grid mb-3 text-danger">
                    {formik.errors.password}
                  </small>
                )}

                <div class="d-grid">
                  <button
                    class="btn btn-lg btn-primary btn-login"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Sign In"}
                  </button>
                </div>
                <Link
                  class="d-block text-center mt-2 small"
                  href={`/${router.locale}/register`}
                >
                  Don't have an account? Register
                </Link>

                <hr class="my-4" />
              </form>
              <div class="d-grid mb-2">
                <button
                  class="btn btn-google btn-login btn-lg"
                  onClick={loginWithGoogle}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign In with Google"}
                </button>
              </div>
              <div class="d-grid">
                <button
                  class="btn btn-facebook btn-login btn-lg"
                  onClick={loginWithFacebook}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign In with Facebook"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
