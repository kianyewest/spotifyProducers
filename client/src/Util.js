import Box from "@material-ui/core/Box";

import CircularProgress from "@material-ui/core/CircularProgress";

function CircularProgressWithLabel({ value,children }) {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={value} />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
         {children}
        </Box>
      </Box>
    );
  }

 export default CircularProgressWithLabel 