import axios, { AxiosInstance } from "axios";
import RoastComment from "../common/RoastComment";

class API {
  public axiosInstance: AxiosInstance;

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({ baseURL });
  }

  public async postComment(comment: RoastComment): Promise<RoastComment> {
    const { data } = await this.axiosInstance.post("/.netlify/functions/comments", comment);
    return data;
  }

  public async putComment(comment: RoastComment): Promise<RoastComment> {
    const { data } = await this.axiosInstance.put(
      `/.netlify/functions/comments/${comment.id}`,
      comment
    );
    return data;
  }

  public async deleteComment(comment: RoastComment): Promise<RoastComment> {
    const { data } = await this.axiosInstance.delete(`/.netlify/functions/comments/${comment.id}`);
    return data;
  }

  public async getRepoAndComments(): Promise<[RoastComment[], IGithubData]> {
    const [comments, repo] = await Promise.all([
      this.getComments(),
      this.getRepo()
    ]);
    return [comments, repo];
  }

  public async getComments(): Promise<RoastComment[]> {
    const result = await this.axiosInstance.get("/.netlify/functions/comments");
    // const { data } = await this.axiosInstance.get("/.netlify/functions/comments");
    const data = result.data;
    data.map((el: any) => {
      return el.data.id = el.ref['@ref'].id;
    });
    const newData = data.flatMap((el: any) => {
      return el.data; 
    });
    
    // data.id = result.data.ref['@ref'].id;
    return newData;
  }

  // function getTodoId(todo) {
  //   if (!todo.ref) {
  //     return null
  //   }
  //   return todo.ref['@ref'].id
  // }

  // todo handle errors obviously
  public async getRepo(): Promise<IGithubData> {
    // return await this.axiosInstance.get(
    //   "https://api.github.com/repos/jludden/ReefLifeSurvey---Species-Explorer/contents/app/src/main/java/me/jludden/reeflifesurvey/detailed/DetailsActivity.kt"
    //      "http://localhost:34567/.netlify/functions/getRepo"

    return (await this.axiosInstance.get("/.netlify/functions/getRepo")).data;
  }

  // old Github API V3 - now using GraphQL V4 in RepoSearch
  // public async searchRepos(query: string): Promise<IGithubSearchResults> {
  //   return await this.axiosInstance.get(
  //     `https://api.github.com/search/repositories?q=${query}`
  //   )
  // }
}

export interface IGithubRepo {
  name: string;
  content: string;
}

export interface IGithubData {
  data: IGithubRepo;
}

export interface IGithubSearchResults {
  data: {
    total_count: number,
    incomplete_results: boolean,
    items: {
      name: string,
      contents_url: string,
      html_url: string,
      description: string,
    }[]
  }
}

// export default new API("http://localhost:3001/");
// export default new API("http://localhost:34567/.netlify/functions/fauna-crud");
// export default new API("http://localhost:9000/fauna-crud");

// https://jludden-react.netlify.com
export default new API();

