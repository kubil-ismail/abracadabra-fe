import React from "react";
import http from "@/utils/http";

import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "@/stores/reducers/auth";

function ProfileForm() {
  const { error, isLoading, profile, provider } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [displayName_1, displayName_2] = (
    provider?.data?.displayName ?? ""
  )?.split(" ");

  const formik = useFormik({
    initialValues: {
      firstname: displayName_1,
      lastname: displayName_2,
      username: "",
      email: profile?.email ?? provider?.data?.email ?? "",
      phone_number: profile?.phone ?? provider?.data?.phoneNumber ?? "",
      password: provider?.data?.uid ?? "",
      password_2: provider?.data?.uid ?? "",
    },
    validationSchema: null,
    onSubmit: (values) => {
      const {
        firstname,
        lastname,
        username,
        phone_number,
        password,
        password_2,
        email,
      } = values;

      if (!isLoading) {
        http
          .post("/auth/register/basic-profile", {
            firstname,
            lastname,
            username,
            phone: phone_number,
            password,
            password_confirmation: password_2,
            email,
            pref_genre_ids: [1],
          })
          .then((response) => {
            dispatch(authReducer.completeProfile(response.data));
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

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <h5 class="card-title text-center mb-5 fw-light fs-5">
          Complete The Profile
        </h5>

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

        <div class="row mb-3">
          <div class="col-6">
            <div class="form-floating">
              <input
                class="form-control"
                id="floatingInputFirstname"
                placeholder="Enter your firstname"
                value={formik.values.firstname}
                name="firstname"
                onChange={formik.handleChange}
              />
              <label for="floatingInputFirstname">Firstname</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating">
              <input
                class="form-control"
                id="floatingInputLastname"
                placeholder="Enter your lastname"
                value={formik.values.lastname}
                name="lastname"
                onChange={formik.handleChange}
              />
              <label for="floatingInputLastname">Lastname</label>
            </div>
          </div>
        </div>

        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="floatingInputUsername"
            placeholder="Enter your username"
            value={formik.values.username}
            name="username"
            onChange={formik.handleChange}
          />
          <label for="floatingInputUsername">Username</label>
        </div>

        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="floatingInputEmail"
            placeholder="Enter your email"
            value={formik.values.email}
            name="email"
            onChange={formik.handleChange}
            readOnly={Boolean(profile?.email || provider?.data?.email)}
          />
          <label for="floatingInputEmail">Email Address</label>
        </div>

        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="floatingInputPhoneNumber"
            placeholder="Enter your phone"
            value={formik.values.phone_number}
            name="phone_number"
            onChange={formik.handleChange}
          />
          <label for="floatingInputPhoneNumber">Phone Number</label>
        </div>

        {!provider && (
          <>
            <div class="form-floating mb-3">
              <input
                class="form-control"
                id="floatingInputPassword"
                placeholder="Enter your password"
                value={formik.values.password}
                name="password"
                onChange={formik.handleChange}
                type="password"
              />
              <label for="floatingInputPassword">Password</label>
            </div>

            <div class="form-floating mb-3">
              <input
                class="form-control"
                id="floatingInputPassword_2"
                placeholder="Enter your password confirmation"
                value={formik.values.password_2}
                name="password_2"
                onChange={formik.handleChange}
                type="password"
              />
              <label for="floatingInputPassword_2">Password Confirmation</label>
            </div>
          </>
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
    </>
  );
}

export default ProfileForm;
