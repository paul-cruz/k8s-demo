import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createComment } from '../functions/endpoints';


export default function CommentForm() {
    const [username, setUsername] = React.useState('');
    const [comment, setComment] = React.useState('');

    const handleUsername = (event) => {
        setUsername(event.target.value);
    };

    const handleComment = (event) => {
        setComment(event.target.value);
    };

    const addComment = () => {
        if (!username || !comment) {
            alert("Fill all fields please");
            return;
        }
        createComment({
            "user": username,
            "text": comment
        }).then(res => alert(res));
    };

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
                backgroundColor: 'primary.light',
            }}
            required
            autoComplete="off"
        >
            <TextField id="username" color="secondary" label="Username" variant="filled" onChange={handleUsername} value={username} />
            <TextField id="comment" color="secondary" label="Comment" variant="filled" onChange={handleComment} value={comment} />
            <Button variant="contained" onClick={addComment}>Summit</Button>
        </Box>
    );
}