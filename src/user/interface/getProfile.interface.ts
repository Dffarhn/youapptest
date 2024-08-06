import { Exclude, Expose } from 'class-transformer';

export class UserProfileDTO {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  displayname?: string;

  @Expose()
  gender?: string;

  @Expose()
  birthday?: string;

  @Expose()
  height?: string;

  @Expose()
  weight?: string;

  @Expose()
  horoscope?: string;

  @Expose()
  zodiac?: string;

  constructor(partial: Partial<UserProfileDTO>) {
    Object.assign(this, partial);
  }
}
