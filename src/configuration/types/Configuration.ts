export interface ConfigurationDetails {
  images: {
    baseUrl: string;
    secureBaseUrl: string;
    backdropSizes: string[];
    logoSizes: string[];
    posterSizes: string[];
    profileSizes: string[];
    stillSizes: string[];
  };
  changeKeys: string[];
}

export interface CountryConfig {
  iso31661: string;
  englishName: string;
  nativeName: string;
}

export interface LanguageConfig {
  iso6391: string;
  englishName: string;
  name: string;
}

export interface JobConfig {
  department: string;
  jobs: string[];
}

export interface TimezoneConfig {
  iso31661: string;
  zones: string[];
}
