import { Fragment, useEffect } from "react";

// Default import
import styles from "./error.module.css";

// Material ui
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Third party
import { withRouter } from "react-router-dom";

const Error = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goHome = () => {
    props.history.replace("/");
  };

  return (
    <Fragment>
      <Box
        my={10}
        pt={0}
        px={2}
        mx="auto"
        width="100%"
        maxWidth="1000px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        className={styles.Allcontaining}
      >
        <Box className={styles.imgContainer}>
          <img
            src="/assets/404img.svg"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>

        <Box className={styles.textContainer}>
          <Typography component="h1" variant="h2">
            Oops! we can't find that page
          </Typography>
          <Typography
            gutterBottom
            color="textSecondary"
            variant="h6"
            className={styles.subTitle}
          >
            We could not find the page you were looking for.
          </Typography>
          <Button
            className={styles.homeBtn}
            onClick={goHome}
            variant="contained"
          >
            Go home
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};

export default withRouter(Error);
