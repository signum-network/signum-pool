import Box from "@mui/material/Box";

export const TestnetStamp = () => (
    <Box
        width="100%"
        position="absolute"
        top="50%"
        display="flex"
        justifyContent="center"
        sx={{ width: { xs: "100%", md: 300 }, left: { xs: "0%", md: "50%" } }}
    >
        <Box
            color="#d23"
            border="0.4rem double #d23"
            display="inline-block"
            textTransform="uppercase"
            padding="0.25rem 1rem"
            borderRadius="1rem"
            fontWeight={700}
            sx={{
                opacity: 0.666,
                transform: "rotate(15deg)",
                fontSize: { xs: 12, md: "1.5rem" },
            }}
        >
            Testnet 😊
        </Box>
    </Box>
);
