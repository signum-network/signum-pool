import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const LoadingData = () => {
    const PlaceHolder = () => (
        <Skeleton variant="rectangular" width="100%" height={50} />
    );

    return (
        <Stack spacing={1}>
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
            <PlaceHolder />
        </Stack>
    );
};
