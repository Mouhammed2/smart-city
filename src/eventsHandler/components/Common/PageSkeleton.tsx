import React from "react";
import { Box, Skeleton } from "@mui/material";

const PageSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3, height: "100%" }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>

      {/* Content Grid Skeleton */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 3,
        }}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <Box key={index}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 1 }} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PageSkeleton;
