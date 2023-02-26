import React from "react";
import Link from "next/link";
import http from "@/utils/http";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "@/stores/reducers/auth";
import * as helper from "@/utils/helper";

function Login() {
  const router = useRouter();
  const { error, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: null,
    onSubmit: (values) => {
      dispatch(authReducer.setLoading(true));

      if (!isLoading) {
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
            console.log(error)
            const response = error?.response;
            dispatch(
              authReducer.setError({
                status: response?.status,
                message: response?.data?.errors ?? "Email or password invalid",
              })
            );
          })
          .finally(() => dispatch(authReducer.setLoading(false)));
      }
    },
  });

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
                    type="email"
                    class="form-control"
                    id="floatingInput"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    name="email"
                    onChange={formik.handleChange}
                  />
                  <label for="floatingInput">Email address</label>
                </div>
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

                <div class="d-grid">
                  <button
                    class="btn btn-lg btn-primary btn-login"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Sign In"}
                  </button>
                </div>
                <Link class="d-block text-center mt-2 small" href="/register">
                  Don't have an account? Register
                </Link>

                <hr class="my-4" />
                <div class="d-grid mb-2">
                  <button class="btn btn-google btn-login btn-lg" type="submit">
                    Sign in with Google
                  </button>
                </div>
                <div class="d-grid">
                  <button
                    class="btn btn-facebook btn-login btn-lg"
                    type="submit"
                  >
                    Sign in with Facebook
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
