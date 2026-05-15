class ApiURL {
  urlInstance: URL;
  constructor(url: string) {
    // Dummy base is required so the URL constructor accepts a relative input.
    // We strip it back out in toString() so Client.get can resolve the path
    // against its configured baseUrl.
    this.urlInstance = new URL(url, 'https://placeholder.invalid/');
  }

  appendParam(key: string, value: string) {
    this.urlInstance.searchParams.append(key, value);
  }

  toString() {
    return this.urlInstance.pathname.replace(/^\//, '') + this.urlInstance.search;
  }

  getURL() {
    return this.urlInstance;
  }
}

export default ApiURL;
