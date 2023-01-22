import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { getReactions, setReaction } from '../functions/endpoints';


export default function Reactions() {
    const [like, setLike] = React.useState([]);
    const [love, setLove] = React.useState([]);
    const [haha, setHaha] = React.useState([]);

    React.useEffect(() => {
        getReactions().then((resp) => {
            resp.forEach(r => {
                if (r.reaction === "like")
                    setLike(r.count);
                else if (r.reaction === "love")
                    setLove(r.count);
                else if (r.reaction === "haha")
                    setHaha(r.count);
            })
        });
    }, []);

    const react = (reaction) => {
        setReaction(reaction).then(res => alert(res));
    };

    return (
        <div>
            <Card sx={{ display: 'flex' }}>
                <CardMedia
                    component="img"
                    sx={{ width: 100, margin: 5 }}
                    image="https://www.freepnglogos.com/uploads/like-png/facebook-like-1.png"
                    alt="Like"
                    onClick={() => react("like")}
                />
                <CardMedia
                    component="img"
                    sx={{ width: 100, margin: 5 }}
                    image="https://www.freeiconspng.com/thumbs/facebook-love-png/facebook-love-png-3.png"
                    alt="Love"
                    onClick={() => react("love")}
                />
                <CardMedia
                    component="img"
                    sx={{ width: 100, margin: 5 }}
                    image="https://www.citypng.com/public/uploads/preview/-11592095892203mpzbiqb.png"
                    alt="Haha"
                    onClick={() => react("haha")}
                />
            </Card>
            <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ width: 100, margin: 2.5 }}>
                    <Typography component="div" variant="h5">
                        {like}
                    </Typography>
                </CardContent>
                <CardContent sx={{ width: 100, margin: 3 }}>
                    <Typography component="div" variant="h5">
                        {love}
                    </Typography>
                </CardContent>
                <CardContent sx={{ width: 100, margin: 2.5 }}>
                    <Typography component="div" variant="h5">
                        {haha}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}