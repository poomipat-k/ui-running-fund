import { ImageRef } from './banner';

export class Footer {
  id: number;
  logo: ImageRef[];
  contact: FooterContact;

  constructor() {}
}

export class FooterContact {
  email: string;
  phoneNumber: string;
  operatingHour: string;
  fromHour?: string;
  fromMinute?: string;
  toHour?: string;
  toMinute?: string;

  constructor() {}
}
