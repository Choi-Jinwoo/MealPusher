export class URLLib {
  private _url: string;

  constructor(
    private readonly baseURL: string,
  ) {
    this._url = baseURL;
  }

  setQuery(query: { [k: string]: any }) {
    const queryURL = Object.keys(query)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
      .join('&');

    this._url = `${this._url}?${queryURL}`;
  }

  get url(): string {
    return this._url;
  }
}