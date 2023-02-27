import React from "react";
import EmailForm from "./EmailForm";
import OtpForm from "./OtpForm";
import ProfileForm from "./ProfileForm";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import * as authReducer from "@/stores/reducers/auth";

const SwitchView = ({ type }) => {
  switch (type) {
    case 1:
      return <EmailForm />;
    case 2:
      return <OtpForm />;
    case 3:
      return <ProfileForm />;
    default:
      return <EmailForm />;
  }
};

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (step === 4) {
      router.replace(`/${router.locale}/profile`);
    }
  }, [step]);

  React.useEffect(() => {
    dispatch(authReducer.removeError());
  }, []);

  return (
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden">
            <div class="card-body p-4 p-sm-5">
              <SwitchView type={step} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
