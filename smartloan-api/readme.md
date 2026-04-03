\# Start

npm run dev





\# default port is 3001

\# Check used port

netstat -ano | findstr :3001



C:\\ClaudeWorkspace\\github\\smartloan-api>netstat -ano | findstr :3001

&#x20; TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       14628

&#x20; TCP    \[::]:3001              \[::]:0                 LISTENING       14628

&#x20; TCP    \[::1]:3001             \[::1]:49468            ESTABLISHED     14628

&#x20; TCP    \[::1]:3001             \[::1]:59446            ESTABLISHED     14628

&#x20; TCP    \[::1]:49468            \[::1]:3001             ESTABLISHED     15796

&#x20; TCP    \[::1]:59446            \[::1]:3001             ESTABLISHED     17268



\# Kill Process

taskkill /PID 14628 /F

"# smartloan-api" 
