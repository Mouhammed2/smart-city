import React from 'react';
import { Backdrop, Box, Typography, useTheme, keyframes } from '@mui/material';
import { DirectionsBus } from '@mui/icons-material';

interface LoadingProps {
  open?: boolean;
  message?: string;
}

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
`;

const move = keyframes`
  0% {
    transform: translateX(-20px);
  }
  50% {
    transform: translateX(20px);
  }
  100% {
    transform: translateX(-20px);
  }
`;

const Loading: React.FC<LoadingProps> = ({ open = true, message = 'Loading...' }) => {
  const theme = useTheme();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.drawer + 2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
      open={open}
    >
      <Box
        sx={{
          position: 'relative',
          width: 100,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Animated road line */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.5) 10px,
                rgba(255, 255, 255, 0.5) 20px
              )`,
              animation: `${move} 1s linear infinite`,
            }
          }}
        />
        
        {/* Animated bus */}
        <Box
          sx={{
            animation: `${pulse} 1.5s ease-in-out infinite`,
            color: theme.palette.primary.main,
          }}
        >
          <DirectionsBus sx={{ fontSize: 48 }} />
        </Box>
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 500,
          textAlign: 'center',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        {message}
      </Typography>
    </Backdrop>
  );
};

export default Loading;
