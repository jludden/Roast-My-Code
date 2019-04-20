import axios, { AxiosInstance } from 'axios';
import RoastComment from './RoastComment';

class API {
    public axiosInstance: AxiosInstance;
    
    constructor(baseURL: string) { 
        this.axiosInstance = axios.create({baseURL});
    }
    
    public async postComment(comment: RoastComment): Promise<RoastComment> {
        const { data } =  await this.axiosInstance.post("/comments", comment) ;
        return data;
    }

    public async putComment(comment: RoastComment): Promise<RoastComment> {
        const { data }  =  await this.axiosInstance.post(`/comments/${comment.id}`, comment);
        return data;
    }

    public async deleteComment(comment: RoastComment): Promise<RoastComment> {
        const { data } = await this.axiosInstance.delete(`/comments/${comment.id}`);
        return data;
    }

    public async getRepoAndComments(): Promise<[RoastComment[], IGithubData]> {
        const [comments, repo] = await Promise.all([this.getComments(), this.getRepo()]);
        return [comments, repo];
    }

    public async getComments(): Promise<RoastComment[]> { 
        const { data } = await this.axiosInstance.get("/comments");
        return data;
    }

    public async getRepo(): Promise<IGithubData> {
        return await this.axiosInstance.get("https://api.github.com/repos/jludden/ReefLifeSurvey---Species-Explorer/contents/app/src/main/java/me/jludden/reeflifesurvey/detailed/DetailsActivity.kt")
    }
}

export interface IGithubRepo {
    name: string,
    content: string
}

export interface IGithubData {
    data: IGithubRepo
}

export default new API("http://localhost:3001/")