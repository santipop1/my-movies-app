import api from "../api";

export const getPopularMovies = async (page = 1) => {
    let res: any;
    const endpoint = `/movie/popular?language=en-US&page=${page}`;
    await api
    .get(endpoint)
    .then((d) => {
        res = d.data
    })
    .catch((err) => {
        res = err.response;
    });

    return res;
};

export const getNowPlayingMovies = async (page = 1) => {
    let res: any;
    const endpoint = `/movie/now_playing?language=en-US&page=${page}`;
    await api
    .get(endpoint)
    .then((d) => {
        res = d.data
    })
    .catch((err) => {
        res = err.response;
    });

    return res;
};

export const getTopRatedMovies = async (page = 1) => {
    let res: any;
    const endpoint = `/movie/top_rated?language=en-US&page=${page}`;
    await api
    .get(endpoint)
    .then((d) => {
        res = d.data
    })
    .catch((err) => {
        res = err.response;
    });

    return res;
};

export const getUpcomingMovies = async (page = 1) => {
    let res: any;
    const endpoint = `/movie/upcoming?language=en-US&page=${page}`;
    await api
    .get(endpoint)
    .then((d) => {
        res = d.data
    })
    .catch((err) => {
        res = err.response;
    });
    return res;
};

export const getGenres = async () => {
    let res: any;
    const endpoint = '/genre/movie/list?language=en';
    await api
    .get(endpoint)
    .then((d) => {
        res = d.data
    })
    .catch((err) => {
        res = err.response;
    });
    return res;
};