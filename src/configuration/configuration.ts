import type { IApiClient } from '..';
import ApiURL from '../utils/apiURL';
import type {
  ConfigurationDetails,
  CountryConfig,
  LanguageConfig,
  JobConfig,
  TimezoneConfig,
} from './types/Configuration';

class Configuration {
  constructor(private readonly apiClient: IApiClient) {}

  async details(): Promise<ConfigurationDetails> {
    const url = new ApiURL('configuration');
    return this.apiClient.get<ConfigurationDetails>(url.toString());
  }

  async countries(): Promise<CountryConfig[]> {
    const url = new ApiURL('configuration/countries');
    return this.apiClient.get<CountryConfig[]>(url.toString());
  }

  async languages(): Promise<LanguageConfig[]> {
    const url = new ApiURL('configuration/languages');
    return this.apiClient.get<LanguageConfig[]>(url.toString());
  }

  async jobs(): Promise<JobConfig[]> {
    const url = new ApiURL('configuration/jobs');
    return this.apiClient.get<JobConfig[]>(url.toString());
  }

  async primaryTranslations(): Promise<string[]> {
    const url = new ApiURL('configuration/primary_translations');
    return this.apiClient.get<string[]>(url.toString());
  }

  async timezones(): Promise<TimezoneConfig[]> {
    const url = new ApiURL('configuration/timezones');
    return this.apiClient.get<TimezoneConfig[]>(url.toString());
  }
}

export default Configuration;
