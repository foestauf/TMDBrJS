class ApiURL {
  urlInstance: URL;
  constructor(url: string) {
    this.urlInstance = new URL(url, 'https://api.themoviedb.org/3/');
  }

  appendParam(key: string, value: string) {
    this.urlInstance.searchParams.append(key, value);
  }

  toString() {
    return this.urlInstance.toString();
  }

  getURL() {
    return this.urlInstance;
  }
}

export default ApiURL;
