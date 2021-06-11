import React from "react";
import styles from "./Spinner.module.css";

const Spinner = (props) => (
  <div
    style={props.customStyling ? props.customStyling : null}
    className={styles.loader}
  ></div>
);

export default Spinner;
