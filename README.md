\# Start

npm run dev





\# default port is 9000

\# Check used port

netstat -ano | findstr :9000



C:\\ClaudeWorkspace\\github\\smartloan-api>netstat -ano | findstr :9000

&#x20; TCP    0.0.0.0:9000           0.0.0.0:0              LISTENING       14628

&#x20; TCP    \[::]:9000              \[::]:0                 LISTENING       14628

&#x20; TCP    \[::1]:9000             \[::1]:49468            ESTABLISHED     14628

&#x20; TCP    \[::1]:9000             \[::1]:59446            ESTABLISHED     14628

&#x20; TCP    \[::1]:49468            \[::1]:9000             ESTABLISHED     15796

&#x20; TCP    \[::1]:59446            \[::1]:9000             ESTABLISHED     17268



\# Kill Process

taskkill /PID 14628 /F

"# smartloan-api" 
