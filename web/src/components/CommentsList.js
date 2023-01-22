import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getComments } from '../functions/endpoints';

export default function CommentsList() {
    const [comments, setComments] = React.useState([]);
    React.useEffect(() => {
        getComments().then((comments) => {
            setComments(comments);
        });
    }, []);

    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '20px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );

    return (
        <Card sx={{ minWidth: 1100 }}>
            <CardContent>
                <Typography sx={{ fontSize: 25 }} color="text.primary" gutterBottom>
                    Comments
                </Typography>
                <Grid item xs={12} md={6}>
                    <List dense={true}>
                        {comments.map((obj, index) => {
                            return <ListItem key={index}>
                                {bull}
                                <ListItemText
                                    primary={obj.user}
                                    secondary={obj.text}
                                />
                            </ListItem>
                        })}
                    </List>
                </Grid>
            </CardContent>
        </Card>
    );
}