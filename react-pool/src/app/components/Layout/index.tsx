import { Fragment, FC, useEffect, useState } from "react";
import { Header } from "./Header";

export const Layout: FC = ({ children }) => {
    return (
        <Fragment>
            <Header />
            {children}
        </Fragment>
    );
};
