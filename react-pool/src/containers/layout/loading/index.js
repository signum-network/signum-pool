import React from "react";
import Spinner from "../../../components/UI/Spinner/index";

const Loading = (props) => {
  if (props.smallLoad) {
    return (
      <React.Fragment>
        <div
          style={{
            height: "300px",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Spinner />
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div
        style={{
          height: "100vh",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Spinner />
      </div>
    </React.Fragment>
  );
};

export default Loading;
