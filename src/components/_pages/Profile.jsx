import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as authReducer from "@/stores/reducers/auth";
import { useRouter } from "next/router";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.auth);

  return (
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card border-0 shadow rounded-3 my-5">
            <div class="card-body p-4 p-sm-5">
              <img
                src="https://media.istockphoto.com/id/172366744/photo/smokers-silhouette.jpg?s=612x612&w=0&k=20&c=5cM3eUbEw-zxcl3zQVWtDgrPdOvot8teEjDlIyjU16I="
                class="mx-auto d-block profile mb-3"
                alt="profile"
                width="200px"
                height="200px"
              ></img>
              <h3 class="card-title text-center mb-2">
                {profile?.full_name ?? "-"}
              </h3>
              <h5 class="card-title text-center mb-5 fw-light fs-6">
                {profile?.email ?? "-"}
              </h5>

              <div class="d-grid mb-2">
                <button
                  class="btn btn-lg btn-google btn-login"
                  onClick={() => {
                    dispatch(authReducer.logout());
                    router.replace(`/${router.locale}/sign-in`);
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
