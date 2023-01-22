import axios from 'axios';

export const getComments = () => {
    return axios
        .get(process.env.REACT_APP_API_BASE_URL + `comments`, {
            headers: { "Content-type": "application/json" }
        }).then(res => {
            return Object.values(res.data);;
        })
}

export const createComment = (comment) => {
    return axios
        .post(
            process.env.REACT_APP_API_BASE_URL + "comments",
            comment,
            {
                headers: { "Content-type": "application/json" },
            }
        )
        .then((res) => {
            return res.data;
        });
}


export const getReactions = () => {
    return axios
        .get(process.env.REACT_APP_API_BASE_URL + `reactions`, {
            headers: { "Content-type": "application/json" }
        }).then(res => {
            return Object.values(res.data);;
        })
}

export const setReaction = (reaction) => {
    return axios
        .put(
            process.env.REACT_APP_API_BASE_URL + `reactions/${reaction}`
        ).then((res) => {
            return res.data;
        })
}