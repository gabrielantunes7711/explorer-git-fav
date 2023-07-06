export class GithubUser {
  static async search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    const promise = await fetch(endpoint);
    const { login, name, public_repos, followers } = await promise.json();

    return {
      login,
      name,
      public_repos,
      followers,
    };
  }
}
