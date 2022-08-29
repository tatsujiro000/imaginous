import React from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function Score({condition_score, sleep_score}) {

    return (
        <Stack spacing={2} direction="row">
            <Box style={{display: 'flex'}}>
                <p style={{
                    fontSize:'2rem', 
                    marginRight:'0.5rem',
                    color:'#188356'
                }}>
                    {condition_score}
                </p>
                <p style={{
                    display: 'flex',
                    alignItems: 'end',
                    fontSize: '1.4rem',
                    color:'#551a8b'
                }}>
                    /{sleep_score}
                </p>
            </Box>
        </Stack>
    );
}